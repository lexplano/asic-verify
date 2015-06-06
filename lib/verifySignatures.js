"use strict";

var _ = require("lodash"),
	assert = require("assert"),
	findEntry = require("./findEntry"),
	getZipEntrySha256 = require("./getZipEntrySha256"),
	getZipEntryXml = require("./getZipEntryXml");

function isSignableEntry(entry) {
	return entry.fileName !== "mimetype" && entry.fileName.substr(0, 9) !== "META-INF/";
}

function isFileEntry(fn) {
	return fn.substr(0, 1) !== "#";
}

function verifyEntryDigest(zipfile, entry, entryReference) {
	assert.equal(entryReference.DigestMethod.length, 1, "Unexpected number of <DigestMethod> items in reference for " + entry.fileName);
	assert.equal(entryReference.DigestValue.length, 1, "Unexpected number of <DigestValue> items in reference for " + entry.fileName);

	var algorithm = entryReference.DigestMethod[0].$.Algorithm;
	assert.equal(algorithm, "http://www.w3.org/2001/04/xmlenc#sha256", "Unexpected algorithm: " + algorithm);

	var digestValue = entryReference.DigestValue[0];

	return getZipEntrySha256(zipfile, entry)
		.then(function (shasum) {
			assert.equal(shasum, digestValue, "Digest mismatch: " + entry.fileName);
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
			var entries = res[0], signatures = res[1]; // @todo: can't wait for destructuring!

			var signableEntries = entries.filter(isSignableEntry);

			// @todo: validate actual signature
			// @todo: assert correct element length
			var reference = _.indexBy(signatures["document-signatures"]["Signature"][0]["SignedInfo"][0]["Reference"], "$.URI");

			var fileEntriesInReference = _.pluck(reference, "$.URI").filter(isFileEntry),
				entriesInZip = _.pluck(signableEntries, "fileName");

			var entriesNotInZip = _.difference(fileEntriesInReference, entriesInZip).join(",");
			assert(!entriesNotInZip, "Entries not present in zip: " + entriesNotInZip);

			var entriesNotInReference = _.difference(entriesInZip, fileEntriesInReference).join(",");
			assert(!entriesNotInReference, "Entries not present in signature reference: " + entriesNotInReference);

			// validate shasums for digested files
			return Promise.all(signableEntries.map(function (entry) {
				return verifyEntryDigest(zipfile, entry, reference[entry.fileName]);
			}));
		});
}

module.exports = verifySignatures;
