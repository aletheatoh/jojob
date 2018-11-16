var express = require('express');
var router = require('./routes/routes.js')
var path = require('path');
var bodyParser = require('body-parser');
require('dotenv').load();

var app = express();

    /* "start": "npm run webpack && nodemon --exec babel-node -- bin/www", */

var mongoose = require('mongoose');

var mongo = require('mongodb');

// app.set('view engine', 'html');
// app.set('views', path.join(__dirname, '../public'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../src')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

//Set up default mongoose connection
var mongoDB = "mongodb+srv://aletheatoh:Cheerful1%21@cluster0-gtafv.mongodb.net/test?retryWrites=false";

mongoose.connect(mongoDB);

// Get Mongoose to use the global promise library
// mongoose.Promise = global.Promise;
//Get the default connection
// var db = mongoose.connection;
//
// //Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// mongoose.connect(process.env.MONGOLAB_NAVY_URI ||  `mongodb://${process.env.REACT_APP_DB_USERNAME}:${process.env.REACT_APP_DB_PASSWORD}@ds119800.mlab.com:19800/project_4`);

const base_url = process.env.BASE_URL || process.env.ENV_URL;

app.use('/', router);
//
// var port = 8000
//
// app.listen(process.env.PORT || port, function() {
//   console.log('running at localhost: ' + port);
// });

module.exports=app;
