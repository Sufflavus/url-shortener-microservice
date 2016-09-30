var express = require('express');
var Dal = require('./dal.js');
var mongo = require('mongodb').MongoClient;

var dal = new Dal(mongo);
var app = express();
var path = process.cwd();

var port = process.env.PORT || 1024;

dal.connect(function() {
    app.listen(port, function () {
        console.log('Example app listening on port ' + port);
    });
});

app.get('/favicon.ico', function (req, res) {
});

app.get('/new/*', function (req, res) {
    var url = req.params[0];
    var hostName = req.protocol + '://' + req.headers.host;
    dal.addUrl(url, hostName, res);
});

app.get('/:number', function (req, res) {
    var number = +req.params.number;
    dal.getUrl(number, res);
});

app.get('/', function (req, res) {
  res.sendFile(path + '/public/index.html');
});