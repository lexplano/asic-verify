"use strict";

var _ = require("lodash"),
	assert = require("assert"),
	findEntry = require("./findEntry"),
	getZipEntryXml = require("./getZipEntryXml");

/**
 * current implementation:
 *       etar.lt does not include mimetype in the manifest; also ignore "folders" - assume they are present
 *
 * @todo implement spec
 *
 * 6.2.2 Contents of Container
 *       [..]
 *       4) Other application specific information may be added in further files contained within the META-INF
 *          directory, such as:
 *          [..]
 *          b) "META-INF/manifest.xml" if present shall be well formed XML conformant to OASIS Open Document
 *             Format [9] specifications.
 *         [..]
 *       [..]
 *
 * [9] OASIS: "Open Document Format for Office Applications (OpenDocument) Version 1.2; Part 3:
 *     Packages" 29 September 2011. OASIS Standard.
 *     http://docs.oasis-open.org/office/v1.2/OpenDocument-v1.2.html
 *
 */
function verifyManifest(zip) {
	return Promise.resolve(zip.entries)
		.then(function (entries) {
			var manifestEntry = findEntry(entries, "META-INF/manifest.xml");
			return Promise.all([entries, getZipEntryXml(zip.zipFile, manifestEntry)]);
		})
		.then(function (res) {
			var entries = res[0], manifest = res[1]; // @todo: can't wait for destructuring!

			var entriesInManifest = _.pluck(manifest["manifest:manifest"]["manifest:file-entry"], "$.manifest:full-path").filter(function (fn) {
					return fn !== "META-INF/" && fn !== "/";
				}),
				entriesInZip = _.pluck(entries, "fileName").filter(function (fn) {
					return fn !== "mimetype" && fn !== "META-INF/manifest.xml";
				});

			var entriesNotInZip = _.difference(entriesInManifest, entriesInZip).join(",");
			assert(!entriesNotInZip, `Entries not present in zip: ${entriesNotInZip}`);

			var entriesNotInManifest = _.difference(entriesInZip, entriesInManifest).join(",");
			assert(!entriesNotInManifest, `Entries not present in manifest: ${entriesNotInManifest}`);
		});
}


module.exports = verifyManifest;
