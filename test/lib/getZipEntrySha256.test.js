'use strict';

const Lab = require('lab');
const Fixtures = require('../fixtures');
const GetZip = require('../../lib/getZip');
const FindEntry = require('../../lib/findEntry');
const GetZipEntrySha256 = require('../../lib/getZipEntrySha256');

const { describe, it, expect, beforeEach, afterEach } = exports.lab = Lab.script();

describe('getZipEntrySha256', () => {

    let fixtureZip;
    beforeEach((done) => {

        GetZip(Fixtures.VALID_ZIP_PATH, (err, zip) => {

            fixtureZip = zip;
            done(err);
        });
    });

    afterEach((done) => {

        fixtureZip.zipFile.close();
        done();
    });

    it('should return the hash of an entry', (done) => {

        GetZipEntrySha256(fixtureZip.zipFile, FindEntry(fixtureZip.entries, 'mimetype')).then((sha) => {

            expect(sha).to.equal('SfhiIVunWeabZOqZ9cCxFczyt4s5HJVWYHIV1xxcn3I=');
            done();
        });
    });

    it('should errback when no such entry');
    it('should errback when corrupt file');

});
