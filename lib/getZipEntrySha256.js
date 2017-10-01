'use strict';

const Crypto = require('crypto');

/**
 * @param {yauzl.ZipFile} zipfile
 * @param {yauzl.Entry} entry
 * @returns {Promise<string>}
 */
const getZipEntrySha256 = function (zipfile, entry) {

    return new Promise(((resolve, reject) => {

        zipfile.openReadStream(entry, (err, readStream) => {

            if (err) {
                return reject(err);
            } // @todo: create a bad zip to fake an error and test this

            const hash = Crypto.createHash('sha256');

            readStream
                .on('data', (chunk) => {

                    hash.update(chunk);
                })
                .on('error', (err) => {

                    reject(err); // @todo: create a bad zip to fake an error and test this
                })
                .on('end', () => {

                    resolve(hash.digest('base64'));
                });

        });

    }));
};

module.exports = getZipEntrySha256;
