var express = require('express');
var app = express();

var AutheticationMidleware = require('../midlewares/authentication');
const SEED = require('../config/config').SEED;

var Venta = require('../models/venta');

app.get('/', (request, response)=> {
    var offset = Number(request.query.offset) || 0;
    Venta.find({}, 'nombre apellido1 apellido2 dni movil importe')
        .skip(offset)
        .limit(5)
        .exec((error, ventas)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error retrieving data',
                errors: error,
            });
        }
        Venta.count({}, (error, total)=>{
            response.status(200).json({
                ok: true,
                total,
                ventas
            });
        });
    });
});

/**
 * Add Venta
 */
app.post('/', AutheticationMidleware.tokenVerification, (request, response) => {
    var body = request.body;
    var venta = new Venta({
        nombre: body.nombre,
        apellido1: body.apellido1,
        apellido2: body.apellido2,
        dni: body.dni,
        movil: body.movil,
        importe: body.importe,
        tarjeta: body.tarjeta,
    });

    venta.save( ( error, saveVenta )=> {
        if(error) {
            return response.status(400).json({
                ok: false,
                message: 'Error creating Venta',
                errors: error,
            });
        }
        response.status(200).json({
            ok: true,
            tarjeta: saveVenta,
        });
    });

});

/**
 * Get Venta
 */
app.get('/:id', AutheticationMidleware.tokenVerification, (request, response)=> {
    var id = request.params.id || 0;
    Venta.findById( id , 'nombre apellido1 apellido2 dni movil importe' , (error, venta)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                message: 'Error getting Venta',
                errors: error,
            });
        }
        if( !venta ) {
            return response.status(400).json({
                ok: false,
                message: 'Venta doesn\'t exists',
                errors: { message: "Venta doesn't exists"},
            });
        }
        response.status(200).json({
            ok: true,
            data: {
                venta
            }
        });
    });
});
module.exports = app;
