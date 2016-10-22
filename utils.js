var config = Object.freeze(require('./config.json'));

module.exports = {
    logger: function() {
        winston = require('winston');
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
