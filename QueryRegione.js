var Server = require('./Server.js');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("Covid-19");
    var query = { denominazione_provincia : Server.provincia };
    dbo.collection("Provincia").find(query).toArray(function (err, result) {
        if (err) throw err;
        db.close();
       exports.query = result;
    });
});