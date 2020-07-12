const express = require('express');
const path =require('path')
const bodyParser = require('body-parser') 
const hbs  = require('hbs'); 
const nav=require('./routes/navigation')
const api=require('./routes/api')
const users=require('./routes/user')
const pcr=require('./routes/pcr')
const recargas=require('./routes/recarga')
let app = express(); 
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(path.resolve(__dirname,'./views/partials'));
app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())
app.use('/',nav)
app.use('/api',api)
app.use('/user',users)
app.use('/pcr',pcr)
app.use('/recarga',recargas)
module.exports=app
