import { VALID_ZIP_PATH } from './fixtures/index.js';
import { getZip } from '../lib/getZip.js';
import { findEntry } from '../lib/findEntry.js';
import { getZipEntrySha256 } from '../lib/getZipEntrySha256.js';

describe('getZipEntrySha256', () => {

    let fixtureZip;
    beforeEach(async () => {

        fixtureZip = await getZip(VALID_ZIP_PATH);
    });

    afterEach(() => {

        fixtureZip.zipFile.close();
    });

    it('should return the hash of an entry', async () => {

        const sha = await getZipEntrySha256(fixtureZip.zipFile, findEntry(fixtureZip.entries, 'mimetype'));
        expect(sha).toBe('SfhiIVunWeabZOqZ9cCxFczyt4s5HJVWYHIV1xxcn3I=');
    });

    it.todo('should errback when no such entry');
    it.todo('should errback when corrupt file');

});
