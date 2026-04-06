'use strict';

const Fixtures = require('./fixtures');
const GetZip = require('../lib/getZip');
const FindEntry = require('../lib/findEntry');
const GetZipEntrySha256 = require('../lib/getZipEntrySha256');

describe('getZipEntrySha256', () => {

    let fixtureZip;
    beforeEach(async () => {

        fixtureZip = await GetZip(Fixtures.VALID_ZIP_PATH);
    });

    afterEach(() => {

        fixtureZip.zipFile.close();
    });

    it('should return the hash of an entry', async () => {

        const sha = await GetZipEntrySha256(fixtureZip.zipFile, FindEntry(fixtureZip.entries, 'mimetype'));
        expect(sha).toBe('SfhiIVunWeabZOqZ9cCxFczyt4s5HJVWYHIV1xxcn3I=');
    });

    it.todo('should errback when no such entry');
    it.todo('should errback when corrupt file');

});
