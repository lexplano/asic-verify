"use strict";

var yauzl = require("yauzl");

var getZipEntries = require("./lib/getZipEntries"),
	verifyMimetype = require("./lib/verifyMimetype"),
	verifyManifest = require("./lib/verifyManifest"),
	verifySignatures = require("./lib/verifySignatures");

function verifyAsic(fn, cb) {
	yauzl.open(fn, {autoClose: false}, function (err, zipfile) {
		if (err) {
			return cb(err);
		}

		getZipEntries(zipfile)
			.then(function (entries) {
				return Promise.all([
					verifyMimetype(zipfile, entries),
					verifyManifest(zipfile, entries),
					verifySignatures(zipfile, entries)
				]);
			})
			.then(function () {
				cb(null);
			})
			.catch(function (err) {
				cb(err);
			})
			.then(function () {
				zipfile.close();
			});
	});
}

module.exports = verifyAsic;
