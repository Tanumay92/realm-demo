'use strict';
const express = require('express'),
    app = express(),
    cors = require('cors'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    ejs = require('ejs'),
    env = require('./env'),
    router = require('./route');

// Middlewares
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../view');
app.use(cors());

app.use(morgan('dev', {
    skip: function (req, res) {
        if (req.url == '/_ah/health') {
            return true;
        } else {
            return false;
        }
    }
})); // 'dev' for development output

app.use(express.static(__dirname + '/../../public'));
app.use(bodyParser.json({limit: '20mb'}));

// Main Routing
app.use('/', router);

module.exports = app;
