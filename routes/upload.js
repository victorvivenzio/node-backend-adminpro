var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

var User = require('../models/user');
var Hospital = require('../models/hospital');
var Medic = require('../models/medic');

app.use(fileUpload());

app.put('/:type/:id', (request, response) => {

    var type = request.params.type;
    var id = request.params.id;

    if (!request.files) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Error retrieving file',
            errors: { message: 'Not file selected'},
        });
    }

    var file = request.files.image;
    var splitName = file.name.split('.');
    var ext = splitName[splitName.length-1];

    var validExt = ['jpg', 'jpeg', 'gif', 'png'];
    var validTypes = ['hospitals', 'medics', 'users'];

    if(validExt.indexOf(ext.toLowerCase()) < 0){
        return response.status(400).json({
            ok: false,
            mensaje: 'Extension not valid',
            errors: {
                message: 'Valid extension are:' + validExt.join(', ')
            }
        });
    }

    if(validTypes.indexOf(type) < 0){
        return response.status(400).json({
            ok: false,
            mensaje: 'Type not valid',
            errors: {
                message: 'Valid types are:' + validTypes.join(', ')
            }
        });
    }

    var path = `uploads/${type}/`;
    var filename = `${id}-${ new Date().getMilliseconds() }.${ext}`;


    file.mv(path + filename, function(err) {
        if (err){
            return response.status(400).json({
                ok: false,
                mensaje: 'Error retrieving file',
                errors: { message: 'Not file selected'},
            });
        }
        uploadByType(type, id, filename, response);
    });

});

function uploadByType(type, id, filename, res){
    var path = `uploads/${type}/`;
    switch (type) {
        case 'users':
            User.findById(id , (err, user) => {
                if(user.img) {
                    var oldImg = path+user.img;
                    if (fs.existsSync(oldImg)) {
                        fs.unlink(oldImg, error => {
                            if(error){
                                return res.status(400).json({
                                    ok: false,
                                    mensaje: 'Error deleting file',
                                    errors: { error },
                                });
                            }
                        });
                    }
                }

                user.img = filename;
                user.save( (err, savedUser) => {
                    savedUser.password = '********'
                    return res.status(200).json({
                        data: {
                            ok: true,
                            message: 'Image upload successfully',
                            user: savedUser,
                        }
                    });
                });
            });

            break;
        case 'medics':
            Medic.findById(id , (err, medic) => {
                if(medic.img) {
                    var oldImg = path+medic.img;
                    if (fs.existsSync(oldImg)) {
                        fs.unlink(oldImg, error => {
                            if(error){
                                return res.status(400).json({
                                    ok: false,
                                    mensaje: 'Error deleting file',
                                    errors: { error },
                                });
                            }
                        });
                    }
                }

                medic.img = filename;
                medic.save( (err, savedMedic) => {
                    return res.status(200).json({
                        data: {
                            ok: true,
                            message: 'Image upload successfully',
                            user: savedMedic,
                        }
                    });
                });
            });
            break;
        case 'hospitals':
            Hospital.findById(id , (err, hospital) => {
                if(hospital.img) {
                    var oldImg = path+hospital.img;
                    if (fs.existsSync(oldImg)) {
                        fs.unlink(oldImg, error => {
                            if(error){
                                return res.status(400).json({
                                    ok: false,
                                    mensaje: 'Error deleting file',
                                    errors: { error },
                                });
                            }
                        });
                    }
                }

                hospital.img = filename;
                hospital.save( (err, savedHospital) => {
                    return res.status(200).json({
                        data: {
                            ok: true,
                            message: 'Image upload successfully',
                            user: savedHospital,
                        }
                    });
                });
            });
            break;

    }

}

module.exports = app;
