"use strict";

var _ = require("lodash"),
	assert = require("assert"),
	findEntry = require("./findEntry"),
	getZipEntrySha256 = require("./getZipEntrySha256"),
	getZipEntryXml = require("./getZipEntryXml"),
	xmlBuilder = new (require("xml2js").Builder)(),
	SignedXml = require("xml-crypto").SignedXml;

function isSignableEntry(entry) {
	return entry.fileName !== "mimetype" && entry.fileName.substr(0, 9) !== "META-INF/";
}

function isFileEntry(fn) {
	return fn.substr(0, 1) !== "#";
}

function verifyEntryDigest(zipfile, entry, entryReference) {
	assert.equal(entryReference["DigestMethod"].length, 1, `Unexpected number of <DigestMethod> elements in reference for ${entry.fileName}`);
	assert.equal(entryReference["DigestValue"].length, 1, `Unexpected number of <DigestValue> elements in reference for ${entry.fileName}`);

	var algorithm = entryReference["DigestMethod"][0].$["Algorithm"];
	assert.equal(algorithm, "http://www.w3.org/2001/04/xmlenc#sha256", `Unexpected algorithm: ${algorithm}`);

	var digestValue = entryReference["DigestValue"][0];

	return getZipEntrySha256(zipfile, entry)
		.then(function (shasum) {
			assert.equal(shasum, digestValue, `Digest mismatch: ${entry.fileName}`);
		});
}

/**
 *
 * @param {yauzl.ZipFile} zipfile
 * @param {yauzl.Entry[]} entries
 * @returns {Promise}
 */
function verifySignatures(zipfile, entries) {
	return Promise.resolve(entries)
		.then(function (entries) {
			var manifestEntry = findEntry(entries, "META-INF/signatures.xml");
			return Promise.all([entries, getZipEntryXml(zipfile, manifestEntry)]);
		})
		.then(function (res) {
			var entries = res[0], signaturesXml = res[1]; // @todo: can't wait for destructuring!

			var signableEntries = entries.filter(isSignableEntry);

			assert.equal(signaturesXml["document-signatures"]["Signature"].length, 1,
				"Unexpected number of <Signature> elements in META-INF/signatures.xml");

			var signatureElement = signaturesXml["document-signatures"]["Signature"][0];
			assert.equal(signatureElement["SignedInfo"].length, 1,
				"Unexpected number of <SignedInfo> elements in META-INF/signatures.xml");
			assert.equal(signatureElement["SignedInfo"][0]["CanonicalizationMethod"].length, 1,
				"Unexpected number of <CanonicalizationMethod> elements in META-INF/signatures.xml");
			assert.equal(signatureElement["SignedInfo"][0]["SignatureMethod"].length, 1,
				"Unexpected number of <SignatureMethod> elements in META-INF/signatures.xml");

			var canonicalizationMethod = signatureElement["SignedInfo"][0]["CanonicalizationMethod"][0],
				signatureMethod = signatureElement["SignedInfo"][0]["SignatureMethod"][0];

			assert.equal(canonicalizationMethod.$["Algorithm"], "http://www.w3.org/TR/2001/REC-xml-c14n-20010315", "Unexpected <CanonicalizationMethod>");
			assert.equal(signatureMethod.$["Algorithm"], "http://www.w3.org/2000/09/xmldsig#rsa-sha1", "Unexpected <SignatureMethod>");

			var reference = _.indexBy(signatureElement["SignedInfo"][0]["Reference"], "$.URI");

			var fileEntriesInReference = _.pluck(reference, "$.URI").filter(isFileEntry),
				entriesInZip = _.pluck(signableEntries, "fileName");

			var entriesNotInZip = _.difference(fileEntriesInReference, entriesInZip).join(",");
			assert(!entriesNotInZip, `Entries not present in zip: ${entriesNotInZip}`);

			var entriesNotInReference = _.difference(entriesInZip, fileEntriesInReference).join(",");
			assert(!entriesNotInReference, `Entries not present in signature reference: ${entriesNotInReference}`);

			// @todo: fix up xml-crypto
			//// validate signed XML
			//var sig = new SignedXml();
			//sig.keyInfoProvider = {
			//	getKey: function (keyInfo) {
			//		assert(keyInfo.length, 1, "Expected one keyInfo element");
			//
			//		var certs = keyInfo[0].getElementsByTagName("X509Certificate");
			//		assert(certs.length, 1, "Expected one <X509Certificate>");
			//		assert(certs[0].childNodes, 1, "Expected one node inside <X509Certificate>");
			//
			//		return certs[0].childNodes[0].data;
			//	}
			//};
			//sig.loadSignature(xmlBuilder.buildObject(signatureElement));
			//var isValid = sig.checkSignature(xmlBuilder.buildObject(signaturesXml));
			//if (sig.validationErrors.length) {
			//	console.warn("Signature validation errors", "\n", sig.validationErrors);
			//}
			//assert(isValid, "Signature invalid");

			// @todo: validate certificate itself

			// validate shasums for digested files
			return Promise.all(signableEntries.map(function (entry) {
				return verifyEntryDigest(zipfile, entry, reference[entry.fileName]);
			}));
		});
}

module.exports = verifySignatures;
