
fs = require('fs');
var request = require('request');
var url = 'https://raw.github.com/pcm-dpc/COVID-19/master/legacy/dati-regioni/dpc-covid19-ita-regioni-';
let date_ob = new Date();
var data = date_ob.getFullYear() + '' + ("0" + (date_ob.getMonth() + 1)).slice(-2) + '' + ("0" + date_ob.getDate()).slice(-2);
url = url + '' + data+'.csv';
request.get(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var csv = body;
        var file = 'dpc-covid19-ita-regioni-' + data+'.csv';
        fs.writeFile(file, body, function (err) {
            if (err) return console.log(err);
            console.log('done');
        });
    }
});