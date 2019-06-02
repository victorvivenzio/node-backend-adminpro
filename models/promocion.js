var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var promocionesSchema = new Schema({
        nombre: {
            type: String,
            required: [true, 'El nombre de la promocion es requerido']
        },
        fecha_inicio: {
            type: String,
            required: [true, 'La fecha de Inicio es requerida']
        },
        fecha_fin: {
            type: String,
            required: [true, 'La fecha de finalizacion es requerida']
        },
        titulo: {
            type: String,
            required: [true, 'El titulo de la promocion es requerido']
        },
        mensaje: {
            type: String,
            required: [true, 'El mensaje de la promocion es requerido']
        },
        archivo: {
            type: String,
            required: false
        },
        estado: {
            type: Number,
            required: true,
            default: 0
        },
    },
    {
      collection: 'promociones'
    });

module.exports = mongoose.model('Promociones', promocionesSchema);
