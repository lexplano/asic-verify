'use strict';

const Lab = require('lab');
const Fixtures = require('./fixtures');
const AsicVerify = require('../lib/index');

const { describe, it, expect } = exports.lab = Lab.script();

describe('asic-verify', () => {

    it('should return OK for valid.zip', (done) => {

        AsicVerify(Fixtures.VALID_ZIP_PATH, (err, signatureInfo) => {

            expect(err).not.to.exist();
            expect(signatureInfo.signingCertificate).to.equal(Fixtures.SIGNING_CERTIFICATE_PEM);
            expect(signatureInfo.signingTime).to.equal('2015-07-21T22:00:13Z');
            done();
        });
    });

    it('should errback when no such file', (done) => {

        AsicVerify('no-such-file', (err) => {

            expect(err).to.be.an.error('ENOENT: no such file or directory, open \'no-such-file\'');
            done();
        });
    });

});
