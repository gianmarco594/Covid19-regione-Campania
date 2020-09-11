var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

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

http.createServer(function (request, response) {
    var urlProvincia = request.url;
    if (urlProvincia.includes("NomeProvincia")) {
        var q = url.parse(urlProvincia, true);
        qprovincia = q.query;
        exports.provincia = qprovincia.NomeProvincia;
        var dati = require('./QueryRegione.js');
        response.writeHead(200, { 'Content-Type': "text/plain" });
        response.end(dati.query);
    } else {
        var filePath = '.' + request.url;
        if (filePath == './')
            filePath = './../client/main_dashboard.html';

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
    }
   
}).listen(8080);

console.log("Il sito si trova su: http://localhost:8080");
