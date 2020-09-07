
        fs = require('fs');
        var request = require('request');
var url = 'https://raw.github.com/pcm-dpc/COVID-19/master/legacy/dati-regioni/dpc-covid19-ita-regioni-';
let date_ob = new Date();
fs.readdir('./Dataset_Covid-19/Regione', (err, files) => {
    if (!files.length) {
        console.log("empty");
    } else {
        var Namefile = files[0];
        var data = date_ob.getFullYear() + '' + ("0" + (date_ob.getMonth() + 1)).slice(-2) + '' + ("0" + date_ob.getDate()).slice(-2); 
        var file = 'dpc-covid19-ita-regioni-'+data+ '.csv';
        if (Namefile == file) {
            console.log("Gia Scaricato");
        } else {
            url = url + '' + data + '.csv';
            request.get(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var csv = body;
                    var file = './Dataset_Covid-19/Regione/' + file;
                    fs.writeFile(file, body, function (err) {
                        if (err) return console.log(err);
                        console.log('done');
                        url = url + '' + data + '.csv';
                        request.get(url, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var csv = body;
                                var file = './Dataset_Covid-19/Regione/dpc-covid19-ita-regioni-' + data + '.csv';
                                fs.writeFile(file, body, function (err) {
                                    if (err) return console.log(err);
                                    console.log('done');
                                    //eliminzaione file
                                    Nomefile = './Dataset_Covid-19/Regione/' + Nomefile;
                                    fs.unlink(Nomefile, function (err) {
                                        if (err) throw err;
                                        console.log('File deleted!');
                                    });
                                    require('./InsertDatiRegione.js');
                                });
                            }
                        });
                    });
                } else {
                    console.log("File ancora non  esistente");
                }
            });
        }
    }
});