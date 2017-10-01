'use strict';

const Lab = require('lab');
const Fixtures = require('../fixtures');
const DerToPem = require('../../lib/derToPem');

const { describe, it, expect } = exports.lab = Lab.script();

const normalizeString = function (str) {

    return str.toString().trim().replace(/\r/g, '');
};

describe('derToPem', () => {

    it('should convert DER to PEM', (done) => {

        const ACTUAL_PEM = DerToPem(Fixtures.SIGNING_CERTIFICATE_DER);
        expect(normalizeString(ACTUAL_PEM)).to.equal(Fixtures.SIGNING_CERTIFICATE_PEM);
        done();
    });

});
