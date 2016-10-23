'use strict';

var expect = require('chai').expect;
var utils = require('./../utils.js');
var request = require('request');

describe('config.json', function () {
    var config;
    before(function() {
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

    it('returns logger', function() {
        var winston = require('winston');
        var logger = utils.logger();
        expect(logger).to.not.be.equal(undefined);
    });
});