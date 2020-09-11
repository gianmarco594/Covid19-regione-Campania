var mongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var request = require('request');
const csvtojson = require("csvtojson");
const { DH_UNABLE_TO_CHECK_GENERATOR, SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');

function downloadFile(url, path, nameFile) {

    function download(messaggio) {
        request.get(url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                 fs.writeFile(path + nameFile, body, function(err) {
                     if (err) throw err;
                     console.log(messaggio);
                 });
            } else console.log("Errore");
           });
    };

    fs.readdir(path, (err, files) => {
        if (!files.length) {
            console.log("Cartella vuota");
            download("File scaricato per la prima volta");
        } else {
            console.log("Cartella non vuota");
     
            fs.unlink(path + files[0], function(err) {
                if (err) throw err;
                console.log("File già esistente ed eliminato");
            });
     
            download("File scaricato nuovamente");
            //createFullDatabase.js;
        }
     });
};


downloadFile('https://raw.github.com/pcm-dpc/COVID-19/master/legacy/dati-regioni/dpc-covid19-ita-regioni.csv', './dataset_covid_19_regione_campania/dati_regione_full/', 'dpc-covid19-ita-regioni-full.csv');
downloadFile('https://raw.github.com/pcm-dpc/COVID-19/master/legacy/dati-province/dpc-covid19-ita-province.csv', './dataset_covid_19_regione_campania/dati_province_full/', 'dpc-covid19-ita-province-full.csv');


