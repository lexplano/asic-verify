"use strict";

var concat = require("concat-stream");

/**
 * @param {yauzl.ZipFile} zipfile
 * @param {yauzl.Entry} entry
 * @returns {Promise<Buffer|string>}
 */
function getZipEntryContents(zipfile, entry) {
	return new Promise(function (resolve, reject) {

		zipfile.openReadStream(entry, function (err, readStream) {
			if (err) return reject(err); // @todo: create a bad zip to fake an error and test this

			readStream.pipe(concat(function (buf) {
				// @todo: create a bad zip to fake an error and test this
				resolve(buf);
			}));
		});

	});
}

module.exports = getZipEntryContents;
