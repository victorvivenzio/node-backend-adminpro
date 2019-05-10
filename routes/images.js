var express = require('express');
var app = express();

const path = require('path');
const fs = require('fs');

app.get('/:type/:img', (request, response) => {

    var type = request.params.type;
    var img = request.params.img;

    var pathImg = path.resolve(__dirname, `../uploads/${type}/${img}`);

    if( fs.existsSync(pathImg)) {
        response.sendFile(pathImg);
    } else {
        var pathNoImg = path.resolve(__dirname,  `../assets/no-img.jpg`);
        response.sendFile(pathNoImg);
    }
});

module.exports = app;
