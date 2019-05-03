// Requires
var express = require('express');
var mongoose = require('mongoose');

// Init vars
var app = express();

//DB Connection
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if ( err ) throw err;
    console.log('DB Online');
});

// Rutas
app.get('/', (request, response, next) => {
    response.status(200).json({
        data: {
            ok: true,
            message: 'OK'
        }
    });
});

// Listen Petition
app.listen(3000, ()=>{
    console.log('Express Server port:3000 \x1b[32m%s\x1b[0m', 'online');
});
