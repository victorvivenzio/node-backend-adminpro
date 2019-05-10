var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var Medic = require('../models/medic');
var User = require('../models/user');

app.get('/all/:q', (request, response, next) => {
    var q = request.params.q;
    var search = new RegExp(q, 'i');

    Promise.all([
        searchHospitals(q,search),
        searchMedics(q,search),
        searchUsers(q,search),
    ]).then( (responses) => {
        response.status(200).json({
            ok: true,
            search: q,
            message: 'OK',
            hospitals: responses[0],
            medics: responses[1],
            users: responses[2],
        });
    });
});


app.get('/collection/:table/:q', (request, response, next) => {
    var q = request.params.q;
    var search = new RegExp(q, 'i');
    var table = request.params.table;
    var promise;
    switch (table) {
        case 'hospitals':
            promise = searchHospitals(q,search);
            break;
        case 'medics':
            promise = searchMedics(q,search);
            break;
        case 'users':
            promise = searchUsers(q,search);
            break;
        default:
            response.status(500).json({
                ok: false,
                errors: 'Table is not valid',
            });
            break;
    }
    promise.then( data => {

        response.status(200).json({
            ok: true,
            search: q,
            message: 'OK',
            [table]: data,
        });
    });
});

function searchHospitals(q, regexp) {
    return new Promise( (resolve, reject) => {
        Hospital.find({ name: regexp })
            .populate('user', 'name email')
            .exec((error, hospitals) => {
            if (error) {
                reject('Error finding Hospital', error);
            } else {
                resolve(hospitals);
            }
        });
    });
}

function searchMedics(q, regexp) {
    return new Promise( (resolve, reject) => {
        Medic.find({ name: regexp })
            .populate('user', 'name email')
            .populate('hospital', 'name')
            .exec((error, medics) => {
                if (error) {
                    reject('Error finding Medics', error);
                } else {
                    resolve(medics);
                }
            });
    });
}

function searchUsers(q, regexp) {
    return new Promise( (resolve, reject) => {
        User.find({}, 'name email role')
            .or( [{name: regexp},{email: regexp}] )
            .exec((error, users) => {
                if (error) {
                    reject('Error finding Hospital', error);
                } else {
                    resolve(users);
                }
            });
    });
}

module.exports = app;
