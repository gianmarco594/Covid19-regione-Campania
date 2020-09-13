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
                    'ricoverati': ricoverati
                };
                socket.send(risultato);
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
                        var casi_totali = result[count-1].totale_casi;
                        socket.emit("risultato", casi_totali);
                    });
                    db.close;
                });
        });
    });
});
    console.log("Il sito si trova su: http://localhost:8080");