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

        var casi_totali = dbo.collection("dati_totali_regione").find(query, { projection: {_id: 0, totale_casi: 1 } }).toArray();
        var tamponi = dbo.collection("dati_totali_regione").find(query, { projection: { _id: 0, tamponi: 1 } }).toArray();
        var guariti = dbo.collection("dati_totali_regione").find(query, { projection: { _id: 0, dimessi_guariti: 1 } }).toArray();
        var nuovi_positivi = dbo.collection("dati_totali_regione").find(query, { projection: { _id: 0, nuovi_positivi: 1 } }).toArray();
        var totale_positivi = dbo.collection("dati_totali_regione").find(query, { projection: { _id: 0, totale_positivi: 1 } }).toArray();
        var deceduti = dbo.collection("dati_totali_regione").find(query, {projection: {_id: 0, deceduti: 1 }}).toArray();
        db.close();
        //var risultato = new Array(casi_totali, tamponi, guariti, nuovi_positivi, totale_positivi, deceduti);
        var risultato = [casi_totali, tamponi, guariti, nuovi_positivi, totale_positivi, deceduti];
        var arr = ["A", "B"];
        socket.send(arr);
         
    });

    socket.on('NomeProvincia', function (provincia) {

        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("covid_19_regione_campania");
            var query = { denominazione_provincia: provincia };
            var result = dbo.collection("dati_totali_province").find(query, { projection: { _id: 0, totale_casi: 1 } }).toArray;
                db.close();
            socket.emit("risultato", result);
        });


    });
});

console.log("Il sito si trova su: http://localhost:8080");
