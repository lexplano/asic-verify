'use strict';

const Fixtures = require('./fixtures');
const GetZip = require('../lib/getZip');
const Yauzl = require('yauzl');

describe('getZip', () => {

    it('should return a zip descriptor with entries', async () => {

        const zip = await GetZip(Fixtures.VALID_ZIP_PATH);
        expect(zip.zipFile).toBeInstanceOf(Yauzl.ZipFile);
        expect(zip.zipFile).toMatchObject({ isOpen: true });
        expect(zip.entries.map(({ fileName }) => fileName).sort()).toEqual([
            '20150721-0b35d3402fae11e5b1be8e104a145478.zip',
            '20150721-0de8d7a02ee511e5b1be8e104a145478.zip',
            '20150721-1aa3ae602f7211e5b1be8e104a145478.zip',
            '20150721-1c44f7f02f9611e5b1be8e104a145478.zip',
            '20150721-229bade02fa711e5b1be8e104a145478.zip',
            '20150721-251c08702fad11e5b1be8e104a145478.zip',
            '20150721-2609cd002f6f11e5b1be8e104a145478.zip',
            '20150721-31fc17502f7211e5b1be8e104a145478.zip',
            '20150721-43a281102fa911e5b1be8e104a145478.zip',
            '20150721-4b6d56f02eea11e5b1be8e104a145478.zip',
            '20150721-597a33b02f7811e5b1be8e104a145478.zip',
            '20150721-5d153f502f7911e5b1be8e104a145478.zip',
            '20150721-5de1f8702f6911e5b1be8e104a145478.zip',
            '20150721-80b5c6a02f6f11e5b1be8e104a145478.zip',
            '20150721-8f25b2f02fa511e5b1be8e104a145478.zip',
            '20150721-b11d79002fab11e5b1be8e104a145478.zip',
            '20150721-d6b58b602f7111e5b1be8e104a145478.zip',
            '20150721-e11052b02fa911e5b1be8e104a145478.zip',
            '20150721-ed9f74b02f6911e5b1be8e104a145478.zip',
            '20150721-f8cc49202f8d11e5b1be8e104a145478.zip',
            'META-INF/manifest.xml',
            'META-INF/signatures.xml',
            'PaketoInfo.xml',
            'mimetype'
        ]);
        zip.zipFile.close();
    });

    it('should reject when no such file', async () => {

        await expect(GetZip('no-such-file'))
            .rejects.toThrow('ENOENT: no such file or directory, open \'no-such-file\'');
    });

    it.todo('should erroback when file corrupt');

});
