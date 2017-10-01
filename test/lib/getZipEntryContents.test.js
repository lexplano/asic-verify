'use strict';

const Lab = require('lab');
const Fixtures = require('../fixtures');
const GetZip = require('../../lib/getZip');
const FindEntry = require('../../lib/findEntry');
const GetZipEntryContents = require('../../lib/getZipEntryContents');

const { describe, it, expect, beforeEach, afterEach } = exports.lab = Lab.script();

describe('getZipEntryContents', () => {

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

    it('should return the contents of an entry', (done) => {

        GetZipEntryContents(fixtureZip.zipFile, FindEntry(fixtureZip.entries, 'mimetype')).then((contents) => {

            expect(contents.toString()).to.equal('application/vnd.etsi.asic-e+zip');
            done();
        });
    });

    it('should errback when no such entry');
    it('should errback when corrupt file');

});
