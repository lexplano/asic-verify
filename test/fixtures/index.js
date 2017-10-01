'use strict';

const Path = require('path');
const Fs = require('fs');

const readFixtureFile = function (fn) {

    return Fs.readFileSync(Path.join(__dirname, fn)).toString();
};

module.exports.VALID_ZIP_PATH = Path.join(__dirname, 'valid.zip');
module.exports.PAKETO_INFO_XML = readFixtureFile('PaketoInfo.xml');
module.exports.SIGNING_CERTIFICATE_DER = readFixtureFile('cert.der.txt');
module.exports.SIGNING_CERTIFICATE_PEM = readFixtureFile('cert.pem');
