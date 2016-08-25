'use strict';

module.exports = Dal;

function Dal () {
    var dbPath = "mongodb://localhost:27017/url-shortener";
    var urlsCollectionName = "urls";
    
	this.getUrl = function (db, number) {
        var urls = db.collection(urlsCollectionName);
        var urlProjection = { '_id': false };
        urls.findOne({ number: number }, urlProjection, function(err, doc) {
            if(err) {
                throw err;
            }
            
            if(doc) {
                return doc;
            } else {
                return {
                    "error": "This url is not in database."
                };
            }
        });
	};
	
	this.addUrl = function (db, url) {
        var urls = db.collection(urlsCollectionName);
        var cursor = urls.find({}, { number: 1 }).sort({ number: -1 }).limit(1);
        var nextNumber = cursor.hasNext() ? cursor.next().number + 1 : 1;
        var doc = { number: nextNumber, path: url };
        urls.insertOne(doc);
        return doc;
	};
}