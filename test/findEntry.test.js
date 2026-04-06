import { VALID_ZIP_PATH } from './fixtures/index.js';
import { getZip } from '../lib/getZip.js';
import { findEntry } from '../lib/findEntry.js';

describe('findEntry', () => {

    let fixtureZip;
    beforeEach(async () => {

        fixtureZip = await getZip(VALID_ZIP_PATH);
    });

    afterEach(() => {

        fixtureZip.zipFile.close();
    });

    it('should return the entry', () => {

        const entry = findEntry(fixtureZip.entries, 'mimetype');
        expect(entry.fileName).toBe('mimetype');
        expect(entry.crc32).toBe(1173954954);
    });

    it('should throw when no such entry', () => {

        expect(() => findEntry(fixtureZip.entries, 'no-such-file'))
            .toThrow('Could not find exactly one entry for no-such-file');
    });

    it('should throw when entry exists twice (impossible...)', () => {

        expect(() => findEntry([{ fileName: 'wtf' }, { fileName: 'wtf' }], 'wtf'))
            .toThrow('Could not find exactly one entry for wtf');
    });

});
