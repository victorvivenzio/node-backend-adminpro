var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

exports.tokenVerification = function(request, response, next) {
    var token = request.query.token;

    jwt.verify( token, SEED, (error, decoded) => {
        if(error) {
            return response.status(401).json({
                ok: false,
                message: 'Unauthorized',
                errors: error,
            });
        }
        request.userLogged = decoded.user;
        next();
    });

};
