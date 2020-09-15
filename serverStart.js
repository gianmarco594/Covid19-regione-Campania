var http = require('http');
var fs = require('fs');
var path = require('path');
var socketIO = require('socket.io');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

//creo un processo ed eseguo 'aggiornamentoDati.js'
const exec = require('child_process').exec;

const child = exec('node aggiornamentoDati.js',
    (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    }); 

server = http.createServer(function (request, response) {
        var filePath = '.' + request.url;
        if (filePath == './')
            filePath = './main_dashboard.html';

        var extname = path.extname(filePath);
        var contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
                contentType = 'image/jpg';
                break;
            case '.wav':
                contentType = 'audio/wav';
                break;
        }

        fs.readFile(filePath, function (error, content) {
            if (error) {
                if (error.code == 'ENOENT') {
                    fs.readFile('./404.html', function (error, content) {
                        response.writeHead(200, { 'Content-Type': contentType });
                        response.end(content, 'utf-8');
                    });
                }
                else {
                    response.writeHead(500);
                    response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                    response.end();
                }
            }
            else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        });
   
})

server.listen(8080);

io = socketIO(server);

io.sockets.on('connection', function (socket) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("covid_19_regione_campania");
        var query = {
            denominazione_regione: 'Campania'
        };
        var regione = dbo.collection("dati_totali_regione");
        regione.find(query, {
            projection: {
                _id: 0, totale_casi: 1, tamponi: 1, dimessi_guariti: 1, nuovi_positivi: 1, totale_positivi: 1, deceduti: 1, isolamento_domiciliare: 1, terapia_intensiva: 1, ricoverati_con_sintomi: 1
            }
        }).toArray(function (err, result) {
            if (err) throw err;
            regione.countDocuments(query).then((count) => {
                var casi_totali = new Array();
                var tamponi = new Array();
                var dimessi_guariti = new Array();
                var nuovi_positivi = new Array();
                var totale_positivi = new Array();
                var deceduti = new Array();
                var isolati_domicilio = new Array();
                var terapia = new Array();
                var ricoverati = new Array();
                for (var i = 0; i < count; i++) {
                    casi_totali.push(result[i].totale_casi);
                    tamponi.push(result[i].tamponi);
                    dimessi_guariti.push(result[i].dimessi_guariti);
                    nuovi_positivi.push(result[i].nuovi_positivi);
                    totale_positivi.push(result[i].totale_positivi);
                    deceduti.push(result[i].deceduti);
                    isolati_domicilio.push(result[i].isolamento_domiciliare);
                    terapia.push(result[i].terapia_intensiva);
                    ricoverati.push(result[i].ricoverati_con_sintomi);
                }
                var risultato = {
                    'casi_totali': casi_totali,
                    'tamponi': tamponi,
                    'dimessi_guariti': dimessi_guariti,
                    'nuovi_positivi': nuovi_positivi,
                    'totale_positivi': totale_positivi,
                    'deceduti': deceduti,
                    'isolamento_domiciliare': isolati_domicilio,
                    'terapia_intensiva': terapia,
                    'ricoverati': ricoverati,
                    'ProvinciaMaxCasi': 0,
                    'NomeProvinciaMaxCasi': '',
                    'MaxNuoviPositivi': 0,
                    'DataNuoviPositivi': '',
                    'MaxIsolamentoDomiciliare': 0,
                    'DataIsolamentoDomiciliare': '',
                    'MaxRicoverati_con_sintomi': 0,
                    'DataRicoverati_con_sintomi': '',
                    'MaxTerapia_intensiva': 0,
                    'DataTerapia_intensiva': '',
                };
                regione.find(query).sort({ nuovi_positivi : -1}).limit(1).toArray(function (err, result) {
                    if (err) throw err;
                    risultato.MaxNuoviPositivi = result[0].nuovi_positivi;
                    var dataStr = result[0].data;
                    risultato.DataNuoviPositivi = dataStr.substring(0, 10);
                    if (risultato.DataNuoviPositivi.includes('I')) {
                        risultato.DataNuoviPositivi = dataStr.substring(0, 9);
                    }
                    regione.find(query).sort({ isolamento_domiciliare: -1 }).limit(1).toArray(function (err, result) {
                        if (err) throw err;
                        risultato.MaxIsolamentoDomiciliare = result[0].isolamento_domiciliare;
                        var dataStr = result[0].data;
                        risultato.DataIsolamentoDomiciliare = dataStr.substring(0, 10);
                        if (risultato.DataIsolamentoDomiciliare.includes('I')) {
                            risultato.DataIsolamentoDomiciliare = dataStr.substring(0, 9);
                        }
                        regione.find(query).sort({ ricoverati_con_sintomi: -1 }).limit(1).toArray(function (err, result) {
                            if (err) throw err;
                            risultato.MaxRicoverati_con_sintomi = result[0].ricoverati_con_sintomi;
                            var dataStr = result[0].data;
                            risultato.DataRicoverati_con_sintomi = dataStr.substring(0, 10);
                            if (risultato.DataRicoverati_con_sintomi.includes('I')) {
                                risultato.DataRicoverati_con_sintomi = dataStr.substring(0, 9);
                            }
                            regione.find(query).sort({ terapia_intensiva: -1 }).limit(1).toArray(function (err, result) {
                                if (err) throw err;
                                risultato.MaxTerapia_intensiva = result[0].terapia_intensiva;
                                var dataStr = result[0].data;
                                risultato.DataTerapia_intensiva = dataStr.substring(0, 10);
                                if (risultato.DataTerapia_intensiva.includes('I')) {
                                    risultato.DataTerapia_intensiva = dataStr.substring(0, 9);
                                }
                                var provincie = dbo.collection("dati_totali_province");
                                provincie.find({
                                    $or: [{ "denominazione_provincia": "Caserta" }, { "denominazione_provincia": "Salerno" },
                                    { "denominazione_provincia": "Napoli" }
                                        , { "denominazione_provincia": "Avellino" }, { "denominazione_provincia": "Benevento" }]
                                }).sort({ totale_casi: -1 }).limit(1).toArray(function (err, result) {
                                    if (err) throw err;
                                    risultato.ProvinciaMaxCasi = result[0].totale_casi;
                                    risultato.NomeProvinciaMaxCasi = result[0].denominazione_provincia;
                                    socket.send(risultato);
                                    });
                            });
                        });
                    });
                });
            });
            db.close;
        });
    });

    socket.on('NomeProvincia', function (provincia) {

        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("covid_19_regione_campania");
            var query = { denominazione_provincia: provincia };
            var provinciaC = dbo.collection("dati_totali_province");
            provinciaC.find(query, { projection: { _id: 0, totale_casi: 1 } })
                .toArray(function (err, result) {
                    if (err) throw err;
                    provinciaC.countDocuments(query).then((count) => {
                        //var casi_totali = result[count-1].totale_casi;
                        //socket.emit("risultato", casi_totali);
                        var casi_totali_provincia = new Array();
                        for (var i = 0; i < count; i++) {
                            casi_totali_provincia.push(result[i].totale_casi);
                        }
                        var risultato = {
                            'casi_totali_provincia': casi_totali_provincia
                        };
                        socket.emit("risultato", risultato);
                    });
                    db.close;
                });
        });
    });
});
    console.log("Il sito si trova su: http://localhost:8080");