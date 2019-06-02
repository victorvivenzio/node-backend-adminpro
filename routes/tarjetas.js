var express = require('express');
var app = express();

var AutheticationMidleware = require('../midlewares/authentication');
const SEED = require('../config/config').SEED;

var Tarjeta = require('../models/tarjeta');

app.get('/', (request, response)=> {
    var offset = Number(request.query.offset) || 0;
    Tarjeta.find({}, 'descripcion precio imagen stock')
        .skip(offset)
        .limit(5)
        .exec((error, tarjetas)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error retrieving data',
                errors: error,
            });
        }
            Tarjeta.count({}, (error, total)=>{
            response.status(200).json({
                ok: true,
                total,
                tarjetas
            });
        });
    });
});
/**
 * update Tarjeta
 */
app.put( '/:id', AutheticationMidleware.tokenVerification, (request, response) => {
    var id = request.params.id;
    var body = request.body;

    Tarjeta.findById( id, (error, tarjeta)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                message: 'Error getting Tarjeta',
                errors: error,
            });
        }

        if( !tarjeta ) {
            return response.status(400).json({
                ok: false,
                message: 'Tarjeta doesn\'t exists',
                errors: { message: "Tarjeta doesn't exists"},
            });
        }
        tarjeta.name = body.name;
        tarjeta.user = request.userLogged._id;
        tarjeta.hospital = body.hospital;

        tarjeta.save( (error, savedTarjeta)=>{
            if(error) {
                return response.status(400).json({
                    ok: false,
                    message: 'Error creating Tarjeta',
                    errors: error,
                });
            }
            var returnTarjeta = ( ({_id, name, img, user, hospital}) => ({_id, name, img, user, hospital}) )(savedTarjeta);
            response.status(200).json({
                ok: true,
                tarjeta: returnTarjeta,
            });
        });
    });
});

/**
 * Add Tarjeta
 */
app.post('/', AutheticationMidleware.tokenVerification, (request, response) => {
    var body = request.body;

    var tarjeta = new Tarjeta({
        name: body.descripcion,
        precio: body.precio,
        imagen: body.imagen,
        stock: body.stock,
    });
    tarjeta.save( ( error, saveTarjeta )=> {
        if(error) {
            return response.status(400).json({
                ok: false,
                message: 'Error creating Tarjeta',
                errors: error,
            });
        }
        response.status(200).json({
            ok: true,
            tarjeta: saveTarjeta,
        });
    });

});

/**
 * Delete a Tarjeta
 */
app.delete('/:id', AutheticationMidleware.tokenVerification, (request, response) => {
    var id = request.params.id;

    Tarjeta.findByIdAndRemove(id, (error, deletedTarjeta) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                message: 'Error getting Tarjeta',
                errors: error,
            });
        }

        response.status(200).json({
            ok: true,
            tarjeta: deletedTarjeta,
        });
    });
});

/**
 * Get tarjeta
 */
app.get('/:id', AutheticationMidleware.tokenVerification, (request, response)=> {
    var id = request.params.id || 0;
    Tarjeta.findById( id , 'descripcion precio imagen stock' , (error, tarjeta)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                message: 'Error getting Tarjeta',
                errors: error,
            });
        }
        if( !tarjeta ) {
            return response.status(400).json({
                ok: false,
                message: 'Tarjeta doesn\'t exists',
                errors: { message: "Tarjeta doesn't exists"},
            });
        }
        response.status(200).json({
            ok: true,
            data: {
                tarjeta
            }
        });
    });
});
module.exports = app;
