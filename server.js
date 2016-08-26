var express = require('express');
var mongo = require('mongodb').MongoClient;
var app = express();

mongo.connect('mongodb://localhost:27017/url-shortener', function (err, db) {

    if (err) {
        throw new Error('Database failed to connect!');
    } else {
        console.log('MongoDB successfully connected on port 27017.');
    }
    
    app.get('/favicon.ico', function (req, res) {
    });

    app.get('/:number', function (req, res) {
        console.log(req.params.number);
        var urls = db.collection('urls');
        var urlProjection = { '_id': false };
        urls.findOne({ number: req.params.number }, urlProjection, function (err, doc) {
            if (err) {
                throw err;
            }
            
            if(doc) {
                res.redirect(doc.path);
            } else {
                res.json({
                    "error": "This url is not in database."
                });
            }
        });
    });
    
    app.get('/new/:url', function (req, res) {
        console.log(req.params.url)
        var urls = db.collection('urls');
        urls.remove( { } )
        var cursor = urls.find({ $query: {}, $orderby: { number: -1 } });
        console.log(cursor.count())
        var nextNumber = cursor.hasNext() ? cursor.next().number + 1 : 1;
        console.log(nextNumber)
        var doc = { number: nextNumber, path: req.params.url };
        //urls.insertOne(doc);
        var hostName = req.headers.host;
        res.json({ 
            "original_url": doc.path, 
            "short_url": hostName + "/" + doc.number
        });
    });
    
    app.listen(8080, function () {
        console.log('Example app listening on port 8080!');
    });
    
});

