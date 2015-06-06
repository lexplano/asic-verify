"use strict";

var Q = require("q"),
	crypto = require("crypto");

/**
 * @param {yauzl.ZipFile} zipfile
 * @param {yauzl.Entry} entry
 * @returns {Promise<string>}
 */
function getZipEntrySha256(zipfile, entry) {
	var deferred = Q.defer();

	zipfile.openReadStream(entry, function (err, readStream) {
		if (err) {
			deferred.reject(err);
			return;
		}

		var hash = crypto.createHash("sha256");
		readStream
			.on("data", function (buf) {
				hash.update(buf);
			})
			.on("error", function (err) {
				deferred.reject(err);
			})
			.on("end", function () {
				deferred.resolve(hash.digest("base64"));
			});

	});

	return deferred.promise;
}

module.exports = getZipEntrySha256;
