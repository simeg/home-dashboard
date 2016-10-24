'use strict';

if (!process.env.isTravisRunnig)
    var config = Object.freeze(require('./config.json'));

module.exports = {
    filterDeepArray: function(array) {
        var jsonArr = array.map(function(item) {
            return JSON.stringify(item);
        });
        jsonArr = jsonArr.filter(function(error, index, array) {
            return array.indexOf(error) === index;
        });
        return jsonArr.map(function(item) {
            return JSON.parse(item);
        });
    },
    getDateObject: function() {
        var timezoneDiff = 2;
        var dateObj = new Date();
        dateObj.setHours(dateObj.getHours() + timezoneDiff);
        var timeIndex = dateObj.toISOString().indexOf('T');
        var time = dateObj.toISOString().substr(timeIndex+1, 5);
        var date = dateObj.getDate() + '/' + dateObj.getMonth() + ' ' + dateObj.getFullYear();
        return { time: time, date: date };
    },
    getLogger: function() {
        var winston = require('winston');
        var isDevMode = process.env.NODE_ENV !== 'development';

        var consoleTransport = isDevMode ? null : new (winston.transports.Console)();
        var filePath = isDevMode ? config.logging.PATH_TEST : config.logging.PATH;
        var transports = [new (winston.transports.File)({ filename: filePath })];
        if (consoleTransport)
            transports.push(consoleTransport);

        return new winston.Logger({
            level: 'info',
            transports: transports
        }).cli(); // Enable pretty print to CLI
    },
    toPascalCase: function(str) {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
};
