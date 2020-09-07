
fs = require('fs');
const mongodb = require("mongodb").MongoClient;
const csvtojson = require("csvtojson");

fs.readdir('./Dataset_Covid-19/Provincia', (err, files) => {
    if (!files.length) {
        console.log("empty");
    } else {

        var filePath = './Dataset_Covid-19/Provincia' + files[0]
        let url = "mongodb://localhost:27017/";

        csvtojson()
            .fromFile(filePath)
            .then(csvData => {

                mongodb.connect(
                    url,
                    { useNewUrlParser: true, useUnifiedTopology: true },
                    (err, client) => {
                        if (err) throw err;

                        client
                            .db("Covid-19")
                            .collection("Provincia")
                            .insertMany(csvData, (err, res) => {
                                if (err) throw err;

                                console.log(`Inserted: ${res.insertedCount} rows`);
                                client.close();
                            });
                    }
                );
            });
    }
});
