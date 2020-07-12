const express = require('express')
const pcr = require('../model/pcr')
const user = require('../model/user')
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificarToken } = require('../middleware/autenticacion')
let pcrRoute = express.Router()
//Agrega
pcrRoute.post('/add', verificarToken, (req, res) => {
    let body = req.body
    let Pcr = new pcr({
        nombre: body.nombre,
        direccion: body.direccion,
        estado: body.estado,
        email: body.email,
        pin: body.pin,
        celular: body.celular,
        asignado: body.asignado
    })
    Pcr.save((err, PcrDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: PcrDB
        })

    })
})

//Edita
pcrRoute.post('/edit/:id', verificarToken, (req, res) => {
    let id = req.params.id
    let body = req.body
    pcr.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, pcrdb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if(!pcrdb){
            return res.status(400).json({
                ok: false,
                err:'No se encontro usuario'
            } )
        }


        res.json({
            ok: true,
            pcr: pcrdb
        })
    })

})

//Elimina
pcrRoute.post('/delete/:id', verificarToken, (req, res) => {
    let id = req.params.id
    pcr.findByIdAndDelete(id, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                err: 'Usuario no Encontrado'
            })
        }
        res.json({
            ok: true,
            usuario: usuario
        })
    })
})

//lista
pcrRoute.get('/list', verificarToken, (req, res) => {
    let desde = req.query.desde || 0
    desde = Number(desde)
    let limite = req.query.limite || 5;
    limite = Number(limite)
    pcr.find({})
        .skip(desde)
        .limit(limite)
        .exec((err, pcrdb) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            pcr.count({}, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({ conteo, ok: true, pcr: pcrdb })

            })
        })
})


//inhabilita usuario
pcrRoute.post('/enable/:id', verificarToken, (req, res) => {
    let id = req.params.id
    let body = { estado: false }
    pcr.findByIdAndUpdate(id, body, (err, pcrDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            pcr: pcrDB
        })
    })
})

pcrRoute.post('/login', (req, res) => {

    let body = req.body
    user.findOne({ email: body.email }, (err, usuariodb) => {

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

        pcr.findOne({ asignado: body.email }, (err, pcrDb) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: { mensaje: 'usuario sin Pcr Asignado' }
                })
            }

            let token = jwt.sign({ pcr: pcrDb}, config.seed, { expiresIn: config.caducidadToken })

            res.status(200).json({
                ok: false,
                data: {
                    usuario: usuariodb,
                    pcr: pcrDb
                } ,
                token: token
            })
        })

})})
module.exports = pcrRoute