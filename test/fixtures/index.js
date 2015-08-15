"use strict";

const path = require("path"),
	fs = require("fs");

function readFixtureFile(fn) {
	return fs.readFileSync(path.join(__dirname, fn)).toString();
}

module.exports.VALID_ZIP_PATH = path.join(__dirname, "valid.zip");
module.exports.PAKETO_INFO_XML = readFixtureFile("PaketoInfo.xml");
module.exports.SIGNING_CERTIFICATE_DER = readFixtureFile("cert.der.txt");
module.exports.SIGNING_CERTIFICATE_PEM = readFixtureFile("cert.pem");
