"use strict";

/**
 * @param {yauzl.ZipFile} zipfile
 * @returns {Promise<yauzl.Entry[]>}
 */
function getZipEntries(zipfile) {
	return new Promise(function (resolve, reject) {
		var entries = [];
		zipfile
			.on("entry", function (entry) {
				entries.push(entry);
			})
			.on("error", function (err) {
				reject(err);
			})
			.on("end", function () {
				resolve(entries);
			});
	});
}

module.exports = getZipEntries;
