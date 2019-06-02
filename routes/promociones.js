var express = require('express');
var app = express();

var jwt = require('jsonwebtoken');
var AutheticationMidleware = require('../midlewares/authentication');
const SEED = require('../config/config').SEED;

var Promocion = require('../models/promocion');

app.get('/', AutheticationMidleware.tokenVerification, (request, response)=> {
    var offset = Number(request.query.offset) || 0;
    Promocion.find({})
        .skip(offset)
        .exec( (error, promociones)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error retrieving data',
                errors: error,
            });
        }
        Promocion.count({}, (error, total)=>{
            response.status(200).json({
                ok: true,
                total,
                data: {
                    promociones
                }
            });
        });
    });
});

/**
 * Add Promocion
 */
app.post('/', AutheticationMidleware.tokenVerification, (request, response) => {
    var body = request.body;
    var promocion = new Promocion({
        nombre: body.nombre,
        fecha_inicio: body.fecha_inicio,
        fecha_fin: body.fecha_fin,
        titulo: body.titulo,
        mensaje: body.mensaje,
    });

    promocion.save( ( error, savePromocion )=> {
        if(error) {
            return response.status(400).json({
                ok: false,
                message: 'Error creating Promocion',
                errors: error,
            });
        }
        response.status(200).json({
            ok: true,
            recarga: savePromocion,
        });
    });

});
module.exports = app;
