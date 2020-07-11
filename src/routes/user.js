const express = require('express')
const Usuario = require('../model/user')
const bcrypt = require('bcrypt');
const _ = require('underscore');
const {verificarToken}=require('../middleware/autenticacion')
let user = express.Router()
//Agrega
user.post('/add', verificarToken,(req, res) => {
    let body = req.body

    let User = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    User.save((err, userDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: User
        })

    })

})

//Edita
user.post('/edit/:id',verificarToken, (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuario
        })
    })

})

//Elimina
user.post('/delete/:id',verificarToken, (req, res) => {
    let id = req.params.id
    Usuario.findByIdAndDelete(id, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if(!usuario){
            return res.status(404).json({
                ok: false,
                err:'Usuario no Encontrado'
            })
        }
        res.json({
            ok: true,
            usuario: usuario
        })
    })
})

//lista
user.get('/list', verificarToken,(req, res) => {
    let desde = req.query.desde || 0
    desde = Number(desde)
    let limite = req.query.limite || 5;
    limite = Number(limite)
    Usuario.find({},'nombre email role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuario) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.count({}, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({ conteo, ok: true, usuario: usuario })

            })
        })
})


//inhabilita usuario
user.post('/enable/:id',verificarToken,(req,res)=>{
    let id = req.params.id
    let body ={estado:false}
    Usuario.findByIdAndUpdate(id, body, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuario
        })
    })
})


module.exports = user