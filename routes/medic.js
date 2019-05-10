var express = require('express');
var app = express();

var AutheticationMidleware = require('../midlewares/authentication');
const SEED = require('../config/config').SEED;

var Medic = require('../models/medic');

app.get('/', (request, response)=> {
    var offset = Number(request.query.offset) || 0;
    Medic.find({}, 'name img user hospital')
        .skip(offset)
        .limit(5)
        .populate('user', 'name email')
        .populate('hospital')
        .exec((error, medics)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error retrieving data',
                errors: error,
            });
        }
            Medic.count({}, (error, total)=>{
            response.status(200).json({
                ok: true,
                total,
                medics
            });
        });
    });
});

/**
 * update Medic
 */
app.put( '/:id', AutheticationMidleware.tokenVerification, (request, response) => {
    var id = request.params.id;
    var body = request.body;

    Medic.findById( id, (error, medic)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                message: 'Error getting Medic',
                errors: error,
            });
        }

        if( !medic ) {
            return response.status(400).json({
                ok: false,
                message: 'Medic doesn\'t exists',
                errors: { message: "Medic doesn't exists"},
            });
        }
        medic.name = body.name;
        medic.user = request.userLogged._id;
        medic.hospital = body.hospital;

        medic.save( (error, savedMedic)=>{
            if(error) {
                return response.status(400).json({
                    ok: false,
                    message: 'Error creating Medic',
                    errors: error,
                });
            }
            var returnMedic = ( ({_id, name, img, user, hospital}) => ({_id, name, img, user, hospital}) )(savedMedic);
            response.status(200).json({
                ok: true,
                medic: returnMedic,
            });
        });
    });
});

/**
 * Add Medic
 */
app.post('/', AutheticationMidleware.tokenVerification, (request, response) => {
    var body = request.body;
    var hospital = new Medic({
        name: body.name,
        user: request.userLogged._id,
        hospital: body.hospital
    });
    hospital.save( ( error, saveMedic )=> {

        if(error) {
            return response.status(400).json({
                ok: false,
                message: 'Error creating Medic',
                errors: error,
            });
        }

        response.status(200).json({
            ok: true,
            medic: saveMedic,
        });
    });

});

/**
 * Delete a Medic
 */
app.delete('/:id', AutheticationMidleware.tokenVerification, (request, response) => {
    var id = request.params.id;

    Medic.findByIdAndRemove(id, (error, deletedMedic) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                message: 'Error getting Medic',
                errors: error,
            });
        }

        response.status(200).json({
            ok: true,
            medic: deletedMedic,
        });
    });
});
module.exports = app;
