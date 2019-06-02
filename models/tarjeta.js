var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tarjetasSchema = new Schema({
        descripcion: {
            type: String,
            required: [true, 'La descripcion es requerida']
        },
        precio: {
            type: Number,
            required: [true, 'El precio es requerido']
        },
        imagen: {
            type: String,
            required: [true, 'La imagen es requerida']
        },
        stock: {
            type: Number,
            required: true,
            default: 0
        },
    },
    {
      collection: 'tarjetas'
    });

module.exports = mongoose.model('Tarjeras', tarjetasSchema);
