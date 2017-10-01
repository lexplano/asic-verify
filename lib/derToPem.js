'use strict';

const Forge = require('node-forge');

module.exports = function (der) {

    const derKey = Forge.util.decode64(der);
    const asnObj = Forge.asn1.fromDer(derKey);
    const asn1Cert = Forge.pki.certificateFromAsn1(asnObj);
    return Forge.pki.certificateToPem(asn1Cert);
};
