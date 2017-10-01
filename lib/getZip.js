'use strict';

const Yauzl = require('yauzl');

module.exports = function (fn, cb) {

    Yauzl.open(fn, { autoclose: false }, (err, zipFile) => {

        if (err) {
            cb(err);
            return;
        }

        const entries = [];
        zipFile
            .on('entry', (entry) => {

                entries.push(entry);
            })
            .on('error', (err) => {

                cb(err); // @todo: create a bad zip to fake an error and test this
            })
            .on('end', () => {

                cb(null, {
                    zipFile,
                    entries
                });
            });
    });

};
