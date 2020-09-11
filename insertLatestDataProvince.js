
fs = require('fs');
const mongodb = require("mongodb").MongoClient;
const csvtojson = require("csvtojson");

fs.readdir('./dataset_covid_19_regione_campania/dati_province_latest/', (err, files) => {
    if (!files.length) {
        console.log("Cartella vuota");
    } else {

        var filePath = './dataset_covid_19_regione_campania/dati_province_latest/' + files[0]
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
                            .db("covid_19_regione_campania")
                            .collection("dati_totali_province")
                            .insertMany(csvData, (err, res) => {
                                if (err) throw err;

                                console.log(`Inserite ${res.insertedCount} righe`);
                                client.close();
                            });
                    }
                );
            });
    }
});
