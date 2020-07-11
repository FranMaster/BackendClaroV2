const express = require('express')
const config=require('../config/config')
const Usuario = require('../model/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {verificarTokenUrl}=require('../middleware/autenticacion')
let nav=express.Router()
nav.get('/',(req,res)=>{res.render('login')})
nav.get('/admin',verificarTokenUrl,(req,res)=>{ res.render('administrador',{})})
nav.get('/pcr',verificarTokenUrl,(req,res)=>{  res.render('pcr',{})})
nav.get('/caminantes',verificarTokenUrl,(req,res)=>{  res.render('caminantes',{})})
nav.post('/login',(req,res)=>{

    let body = req.body
    Usuario.findOne({ email: body.email }, (err, usuariodb) => {
 
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuariodb) {
          return  res.render('login')
        }

        if (!bcrypt.compareSync(body.password, usuariodb.password)) {
            res.render('login',{validacion:'Credenciales erroneas'})
        }
    
        let token = jwt.sign({
            usuario: usuariodb
        }, config.seed, { expiresIn: config.caducidadToken })
     
        res.render('mainPage',{
            ok: true,
            usuario: usuariodb,
            token: token,
            SideBarUser:usuariodb.nombre
        })
    })
  
})
module.exports=nav