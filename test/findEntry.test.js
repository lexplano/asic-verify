'use strict';

const Fixtures = require('./fixtures');
const GetZip = require('../lib/getZip');
const FindEntry = require('../lib/findEntry');

describe('findEntry', () => {

    let fixtureZip;
    beforeEach(async () => {

        fixtureZip = await GetZip(Fixtures.VALID_ZIP_PATH);
    });

    afterEach(() => {

        fixtureZip.zipFile.close();
    });

    it('should return the entry', () => {

        const entry = FindEntry(fixtureZip.entries, 'mimetype');
        expect(entry.fileName).toBe('mimetype');
        expect(entry.crc32).toBe(1173954954);
    });

    it('should throw when no such entry', () => {

        expect(() => FindEntry(fixtureZip.entries, 'no-such-file'))
            .toThrow('Could not find exactly one entry for no-such-file');
    });

    it('should throw when entry exists twice (impossible...)', () => {

        expect(() => FindEntry([{ fileName: 'wtf' }, { fileName: 'wtf' }], 'wtf'))
            .toThrow('Could not find exactly one entry for wtf');
    });

});
