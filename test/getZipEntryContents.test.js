import { VALID_ZIP_PATH } from './fixtures/index.js';
import { getZip } from '../lib/getZip.js';
import { findEntry } from '../lib/findEntry.js';
import { getZipEntryContents } from '../lib/getZipEntryContents.js';

describe('getZipEntryContents', () => {

    let fixtureZip;
    beforeEach(async () => {

        fixtureZip = await getZip(VALID_ZIP_PATH);
    });

    afterEach(() => {

        fixtureZip.zipFile.close();
    });

    it('should return the contents of an entry', async () => {

        const contents = await getZipEntryContents(fixtureZip.zipFile, findEntry(fixtureZip.entries, 'mimetype'));
        expect(contents.toString()).toBe('application/vnd.etsi.asic-e+zip');
    });

    it.todo('should errback when no such entry');
    it.todo('should errback when corrupt file');

});
