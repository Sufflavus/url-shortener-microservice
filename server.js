var express = require('express');
var mongo = require('mongodb').MongoClient;
var app = express();

mongo.connect('mongodb://localhost:27017/url-shortener', function (err, db) {

    if (err) {
        throw new Error('Database failed to connect!');
    } else {
        console.log('MongoDB successfully connected on port 27017.');
    }

    app.get('/', function (req, res) {
        res.send('Hello World!');
    });
    
    app.listen(8080, function () {
        console.log('Example app listening on port 8080!');
    });
    
});

