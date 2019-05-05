var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

var app = express();

var User = require('../models/user');

app.post('/', (request, response)=>{
    var body = request.body;

    User.findOne({ email: body.email }, (error, user)=>{
        if(error) {
            return response.status(500).json({
                ok: false,
                message: 'Error getting User',
                errors: error,
            });
        }

        if(!user) {
            return response.status(400).json({
                ok: false,
                message: 'Incorrect credentials',
                errors: {
                    message:  'Incorrect credentials'
                },
            });
        }

        if(!bcrypt.compareSync(body.password, user.password) ) {
            return response.status(400).json({
                ok: false,
                message: 'Incorrect credentials',
                errors: {
                    message:  'Incorrect credentials'
                },
            });
        }

        var token = jwt.sign( { user }, SEED, { expiresIn: 14400 } );
        user.password = '*********';
        response.status(200).json({
            ok: true,
            token,
            user
        });
    });

});

module.exports = app;
