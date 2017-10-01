'use strict';

const Lab = require('lab');
const Fixtures = require('./fixtures');
const GetZip = require('../lib/getZip');
const Yauzl = require('yauzl');

const { describe, it, expect } = exports.lab = Lab.script();

const getFileName = function (entry) {

    return entry.fileName;
};

describe('getZip', () => {

    it('should return a zip descriptor with entries', (done) => {

        GetZip(Fixtures.VALID_ZIP_PATH, (err, zip) => {

            expect(err).not.to.exist();
            expect(zip.zipFile).to.be.instanceOf(Yauzl.ZipFile);
            expect(zip.zipFile).to.contain({ isOpen: true });
            expect(zip.entries.map(getFileName).sort()).to.equal([
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
            done();
        });
    });

    it('should errback when no such file', (done) => {

        GetZip('no-such-file', (err) => {

            expect(err).to.be.an.error('ENOENT: no such file or directory, open \'no-such-file\'');
            done();
        });
    });

    it('should erroback when file corrupt');

});
