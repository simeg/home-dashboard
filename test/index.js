'use strict';

var expect = require('chai').expect;
var utils = require('./../utils.js');
require('mocha-sinon');

describe('Configuration file', function () {
    var config;
    before(function() {
        if (process.env.isTravisRunnig) this.skip();
        config = require('./../config.json');
    });

    it('shall not be empty', function() {
        expect(config).to.not.be.empty;
    });

    it('shall contain metro config', function() {
        expect(config).to.include.keys('metro');
    });

    it('shall contain weather config', function() {
        expect(config).to.include.keys('weather');
    });

    it('shall contain logging config', function() {
        expect(config).to.include.keys('logging');
    });
});

describe('Utilities', function() {
    it('convert to PascalCase', function() {
        var value = 'camelCase';
        var pascalCase = utils.toPascalCase(value);
        var correctResult = 'Camelcase';
        expect(pascalCase).to.equal(correctResult);
    });

    it('filter deep array to only contain unique objects', function() {
        var unfilteredArray = [
            { journey: 'Mars' },
            { journey: 'Mars' },
            { journey: 'Mars' },
            { journey: 'Moon' },
            { journey: 'Jupiter' },
            { journey: 'Jupiter' }
        ];
        var filteredArray = utils.filterDeepArray(unfilteredArray);
        var correctResult = [
            { journey: 'Mars' },
            { journey: 'Moon' },
            { journey: 'Jupiter' }
        ];
        expect(filteredArray).to.deep.equal(correctResult);
    });

    describe('Date Object', function () {
        var dateObj;
        before(function () {
            dateObj = utils.getDateObject();
        });

        it('has correct format of time', function () {
            var time = dateObj.time;
            expect(time).to.match(/(\d{2}:\d{2})/);
        });

        it('has correct format of date', function () {
            var date = dateObj.date;
            expect(date).to.match(/(\d{1,2}\/\d{1,2}) (20\d{2})/);
        });
    });

    describe('Logger', function() {
        var logger;
        before(function() {
            logger = utils.logger();
        });

        it('calls appropriate logging method', function() {
            this.sinon.stub(logger, 'error');
            logger.error('message');
            expect(logger.error.calledOnce).to.be.true;
        });

        it('writes to file when logging', function() {
            var fs = require('fs');
            var randomInt = Math.floor(Math.random() * (100 + 1));
            // Make sure the logged message is somewhat unique
            var msg = randomInt + 'error message' + randomInt;

            logger.log('error', msg, {}, function () {
                fs.readFile('./logs/info.test.log', 'utf8', function (err, data) {
                    expect(data).to.contain(msg);
                    fs.unlink('./logs/info.test.log'); // Delete test file
                });
            });
        });
    });

});
