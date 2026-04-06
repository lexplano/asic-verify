'use strict';

const Fixtures = require('./fixtures');
const GetZip = require('../lib/getZip');
const FindEntry = require('../lib/findEntry');
const GetZipEntryXml = require('../lib/getZipEntryXml');

describe('getZipEntryXml', () => {

    let fixtureZip;
    beforeEach(async () => {

        fixtureZip = await GetZip(Fixtures.VALID_ZIP_PATH);
    });

    afterEach(() => {

        fixtureZip.zipFile.close();
    });

    it('should return the parsed XML of an entry', async () => {

        const data = await GetZipEntryXml(fixtureZip.zipFile, FindEntry(fixtureZip.entries, 'PaketoInfo.xml'));

        expect(data.xml).toEqual({
            paketoInfo: {
                'ID': ['8CDFB892-BC65-4192-AA23-907A5F856662'],
                'PaketoDydisMB': ['1'],
                'SukūrimoData': ['2015-07-22'],
                'TeisėsAktaiIki': ['2015-07-21'],
                'TeisėsAktaiNuo': ['2015-07-21']
            }
        });

        expect(data.raw.toString()).toBe(Fixtures.PAKETO_INFO_XML);

        expect(data.dom.getElementsByTagName('SukūrimoData')[0].textContent).toBe('2015-07-22');
    });

    it.todo('should errback when no such entry');
    it.todo('should errback when corrupt file');

});
