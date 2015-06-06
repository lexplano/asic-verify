"use strict";

var Q = require("q"),
	concat = require("concat-stream");

/**
 * @param {yauzl.ZipFile} zipfile
 * @param {yauzl.Entry} entry
 * @returns {Promise<Buffer|string>}
 */
function getZipEntryContents(zipfile, entry) {
	var deferred = Q.defer();

	zipfile.openReadStream(entry, function (err, readStream) {
		if (err) {
			deferred.reject(err);
			return;
		}

		readStream.pipe(concat(function (buf) {
			deferred.resolve(buf);
		}));
	});

	return deferred.promise;
}

module.exports = getZipEntryContents;
