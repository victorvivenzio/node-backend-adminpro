var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

exports.tokenVerification = function(req, res, next) {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    var token = req.headers.authorization.split(' ')[1];

    jwt.verify( token, SEED, (error, decoded) => {
        if(error) {
            return res.status(401).json({
                ok: false,
                message: 'Unauthorized',
                errors: error,
            });
        }
        req.userLogged = decoded.user;
        next();
    });

};
