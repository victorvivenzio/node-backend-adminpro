var express = require('express');
var app = express();

var jwt = require('jsonwebtoken');
var AutheticationMidleware = require('../midlewares/authentication');
const SEED = require('../config/config').SEED;

var Hospital = require('../models/hospital');

app.get('/', (request, response)=> {
    var offset = Number(request.query.offset) || 0;
    Hospital.find({}, 'name img user')
        .skip(offset)
        .limit(5)
        .populate('user', 'name email')
        .exec( (error, hospitals)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error retrieving data',
                errors: error,
            });
        }
        Hospital.count({}, (error, total)=>{
            response.status(200).json({
                ok: true,
                total,
                hospitals
            });
        });
    });
});

/**
 * update hospital
 */
app.put( '/:id', AutheticationMidleware.tokenVerification, (request, response) => {
    var id = request.params.id;
    var body = request.body;

    Hospital.findById( id, (error, hospital)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                message: 'Error getting Hospital',
                errors: error,
            });
        }

        if( !hospital ) {
            return response.status(400).json({
                ok: false,
                message: 'Hospital doesn\'t exists',
                errors: { message: "Hospital doesn't exists"},
            });
        }
        hospital.name = body.name;
        hospital.user = request.userLogged._id;

        hospital.save( (error, savedHospital)=>{
            if(error) {
                return response.status(400).json({
                    ok: false,
                    message: 'Error creating Hospital',
                    errors: error,
                });
            }
            var returnHospital = ( ({_id, name, img}) => ({_id, name, img}) )(savedHospital);
            response.status(200).json({
                ok: true,
                user: returnHospital,
            });
        });
    });
});

/**
 * Add Hospital
 */
app.post('/', AutheticationMidleware.tokenVerification, (request, response) => {
    var body = request.body;
    var hospital = new Hospital({
        name: body.name,
        user: request.userLogged._id
    });
    hospital.save( ( error, saveHospital )=> {

        if(error) {
            return response.status(400).json({
                ok: false,
                message: 'Error creating Hospital',
                errors: error,
            });
        }

        response.status(200).json({
            ok: true,
            hospital: saveHospital,
        });
    });

});

/**
 * Delete a User
 */
app.delete('/:id', AutheticationMidleware.tokenVerification, (request, response) => {
    var id = request.params.id;

    Hospital.findByIdAndRemove(id, (error, deletedHospital) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                message: 'Error getting Hospital',
                errors: error,
            });
        }

        response.status(200).json({
            ok: true,
            hospital: deletedHospital,
        });
    });
});
module.exports = app;
