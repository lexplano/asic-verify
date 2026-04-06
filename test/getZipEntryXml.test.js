import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PAKETO_INFO_XML, VALID_ZIP_PATH, CORRUPT_ZIP_ENTRY, createCorruptZipBuffer } from './fixtures/index.js';
import { getZip } from '../lib/getZip.js';
import { findEntry } from '../lib/findEntry.js';
import { getZipEntryXml } from '../lib/getZipEntryXml.js';

describe('getZipEntryXml', () => {

    let fixtureZip;
    beforeEach(async () => {

        fixtureZip = await getZip(VALID_ZIP_PATH);
    });

    afterEach(() => {

        fixtureZip.zipFile.close();
    });

    it('should return the parsed XML of an entry', async () => {

        const data = await getZipEntryXml(fixtureZip.zipFile, findEntry(fixtureZip.entries, 'PaketoInfo.xml'));

        expect(data.xml).toEqual({
            paketoInfo: {
                'ID': ['8CDFB892-BC65-4192-AA23-907A5F856662'],
                'PaketoDydisMB': ['1'],
                'SukūrimoData': ['2015-07-22'],
                'TeisėsAktaiIki': ['2015-07-21'],
                'TeisėsAktaiNuo': ['2015-07-21']
            }
        });

        expect(data.raw.toString()).toBe(PAKETO_INFO_XML);

        expect(data.dom.getElementsByTagName('SukūrimoData')[0].textContent).toBe('2015-07-22');
    });

    it('should reject when no such entry', () => {

        expect(() => getZipEntryXml(fixtureZip.zipFile, findEntry(fixtureZip.entries, 'nonexistent.xml')))
            .toThrow('Could not find exactly one entry for nonexistent.xml');
    });

    it('should reject when corrupt file', async () => {

        const tmpPath = join(tmpdir(), `corrupt-${Date.now()}.zip`);
        writeFileSync(tmpPath, createCorruptZipBuffer());
        const zip = await getZip(tmpPath);
        try {
            await expect(
                getZipEntryXml(zip.zipFile, findEntry(zip.entries, CORRUPT_ZIP_ENTRY))
            ).rejects.toThrow();
        } finally {
            zip.zipFile.close();
            unlinkSync(tmpPath);
        }
    });

});
