'use strict';

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
    logger: function() {
        var winston = require('winston');
        return new winston.Logger({
            level: 'info',
            transports: [
                new (winston.transports.Console)(),
                new (winston.transports.File)({ filename: config.logging.PATH })
            ]
        });
    },
    toPascalCase: function(str) {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
};
