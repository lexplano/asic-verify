"use strict";

var crypto = require("crypto");

/**
 * @param {yauzl.ZipFile} zipfile
 * @param {yauzl.Entry} entry
 * @returns {Promise<string>}
 */
function getZipEntrySha256(zipfile, entry) {
	return new Promise(function (resolve, reject) {

		zipfile.openReadStream(entry, function (err, readStream) {
			if (err) return reject(err);

			var hash = crypto.createHash("sha256");

			readStream
				.on("data", function (chunk) {
					hash.update(chunk);
				})
				.on("error", function (err) {
					reject(err);
				})
				.on("end", function () {
					resolve(hash.digest("base64"));
				});

		});

	});
}

module.exports = getZipEntrySha256;
