const express = require('express')
const config= require('../config/config')
const Usuario = require('../model/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {verificarToken}=require('../middleware/autenticacion')
let nav=express.Router()
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
            return res.status(400).json({
                ok: false,
                err: { mensaje: 'credenciales invalidas ingrese correo o password valido' }
            })
        }

        if (!bcrypt.compareSync(body.password, usuariodb.password)) {
            return res.status(400).json({
                ok: false,
                err: { mensaje: 'credenciales invalidas ingrese correo o password valido' }
            })
        }
    
        let token = jwt.sign({
            usuario: usuariodb
        }, config.seed, { expiresIn: config.caducidadToken })
     
        res.status(200).json({
            ok: false,
            usuario: usuariodb,
            token: token,
       
           })       
    })
  
})
module.exports=nav