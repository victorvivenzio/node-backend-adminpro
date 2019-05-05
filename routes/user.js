var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;
var AutheticationMidleware = require('../midlewares/authentication');

var User = require('../models/user');

/**
 * Get all users
 */
app.get('/', (request, response, next) => {
    User.find({}, 'name email img role').exec((error, users)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error retrieving data',
                errors: error,
            });
        }
        response.status(200).json({
            ok: true,
            users
        });
    });
});

/**
 * update user
 */
app.put( '/:id', (request, response) => {
    var id = request.params.id;
    var body = request.body;


    User.findById( id, (error, user)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                message: 'Error getting User',
                errors: error,
            });
        }

        if( !user ) {
            return response.status(400).json({
                ok: false,
                message: 'User doesn\'t exists',
                errors: { message: "User doesn't exists"},
            });
        }
        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save( (error, savedUser)=>{
            if(error) {
                return response.status(400).json({
                    ok: false,
                    message: 'Error creating User',
                    errors: error,
                });
            }
            var returnUser = ( ({_id, name, email, role}) => ({_id, name, email,role}) )(savedUser);
            response.status(200).json({
                ok: true,
                user: returnUser,
            });
        });
    });
});

/**
 * Add user
 */
app.post('/', AutheticationMidleware.tokenVerification, (request, response) => {
    var body = request.body;
    var usuario = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        img: body.img,
        role: body.role,
    });

    usuario.save( ( error, saveUser )=> {

        if(error) {
            return response.status(400).json({
                ok: false,
                message: 'Error creating User',
                errors: error,
            });
        }

        response.status(200).json({
            ok: true,
            user: saveUser,
            userLogged: request.userLogged,
        });
    });

});

/**
 * Delete a User
 */
app.delete('/:id', (request, response) => {
    var id = request.params.id;


    User.findByIdAndRemove(id, (error, deletedUser) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                message: 'Error getting User',
                errors: error,
            });
        }

        response.status(200).json({
            ok: true,
            user: deletedUser,
        });
    });
});

module.exports = app;
