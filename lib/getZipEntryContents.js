'use strict';

const Concat = require('concat-stream');

/**
 * @param {yauzl.ZipFile} zipfile
 * @param {yauzl.Entry} entry
 * @returns {Promise<Buffer|string>}
 */
const getZipEntryContents = function (zipfile, entry) {

    return new Promise(((resolve, reject) => {

        zipfile.openReadStream(entry, (err, readStream) => {

            if (err) {
                return reject(err);
            } // @todo: create a bad zip to fake an error and test this

            readStream.pipe(Concat((buf) => {

                // @todo: create a bad zip to fake an error and test this
                resolve(buf);
            }));
        });

    }));
};

module.exports = getZipEntryContents;
