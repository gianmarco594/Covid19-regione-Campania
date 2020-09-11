var mongoClient = require('mongodb').MongoClient;
var fs = require('fs');
const csvtojson = require("csvtojson");
const { DH_UNABLE_TO_CHECK_GENERATOR } = require('constants');

function createDatabase(path, nameDatabase, nameCollection) {
    fs.readdir(path, (err, files) => {
        if (!files.length) {
            console.log("Cartella vuota");
        } else {
            var filePath = path + files[0]
            let url = "mongodb://localhost:27017/";
            csvtojson().fromFile(filePath).then(csvData => {
                        mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
                            if (err) throw err;
                            client.db(nameDatabase).collection(nameCollection).insertMany(csvData, (err, res) => {
                                    if (err) throw err;
                                    console.log(`Inserite ${res.insertedCount} righe`);
                                    client.close();
                            });
                        });
            });
        }
    });
};

createDatabase('./dataset_covid_19_regione_campania/dati_regione_full/', "covid_19_regione_campania", "dati_totali_regione");
createDatabase('./dataset_covid_19_regione_campania/dati_province_full/', "covid_19_regione_campania", "dati_totali_province");