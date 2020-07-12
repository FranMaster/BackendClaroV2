const express = require('express')
const recarga = require('../model/recarga')
const bcrypt = require('bcrypt');
const _ = require('underscore');
const {verificarToken}=require('../middleware/autenticacion')
let recargaRoute = express.Router()
//Agrega
recargaRoute.post('/add', verificarToken,(req, res) => {
    let body = req.body
    let recargas = new recarga({
        fechaRecarga: body.fechaRecarga,
        pcr: body.pcr,
        mensaje:body.mensaje,       
        email:body.email 
          
    })
    recargas.save((err, recargaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: recargaDB
        })

    })
})
//listaTODOS
recargaRoute.get('/list', verificarToken,(req, res) => {
    let desde = req.query.desde || 0
    desde = Number(desde)
    let limite = req.query.limite || 5;
    limite = Number(limite)
    recarga.find({})
        .skip(desde)
        .limit(limite)
        .exec((err, recargadb) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            recarga.count({}, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({ conteo, ok: true, recarga: recargadb })

            })
        })
})

recargaRoute.get('/listRecargas', verificarToken,(req, res) => {
    let desde = req.query.desde || 0
    desde = Number(desde)
    let limite = req.query.limite || 5;
    limite = Number(limite)
    let body =req.body
    recarga.find({email:body.email})
        .skip(desde)
        .limit(limite)
        .exec((err, recargadb) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            recarga.count({email:body.email}, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({ conteo, ok: true, recarga: recargadb })

            })
        })
})
module.exports = recargaRoute