
fs = require('fs');
var request = require('request');

request.get('https://raw.github.com/pcm-dpc/COVID-19/master/legacy/dati-regioni/dpc-covid19-ita-regioni-20200904.csv', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var csv = body;
        fs.writeFile('dpc-covid19-ita-regioni-20200904.csv', body, function (err) {
            if (err) return console.log(err);
            console.log('done');
        });
    }
});