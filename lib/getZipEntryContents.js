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
			if (err) return reject(err);

			readStream.pipe(concat(function (buf) {
				resolve(buf);
			}));
		});

	});
}

module.exports = getZipEntryContents;
