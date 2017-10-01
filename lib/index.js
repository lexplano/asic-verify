'use strict';

const GetZip = require('./getZip');
const VerifyMimetype = require('./verifyMimetype');
const VerifyManifest = require('./verifyManifest');
const VerifySignatures = require('./verifySignatures');
const Nodeify = require('nodeify');

const verifyAsic = function (fn, cb) {

    GetZip(fn, (err, zip) => {

        if (err) {
            return cb(err);
        }

        Nodeify(Promise.all([VerifyMimetype(zip), VerifyManifest(zip), VerifySignatures(zip)])
            .then((res) => {

                zip.zipFile.close(); // @todo: we'll probably need a lib with finally() support...
                return res[2]; // verifySignatures returns cert info
            })
            .catch((err) => {

                zip.zipFile.close();
                throw err;
            }), cb);

    });
};

module.exports = verifyAsic;
