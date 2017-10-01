'use strict';

const Lab = require('lab');
const Fixtures = require('../fixtures');
const GetZip = require('../../lib/getZip');
const FindEntry = require('../../lib/findEntry');
const GetZipEntryXml = require('../../lib/getZipEntryXml');

const { describe, it, expect, beforeEach, afterEach } = exports.lab = Lab.script();

describe('getZipEntryXml', () => {

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

    it('should return the parsed XML of an entry', (done) => {

        GetZipEntryXml(fixtureZip.zipFile, FindEntry(fixtureZip.entries, 'PaketoInfo.xml')).then((data) => {

            expect(data.xml).to.equal({
                paketoInfo: {
                    'ID': ['8CDFB892-BC65-4192-AA23-907A5F856662'],
                    'PaketoDydisMB': ['1'],
                    'SukūrimoData': ['2015-07-22'],
                    'TeisėsAktaiIki': ['2015-07-21'],
                    'TeisėsAktaiNuo': ['2015-07-21']
                }
            });

            expect(data.raw.toString()).to.equal(Fixtures.PAKETO_INFO_XML);

            expect(data.dom.getElementsByTagName('SukūrimoData')[0].textContent).to.equal('2015-07-22');
            done();
        });
    });

    it('should errback when no such entry');
    it('should errback when corrupt file');

});
