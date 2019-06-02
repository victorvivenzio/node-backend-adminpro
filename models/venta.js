var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ventasSchema = new Schema({
        nombre: {
            type: String,
            required: [true, 'El nombre es requerida']
        },
        apellido1: {
            type: String,
            required: [true, 'El primer apellido es requerida']
        },
        apellido2: {
            type: String
        },
        dni: {
            type: String,
            required: [true, 'El DNI es requerido']
        },
        movil: {
            type: String,
            required: [true, 'El numero movil es requerido']
        },
        importe: {
            type: Number,
            required: [true, 'El precio es requerido']
        },
        tarjeta: {
            type: Schema.Types.ObjectId,
            ref: 'Tarjeta'
        }
    },
    {
      collection: 'ventas'
    });

module.exports = mongoose.model('Ventas', ventasSchema);
