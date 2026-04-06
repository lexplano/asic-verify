'use strict';

const Fixtures = require('./fixtures');
const GetZip = require('../lib/getZip');
const FindEntry = require('../lib/findEntry');
const GetZipEntryContents = require('../lib/getZipEntryContents');

describe('getZipEntryContents', () => {

    let fixtureZip;
    beforeEach(async () => {

        fixtureZip = await GetZip(Fixtures.VALID_ZIP_PATH);
    });

    afterEach(() => {

        fixtureZip.zipFile.close();
    });

    it('should return the contents of an entry', async () => {

        const contents = await GetZipEntryContents(fixtureZip.zipFile, FindEntry(fixtureZip.entries, 'mimetype'));
        expect(contents.toString()).toBe('application/vnd.etsi.asic-e+zip');
    });

    it.todo('should errback when no such entry');
    it.todo('should errback when corrupt file');

});
