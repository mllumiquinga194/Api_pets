'use strict'

const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');//para validar el correo, aunque puede hacerse con cualquier cosa


let Schema = mongoose.Schema;

let PetsSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    img: {
        type: String,
        required: false
    },
    estado: {
        type: Boolean,
        default: true
    },
    descripcion: {
        type: String,
        default: "Perrito lindo"
    },
    duenio: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
});


PetsSchema.plugin(uniqueValidator, {//para validar el nombre
    message: '{PATH} debe ser unico'
});

module.exports = mongoose.model('Pets', PetsSchema);
