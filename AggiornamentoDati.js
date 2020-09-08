var schedule = require('node-schedule');

//si avviera alle 21:00 di ogni giorno
var j = schedule.scheduleJob('0 21 * * *', function () {
    require('./DownloadFileProvincia.js');
    require('./DownloadFileRegione.js');
});