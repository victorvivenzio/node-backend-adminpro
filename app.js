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
var hospitalRoutes = require('./routes/hospital');
var medicRoutes = require('./routes/medic');
var loginRoutes = require('./routes/login');
var searchRoutes = require('./routes/search');
var uploadRoutes = require('./routes/upload');
var imagesRoutes = require('./routes/images');

//DB Connection
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if ( err ) throw err;
    console.log('DB connection:\x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.use('/users/', userRoutes);
app.use('/hospitals/', hospitalRoutes);
app.use('/medics/', medicRoutes);
app.use('/login/', loginRoutes);
app.use('/search/', searchRoutes);
app.use('/upload/', uploadRoutes);
app.use('/img/', imagesRoutes);
app.use('/', appRoutes);

// Listen Petition
app.listen(3000, ()=>{
    console.log('Express Server port3000:\x1b[32m%s\x1b[0m', 'online');
});
