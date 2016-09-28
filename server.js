var express = require('express');
var Dal = require('./dal.js');
var mongo = require('mongodb').MongoClient;

var dal = new Dal(mongo);
var db;
var app = express();
var path = process.cwd();

// Initialize connection once
dal.connect(function() {
    app.listen(8080, function () {
        console.log('Example app listening on port 8080!');
    });
});

app.get('/favicon.ico', function (req, res) {
});

app.get('/new/*', function (req, res) {
    var url = req.params[0];
    var hostName = req.headers.host;
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    dal.addUrl(url, hostName, res);
});

app.get('/:number', function (req, res) {
    var number = +req.params.number;
    dal.getUrl(number, res);
});

app.get('/', function (req, res) {
  res.sendFile(path + '/public/index.html');
});