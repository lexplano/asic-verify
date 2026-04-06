import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { VALID_ZIP_PATH, CORRUPT_ZIP_ENTRY, createCorruptZipBuffer, createCorruptLocalHeaderBuffer } from './fixtures/index.js';
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

    it('should reject when no such entry', () => {

        expect(() => getZipEntrySha256(fixtureZip.zipFile, findEntry(fixtureZip.entries, 'nonexistent.txt')))
            .toThrow('Could not find exactly one entry for nonexistent.txt');
    });

    it('should reject when corrupt file', async () => {

        const tmpPath = join(tmpdir(), `corrupt-${Date.now()}.zip`);
        writeFileSync(tmpPath, createCorruptZipBuffer());
        const zip = await getZip(tmpPath);
        try {
            await expect(
                getZipEntrySha256(zip.zipFile, findEntry(zip.entries, CORRUPT_ZIP_ENTRY))
            ).rejects.toThrow();
        } finally {
            zip.zipFile.close();
            unlinkSync(tmpPath);
        }
    });

    it('should reject when entry cannot be opened', async () => {

        const tmpPath = join(tmpdir(), `corrupt-header-${Date.now()}.zip`);
        writeFileSync(tmpPath, createCorruptLocalHeaderBuffer());
        const zip = await getZip(tmpPath);
        try {
            await expect(
                getZipEntrySha256(zip.zipFile, findEntry(zip.entries, 'mimetype'))
            ).rejects.toThrow();
        } finally {
            zip.zipFile.close();
            unlinkSync(tmpPath);
        }
    });

});
