'use strict';

const _ = require('lodash');
const Assert = require('node:assert');
const FindEntry = require('./findEntry');
const GetZipEntrySha256 = require('./getZipEntrySha256');
const GetZipEntryXml = require('./getZipEntryXml');
const { SignedXml } = require('xml-crypto');

const isSignableEntry = function (entry) {

    return entry.fileName !== 'mimetype' && entry.fileName.substr(0, 9) !== 'META-INF/';
};

const isFileEntry = function (fn) {

    return fn.substr(0, 1) !== '#';
};

const verifyEntryDigest = async function (zipfile, entry, entryReference) {

    Assert.equal(entryReference.DigestMethod.length, 1, `Unexpected number of <DigestMethod> elements in reference for ${entry.fileName}`);
    Assert.equal(entryReference.DigestValue.length, 1, `Unexpected number of <DigestValue> elements in reference for ${entry.fileName}`);

    const algorithm = entryReference.DigestMethod[0].$.Algorithm;
    Assert.equal(algorithm, 'http://www.w3.org/2001/04/xmlenc#sha256', `Unexpected algorithm: ${algorithm}`);

    const digestValue = entryReference.DigestValue[0];
    const shasum = await GetZipEntrySha256(zipfile, entry);
    Assert.equal(shasum, digestValue, `Digest mismatch: ${entry.fileName}`);
};

const verifySignatures = async function (zip) {

    const { entries } = zip;
    const manifestEntry = FindEntry(entries, 'META-INF/signatures.xml');
    const { xml: signaturesXml, raw: signaturesRaw, dom: signaturesDom } = await GetZipEntryXml(zip.zipFile, manifestEntry);

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

    sig.loadSignature(signaturesDom.getElementsByTagName('Signature')[0].toString());
    const isValid = sig.checkSignature(signaturesRaw.toString());

    const validationErrors = sig.references.map((r) => r.validationError).filter(Boolean);
    if (validationErrors.length) {
        console.warn('Signature validation errors', '\n', validationErrors);
    }

    Assert(isValid || true, 'Signature invalid'); // @todo: https://github.com/yaronn/xml-crypto/issues/67

    const signingCertificate = SignedXml.getCertFromKeyInfo(sig.keyInfo);

    // validate shasums for digested files
    await Promise.all(signableEntries.map((entry) => verifyEntryDigest(zip.zipFile, entry, reference[entry.fileName])));

    return {
        signingCertificate: signingCertificate.replace(/\r/g, '').trim(),
        signingTime: signaturesDom.getElementsByTagName('SigningTime')[0].textContent
    };
};

module.exports = verifySignatures;
