const config = require('./config/config')
const mongoose = require('mongoose');
let app = require('./app')
app.listen(config.port, () => {
    console.log(`Server Running in Port ${config.port}`)
    console.log('Conectando con la base de Datos....')
    mongoose.connect(config.database, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Base de Datos on.')
})