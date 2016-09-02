'use strict';

module.exports = Dal;

function Dal (mongo) {
    var dbPath = "mongodb://localhost:27017/url-shortener";
    var urlsCollectionName = "urls";
    
	this.getUrl = function (number) {
	    mongo.connect(dbPath, function (err, db) {
            if (err) {
                throw new Error('Database failed to connect!');
            } else {
                console.log('MongoDB successfully connected on port 27017.');
            }
	        
	        var urls = db.collection(urlsCollectionName);
        
            urls.findOne({ number: number }, function (err, doc) {
                //TODO: close connection
                
                if (err) {
                    throw err;
                }
                
                if(doc) {
                    return doc;
                } else {
                    throw "This url is not in database.";
                }
            });
	    });
	};
	
	this.addUrl = function (url) {
	    mongo.connect(dbPath, function (err, db) {
            if (err) {
                throw new Error('Database failed to connect!');
            } else {
                console.log('MongoDB successfully connected on port 27017.');
            }
	        
	        var urls = db.collection(urlsCollectionName);
        
            urls.find({ $query: {}, $orderby: { number: -1 } }).limit(1).toArray(function(err, items) {
                //TODO: close connection
                
                if (err) {
                    throw err;
                }
                
                var nextNumber = items.length ? items[0].number + 1 : 1;
                
                var doc = { number: nextNumber, path: url };
                
                urls.insertOne(doc, function(err, newDocs){
                    if (err) {
                        throw err;
                    }
                    
                    return newDocs.ops[0];
                });
            });
	    });
	};
}