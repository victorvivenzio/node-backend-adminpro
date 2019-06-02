var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

const {OAuth2Client} = require('google-auth-library');

const CLIENT_ID = require('../config/config').CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

var app = express();

var User = require('../models/user');

app.post('/', (request, response)=>{
    var body = request.body;

    User.findOne({ email: body.username }, (error, user)=>{
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
            data: {
                token,
                user
            }
        });
    });
});

/**
 * Google Sign in
 */
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }
}

app.post('/google', async (request, response)=>{
    var token = request.body.token;
    var googleUser = await verify( token )
        .catch(
            e => {
                return response.status(403).json({
                    ok: false,
                    message: 'Incorrect credentials',
                    errors: 'Token no valido',
                });
            }
        );

    User.findOne( {email: googleUser.email}, (err, user) => {
        if(err){
            return response.status(500).json({
                ok: false,
                message: 'Error getting User',
                errors: error,
            });
        }

        if(user && user.google === false){
            return response.status(403).json({
                ok: false,
                message: 'Not authorized to log with google',
                errors: 'Token no valido',
            });
        }

        if(user) {
            var token = jwt.sign( { user }, SEED, { expiresIn: 14400 } );
            user.password = '*********';
            return response.status(200).json({
                ok: true,
                data: {
                    token,
                    user
                }
            });
        } else {
            var newUser = new User();
            newUser.name = googleUser.name;
            newUser.email = googleUser.email;
            newUser.img = googleUser.img;
            newUser.password = '********';
            newUser.google = true;

            newUser.save( (err, savedUser) => {
                if(err){
                    return response.status(500).json({
                        ok: false,
                        message: 'Error getting User',
                        errors: error,
                    });
                }

                var token = jwt.sign( { user: savedUser }, SEED, { expiresIn: 14400 } );
                savedUser.password = '*********';
                return response.status(200).json({
                    ok: true,
                    data: {
                        token,
                        savedUser
                    }
                });
            });
        }
    });
});


module.exports = app;
