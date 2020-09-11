var schedule = require('node-schedule');

//si avviera alle 21:00 di ogni giorno
var j = schedule.scheduleJob('0 21 * * *', function () {
    require('./downloadLatestDataProvince.js');
    require('./downloadLatestDataRegione.js');
});