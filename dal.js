'use strict';

module.exports = Dal;

function Dal (MongoClient) {
    var dbPath = "mongodb://user:123456@ds013916.mlab.com:13916/urls";
    var urlsCollectionName = "urls";
    var db;
    
    this.connect = function(callback) {
        // Initialize connection once
        MongoClient.connect(dbPath, function(err, database) {
          if(err) {
              throw err;
          }
          
          db = database;
          console.log("Listening on port 3000");
          callback();
        });
    };
    
	this.getUrl = function (number, res) {
	    var urls = db.collection(urlsCollectionName);
        
        urls.findOne({ number: number }, function (err, doc) {
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
	};
	
	this.addUrl = function (url, hostName, res) {
	    var urls = db.collection(urlsCollectionName);
        
        urls.find({ $query: {}, $orderby: { number: -1 } }).limit(1).toArray(function(err, items) {
            
            if (err) {
                throw err;
            }
            
            var nextNumber = items.length ? items[0].number + 1 : 1;
            
            var doc = { number: nextNumber, path: url };
            
            urls.insertOne(doc, function(err, newDocs){
                if (err) {
                    throw err;
                }
                
                var newItem = newDocs.ops[0];
                
                res.json({ 
                    "original_url": newItem.path, 
                    "short_url": hostName + "/" + newItem.number
                });    
            });
        });
	};
}