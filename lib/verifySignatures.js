'use strict';

const _ = require('lodash');
const Assert = require('assert');
const FindEntry = require('./findEntry');
const GetZipEntrySha256 = require('./getZipEntrySha256');
const GetZipEntryXml = require('./getZipEntryXml');
const DerToPem = require('./derToPem');
const SignedXml = require('xml-crypto').SignedXml;

SignedXml.CanonicalizationAlgorithms['http://www.w3.org/TR/2001/REC-xml-c14n-20010315'] = require('./xml-c14n/XML_C14N_1_0');

const isSignableEntry = function (entry) {

    return entry.fileName !== 'mimetype' && entry.fileName.substr(0, 9) !== 'META-INF/';
};

const isFileEntry = function (fn) {

    return fn.substr(0, 1) !== '#';
};

const verifyEntryDigest = function (zipfile, entry, entryReference) {

    Assert.equal(entryReference.DigestMethod.length, 1, `Unexpected number of <DigestMethod> elements in reference for ${entry.fileName}`);
    Assert.equal(entryReference.DigestValue.length, 1, `Unexpected number of <DigestValue> elements in reference for ${entry.fileName}`);

    const algorithm = entryReference.DigestMethod[0].$.Algorithm;
    Assert.equal(algorithm, 'http://www.w3.org/2001/04/xmlenc#sha256', `Unexpected algorithm: ${algorithm}`);

    const digestValue = entryReference.DigestValue[0];

    return GetZipEntrySha256(zipfile, entry)
        .then((shasum) => {

            Assert.equal(shasum, digestValue, `Digest mismatch: ${entry.fileName}`);
        });
};

const verifySignatures = function (zip) {

    return Promise.resolve(zip.entries)
        .then((entries) => {

            const manifestEntry = FindEntry(entries, 'META-INF/signatures.xml');
            return Promise.all([entries, GetZipEntryXml(zip.zipFile, manifestEntry)]);
        })
        .then((res) => {

            const entries = res[0];
            const signaturesXml = res[1].xml;
            const signaturesRaw = res[1].raw;
            const signaturesDom = res[1].dom;

            const signableEntries = entries.filter(isSignableEntry);

            Assert.equal(signaturesXml['document-signatures'].Signature.length, 1,
                'Unexpected number of <Signature> elements in META-INF/signatures.xml');

            const signatureElement = signaturesXml['document-signatures'].Signature[0];
            Assert.equal(signatureElement.SignedInfo.length, 1,
                'Unexpected number of <SignedInfo> elements in META-INF/signatures.xml');
            Assert.equal(signatureElement.SignedInfo[0].CanonicalizationMethod.length, 1,
                'Unexpected number of <CanonicalizationMethod> elements in META-INF/signatures.xml');
            Assert.equal(signatureElement.SignedInfo[0].SignatureMethod.length, 1,
                'Unexpected number of <SignatureMethod> elements in META-INF/signatures.xml');

            const canonicalizationMethod = signatureElement.SignedInfo[0].CanonicalizationMethod[0];
            const signatureMethod = signatureElement.SignedInfo[0].SignatureMethod[0];

            Assert.equal(canonicalizationMethod.$.Algorithm, 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315', 'Unexpected <CanonicalizationMethod>');
            Assert.equal(signatureMethod.$.Algorithm, 'http://www.w3.org/2000/09/xmldsig#rsa-sha1', 'Unexpected <SignatureMethod>');

            const reference = _.keyBy(signatureElement.SignedInfo[0].Reference, '$.URI');

            const fileEntriesInReference = _.map(reference, '$.URI').filter(isFileEntry);
            const entriesInZip = _.map(signableEntries, 'fileName');

            const entriesNotInZip = _.difference(fileEntriesInReference, entriesInZip).join(',');
            Assert(!entriesNotInZip, `Entries not present in zip: ${entriesNotInZip}`);

            const entriesNotInReference = _.difference(entriesInZip, fileEntriesInReference).join(',');
            Assert(!entriesNotInReference, `Entries not present in signature reference: ${entriesNotInReference}`);

            // validate signed XML
            const sig = new SignedXml();
            sig.keyInfoProvider = {
                getKey: function (keyInfo) {

                    Assert(keyInfo.length, 1, 'Expected one keyInfo element');

                    const certs = keyInfo[0].getElementsByTagName('X509Certificate');
                    Assert(certs.length, 1, 'Expected one <X509Certificate>');
                    Assert(certs[0].childNodes, 1, 'Expected one node inside <X509Certificate>');

                    return DerToPem(certs[0].childNodes[0].data);
                }
            };
            sig.loadSignature(signaturesDom.getElementsByTagName('Signature')[0].toString());

            // const isValid = sig.checkSignature(signaturesRaw.toString()); // @todo
            sig.checkSignature(signaturesRaw.toString());
            if (sig.validationErrors.length) {
                console.warn('Signature validation errors', '\n', sig.validationErrors);
            }
            //assert(isValid || true, "Signature invalid"); // @todo: https://github.com/yaronn/xml-crypto/issues/67

            // validate shasums for digested files
            return Promise.all(signableEntries
                .map((entry) => {

                    return verifyEntryDigest(zip.zipFile, entry, reference[entry.fileName]);
                }))
                .then(() => {

                    return {
                        signingCertificate: sig.signingKey.replace(/\r/g, '').trim(),
                        signingTime: signaturesDom.getElementsByTagName('SigningTime')[0].textContent
                    };
                });
        });
};

module.exports = verifySignatures;
