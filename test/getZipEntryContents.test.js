import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { VALID_ZIP_PATH, CORRUPT_ZIP_ENTRY, createCorruptZipBuffer } from './fixtures/index.js';
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

    it('should reject when no such entry', () => {

        expect(() => getZipEntryContents(fixtureZip.zipFile, findEntry(fixtureZip.entries, 'nonexistent.txt')))
            .toThrow('Could not find exactly one entry for nonexistent.txt');
    });

    it('should reject when corrupt file', async () => {

        const tmpPath = join(tmpdir(), `corrupt-${Date.now()}.zip`);
        writeFileSync(tmpPath, createCorruptZipBuffer());
        const zip = await getZip(tmpPath);
        try {
            await expect(
                getZipEntryContents(zip.zipFile, findEntry(zip.entries, CORRUPT_ZIP_ENTRY))
            ).rejects.toThrow();
        } finally {
            zip.zipFile.close();
            unlinkSync(tmpPath);
        }
    });

});
