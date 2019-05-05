// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Init vars
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');

//DB Connection
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if ( err ) throw err;
    console.log('DB connection:\x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.use('/users/', userRoutes);
app.use('/login/', loginRoutes);
app.use('/', appRoutes);

// Listen Petition
app.listen(3000, ()=>{
    console.log('Express Server port3000:\x1b[32m%s\x1b[0m', 'online');
});
