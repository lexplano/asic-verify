"use strict";

const path = require("path"),
	fs = require("fs");

module.exports.VALID_ZIP_PATH = path.join(__dirname, "valid.zip");
module.exports.SIGNING_CERTIFICATE_DER = fs.readFileSync(path.join(__dirname, "cert.der.txt")).toString();
module.exports.SIGNING_CERTIFICATE_PEM = fs.readFileSync(path.join(__dirname, "cert.pem")).toString();
