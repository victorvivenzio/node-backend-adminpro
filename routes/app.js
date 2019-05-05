var express = require('express');
var app = express();

app.get('/', (request, response, next) => {
    response.status(200).json({
        data: {
            ok: true,
            message: 'OK'
        }
    });
});

module.exports = app;
