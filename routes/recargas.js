var express = require('express');
var app = express();

var AutheticationMidleware = require('../midlewares/authentication');
const SEED = require('../config/config').SEED;

var Recarga = require('../models/recarga');

app.get('/', (request, response)=> {
    var offset = Number(request.query.offset) || 0;
    Recarga.find({}, 'dni mp digitos importe validacion')
        .skip(offset)
        .limit(5)
        .exec((error, recargas)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error retrieving data',
                errors: error,
            });
        }
        Recarga.count({}, (error, total)=>{
            response.status(200).json({
                ok: true,
                total,
                recargas
            });
        });
    });
});

/**
 * Add Recarga
 */
app.post('/', AutheticationMidleware.tokenVerification, (request, response) => {
    var body = request.body;
    var recarga = new Recarga({
        dni: body.dni,
        mp: body.mp,
        digitos: body.digitos,
        importe: body.importe,
        codigo: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6),
    });

    recarga.save( ( error, saveRecarga )=> {
        if(error) {
            return response.status(400).json({
                ok: false,
                message: 'Error creating Recarga',
                errors: error,
            });
        }
        response.status(200).json({
            ok: true,
            recarga: saveRecarga,
        });
    });

});

/**
 * Validate Recarga
 */
app.post('/validate', AutheticationMidleware.tokenVerification, (request, response) => {
    let id = request.body._id;
    let codigo = request.body.numero_validacion;

    Recarga.findById( id , 'dni mp digitos importe validacion codigo' , (error, recarga)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                message: 'Error getting Recarga',
                errors: error,
            });
        }
        if( !recarga ) {
            return response.status(400).json({
                ok: false,
                message: 'Recarga doesn\'t exists',
                errors: { message: "Recarga doesn't exists"},
            });
        }
        if( recarga.codigo !== codigo) {
            return response.status(400).json({
                ok: false,
                message: 'Codigo Invalido',
                errors: { message: "Codigo Invalido"},
            });
        }
        recarga.validacion = true;
        recarga.save( (error, savedRecarga)=>{
            if(error) {
                return response.status(400).json({
                    ok: false,
                    message: 'Error creating User',
                    errors: error,
                });
            }
            var returnRecarga = ( ({_id, dni, importe}) => ({_id, dni, importe}) )(savedRecarga);
            response.status(200).json({
                ok: true,
                recarga: returnRecarga,
            });
        });
    });
});

/**
 * Get Recarga
 */
app.get('/:id', AutheticationMidleware.tokenVerification, (request, response)=> {
    var id = request.params.id || 0;
    Recarga.findById( id , 'dni mp digitos importe validacion' , (error, recarga)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                message: 'Error getting Recarga',
                errors: error,
            });
        }
        if( !recarga ) {
            return response.status(400).json({
                ok: false,
                message: 'Recarga doesn\'t exists',
                errors: { message: "Recarga doesn't exists"},
            });
        }
        response.status(200).json({
            ok: true,
            data: {
                recarga
            }
        });
    });
});
module.exports = app;
