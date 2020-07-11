const jwt =require('jsonwebtoken')
const config = require('../config/config')
const query=require('querystring')
let verificarToken=(req,res,next)=>{
    let token =req.get('token')
    jwt.verify(token,config.seed,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err
            })}
        req.usuario=decoded.usuario;
        next(); }) 
    }
let verificarTokenUrl=(req,res,next)=>{
    let token =req.query.token
    jwt.verify(token,config.seed,(err,decoded)=>{
        if(err){
            return res.render('login')}
        req.usuario=decoded.usuario;
        next(); })   
}
module.exports={ verificarToken,verificarTokenUrl}