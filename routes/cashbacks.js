var express = require('express');
var app = express();

var AutheticationMidleware = require('../midlewares/authentication');
const SEED = require('../config/config').SEED;

var Cashback = require('../models/cashback');

app.get('/', (request, response)=> {
    var offset = Number(request.query.offset) || 0;
    Cashback.find({}, 'dni mp digitos importe validacion')
        .skip(offset)
        .limit(5)
        .exec((error, cashback)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error retrieving data',
                errors: error,
            });
        }
        Cashback.count({}, (error, total)=>{
            response.status(200).json({
                ok: true,
                total,
                cashback
            });
        });
    });
});

/**
 * Add Cashback
 */
app.post('/', AutheticationMidleware.tokenVerification, (request, response) => {
    var body = request.body;
    var cashback = new Cashback({
        dni: body.dni,
        mp: body.mp,
        digitos: body.digitos,
        importe: body.importe,
        codigo: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6),
    });

    cashback.save( ( error, saveCashback )=> {
        if(error) {
            return response.status(400).json({
                ok: false,
                message: 'Error creating Cashback',
                errors: error,
            });
        }
        response.status(200).json({
            ok: true,
            cashback: saveCashback,
        });
    });

});

/**
 * Validate Cashback
 */
app.post('/validate', AutheticationMidleware.tokenVerification, (request, response) => {
    let id = request.body._id;
    let codigo = request.body.numero_validacion;

    Cashback.findById( id , 'dni mp digitos importe validacion codigo' , (error, cashback)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                message: 'Error getting Cashback',
                errors: error,
            });
        }
        if( !cashback ) {
            return response.status(400).json({
                ok: false,
                message: 'Cashback doesn\'t exists',
                errors: { message: "Cashback doesn't exists"},
            });
        }
        if( cashback.codigo !== codigo) {
            return response.status(400).json({
                ok: false,
                message: 'Codigo Invalido',
                errors: { message: "Codigo Invalido"},
            });
        }
        cashback.validacion = true;
        cashback.save( (error, savedCashback)=>{
            if(error) {
                return response.status(400).json({
                    ok: false,
                    message: 'Error creating User',
                    errors: error,
                });
            }
            var returnCashback = ( ({_id, dni, importe}) => ({_id, dni, importe}) )(savedCashback);
            response.status(200).json({
                ok: true,
                cashback: returnCashback,
            });
        });
    });
});

/**
 * Get Cashback
 */
app.get('/:id', AutheticationMidleware.tokenVerification, (request, response)=> {
    var id = request.params.id || 0;
    Cashback.findById( id , 'dni mp digitos importe validacion' , (error, cashback)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                message: 'Error getting Cashback',
                errors: error,
            });
        }
        if( !cashback ) {
            return response.status(400).json({
                ok: false,
                message: 'Cashback doesn\'t exists',
                errors: { message: "Cashback doesn't exists"},
            });
        }
        response.status(200).json({
            ok: true,
            data: {
                cashback
            }
        });
    });
});
module.exports = app;
