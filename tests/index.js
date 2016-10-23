'use strict';

var expect = require('chai').expect;
var utils = require('./../utils.js');

describe('Utilities', function() {
    it('convert to PascalCase', function() {
        var value = 'camelCase';
        var pascalCase = utils.toPascalCase(value);
        expect(pascalCase).to.equal('Camelcase');
    });
});