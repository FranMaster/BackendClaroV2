const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let recargaSchema = new Schema({
    fechaRecarga: {
        type: Date,default:Date.now
    },
    pcr: {
        type: String,
       },  
    mensaje: {
        type: String,      
    },    

    email:{
        type:String
    }
});

module.exports = mongoose.model('recarga', recargaSchema)