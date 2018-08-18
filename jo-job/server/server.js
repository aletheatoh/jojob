var express = require('express');
var router = require('./routes/routes.js')
var path = require('path');
var bodyParser = require('body-parser');
require('dotenv').load();

var app = express();

    /* "start": "npm run webpack && nodemon --exec babel-node -- bin/www", */

var mongoose = require('mongoose');
//
// app.set('view engine', 'html');
// app.set('views', path.join(__dirname, '../public'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../src')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

mongoose.connect(process.env.MONGOLAB_NAVY_URI ||  `mongodb://${process.env.REACT_APP_DB_USERNAME}:${process.env.REACT_APP_DB_PASSWORD}@ds119800.mlab.com:19800/project_4`);

const base_url = process.env.BASE_URL || process.env.ENV_URL;

app.use('/', router);
//
// var port = 8000
//
// app.listen(process.env.PORT || port, function() {
//   console.log('running at localhost: ' + port);
// });

module.exports=app;
