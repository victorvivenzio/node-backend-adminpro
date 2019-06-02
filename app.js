// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors')

// Init vars
var app = express();

// Enable cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
    next();
});

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');
var promocionesRoutes = require('./routes/promociones');
var tarjetasRoutes = require('./routes/tarjetas');
var ventasRoutes = require('./routes/ventas');
var recargasRoutes = require('./routes/recargas');
var cashbacksRoutes = require('./routes/cashbacks');

//DB Connection
mongoose.connection.openUri('mongodb://localhost:27017/pecunpayDB', (err, res) => {
    if ( err ) throw err;
    console.log('DB connection:\x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.use('/auth/', userRoutes);
app.use('/auth/login/', loginRoutes);
app.use('/promociones/', promocionesRoutes);
app.use('/tarjetas/', tarjetasRoutes);
app.use('/ventas/', ventasRoutes);
app.use('/recargas/', recargasRoutes);
app.use('/cashback/', cashbacksRoutes);

app.use('/', appRoutes);

// Listen Petition
app.listen(3000, ()=>{
    console.log('Express Server port3000:\x1b[32m%s\x1b[0m', 'online');
});
