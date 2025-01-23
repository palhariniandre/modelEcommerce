// packets
const compression = require('compression');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');   
const cors = require('cors');

//START
const app = express();

// Ambiente
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;


//Arquivos estáticos
app.use("/public", express.static(__dirname + '/public'));
app.use("/public/images", express.static(__dirname + '/public/images'));

//SETUP mongodb
const db = require('./config/database');
const dbURI = isProduction ? db.dbProduction : db.dbTest;
mongoose.connect(dbURI, { useNewUrlParser: true });

//Setup EJS
app.set('view engine', 'ejs');

//Configuracoes
if (!isProduction) app.use(morgan('dev'));
app.use(cors());
app.disable('x-powered-by');
app.use(compression()); 

//Setup BodyParser
app.use(bodyParser.urlencoded({ extended: false, limit: 1.5 * 1024 * 1024 }));
app.use(bodyParser.json({ limit: 1.5 * 1024 * 1024 }));

//Models
require('./model');

//Routes
app.use(require('./routes'));

//404 - route
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Error Handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    if (err.status !== 404) console.warn('Error:', err.message, new Date());
    res.json({errors : {message: err.message, status: err.status}});
});


//Start Server
app.listen(PORT, (err) => {
    if (err) console.log(err);
    else 
    console.log(`Server running on http://localhost:${PORT}/`);
});