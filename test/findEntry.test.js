'use strict';

const Lab = require('lab');
const Fixtures = require('./fixtures');
const GetZip = require('../lib/getZip');
const FindEntry = require('../lib/findEntry');

const { describe, it, expect, beforeEach, afterEach } = exports.lab = Lab.script();

describe('findEntry', () => {

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

    it('should return the entry', (done) => {

        const entry = FindEntry(fixtureZip.entries, 'mimetype');
        expect(entry.fileName).to.equal('mimetype');
        expect(entry.crc32).to.equal(1173954954);
        done();
    });

    it('should throw when no such entry', (done) => {

        try {
            FindEntry(fixtureZip.entries, 'no-such-file');
        }
        catch (e) {
            expect(e).to.be.an.error('Could not find exactly one entry for no-such-file');
            done();
        }
    });

    it('should throw when entry exists twice (impossible...)', (done) => {

        try {
            FindEntry([{ fileName: 'wtf' }, { fileName: 'wtf' }], 'wtf');
        }
        catch (e) {
            expect(e).to.be.an.error('Could not find exactly one entry for wtf');
            done();
        }
    });

});
