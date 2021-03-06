var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var recargaSchema = new Schema({
        dni: {
            type: String,
            required: [true, 'DNI es requerido']
        },
        mp: {
            type: String,
            required: [true, 'MP es requerido']
        },
        digitos: {
            type: String
        },
        importe: {
            type: Number,
            required: [true, 'El importe es requerido']
        },
        validacion: {
            type: Boolean,
            default: 0
        },
        codigo: {
            type: String
        },
    },
    {
      collection: 'recargas'
    });

module.exports = mongoose.model('Recargas', recargaSchema);
