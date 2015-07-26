"use strict";

var getZip = require("./lib/getZip"),
	verifyMimetype = require("./lib/verifyMimetype"),
	verifyManifest = require("./lib/verifyManifest"),
	verifySignatures = require("./lib/verifySignatures");

function verifyAsic(fn, cb) {
	getZip(fn, function (err, zip) {
		if (err) {
			return cb(err);
		}

		Promise.all([
			verifyMimetype(zip.zipFile, zip.entries),
			verifyManifest(zip.zipFile, zip.entries),
			verifySignatures(zip.zipFile, zip.entries)
		])
			.then(function () {
				zip.zipFile.close(); // @todo: we'll probably need a lib with finally() support...
				cb(null);
			})
			.catch(function (err) {
				zip.zipFile.close();
				cb(err);
			});

	});
}

module.exports = verifyAsic;
