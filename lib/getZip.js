'use strict';

const Yauzl = require('yauzl');

module.exports = function (fn) {

    return new Promise((resolve, reject) => {

        Yauzl.open(fn, { autoClose: false }, (err, zipFile) => {

            if (err) {
                reject(err);
                return;
            }

            const entries = [];
            zipFile
                .on('entry', (entry) => {

                    entries.push(entry);
                })
                .on('error', (err) => {

                    reject(err); // @todo: create a bad zip to fake an error and test this
                })
                .on('end', () => {

                    resolve({
                        zipFile,
                        entries
                    });
                });
        });

    });

};
