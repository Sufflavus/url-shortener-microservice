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

/*mongo.connect('mongodb://localhost:27017/url-shortener', function(err, database) {
    if (err) {
        throw new Error('Database failed to connect!');
    } else {
        console.log('MongoDB successfully connected on port 27017.');
    }

    db = database;

    // Start the application after the database connection is ready
    app.listen(8080, function () {
        console.log('Example app listening on port 8080!');
    });
});*/

app.get('/favicon.ico', function (req, res) {
});

app.get('/:number', function (req, res) {
    var number = +req.params.number;
    dal.getUrl(number, res);
    
    /*var urls = db.collection('urls');
    
    urls.findOne({ number: +req.params.number }, function (err, doc) {
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
    });*/
});

app.get('/new/:url', function (req, res) {
    console.log(req.params.url)
    var url = req.params.url;
    var hostName = req.headers.host;
    dal.addUrl(url, hostName, res);
    
    /*var urls = db.collection('urls');
    
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
    });*/
});

app.get('/', function (req, res) {
  res.sendFile(path + '/public/index.html');
});


app.get('/*', function (req, res) {
    //console.log(!req.params)
    if(!req.params.length || req.params[0].indexOf("new/") !== 0) {
        res.json({
            "error": "This url is not in database."
        });
        return;
    }
    
    
    console.log(req.params)
    var url = req.params[0].substring(4);
    
    var hostName = req.headers.host;
    dal.addUrl(url, hostName, res);
});