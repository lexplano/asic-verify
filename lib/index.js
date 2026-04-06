'use strict';

const GetZip = require('./getZip');
const VerifyMimetype = require('./verifyMimetype');
const VerifyManifest = require('./verifyManifest');
const VerifySignatures = require('./verifySignatures');

const verifyAsic = async function (fn) {

    const zip = await GetZip(fn);

    try {
        const res = await Promise.all([VerifyMimetype(zip), VerifyManifest(zip), VerifySignatures(zip)]);
        return res[2]; // verifySignatures returns cert info
    }
    finally {
        zip.zipFile.close();
    }
};

module.exports = verifyAsic;
