const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let pcrSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    direccion: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },  
    
    estado: {
        type: Boolean,
        default: true
    },

    pin:{
        type:String
    },
  
    emailCaminantes:[String],

    asignado:{type:String}

});

module.exports = mongoose.model('Pcr', pcrSchema)