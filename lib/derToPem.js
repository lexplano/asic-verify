"use strict";

var forge = require("node-forge");

module.exports = function (der) {
	const derKey = forge.util.decode64(der);
	const asnObj = forge.asn1.fromDer(derKey);
	const asn1Cert = forge.pki.certificateFromAsn1(asnObj);
	return forge.pki.certificateToPem(asn1Cert);
};
