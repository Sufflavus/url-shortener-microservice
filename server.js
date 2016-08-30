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
        urls.findOne({ number: req.params.number }, function (err, doc) {
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
        var urls = db.collection('urls');
        
        urls.find({ $query: {}, $orderby: { number: -1 } }).limit(1).toArray(function(err, items) {
            if (err) {
                throw err;
            }
            
            var nextNumber = items.length ? items[0].number + 1 : 1;
            
            var doc = { number: nextNumber, path: req.params.url };
            
            urls.insertOne(doc, function(err, newDocs){
                if (err) {
                    throw err;
                }
                
                var newItem = newDocs.ops[0];
                var hostName = req.headers.host;
                
                res.json({ 
                    "original_url": newItem.path, 
                    "short_url": hostName + "/" + newItem.number
                });    
            });
        });
    });
    
    app.listen(8080, function () {
        console.log('Example app listening on port 8080!');
    });
    
});

