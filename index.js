"use strict";

var getZip = require("./lib/getZip"),
	verifyMimetype = require("./lib/verifyMimetype"),
	verifyManifest = require("./lib/verifyManifest"),
	verifySignatures = require("./lib/verifySignatures"),
	nodeify = require("nodeify");

function verifyAsic(fn, cb) {
	getZip(fn, function (err, zip) {
		if (err) {
			return cb(err);
		}

		nodeify(Promise.all([verifyMimetype(zip), verifyManifest(zip), verifySignatures(zip)])
			.then(function (res) {
				zip.zipFile.close(); // @todo: we'll probably need a lib with finally() support...
				return res[2]; // verifySignatures returns cert info
			})
			.catch(function (err) {
				zip.zipFile.close();
				throw err;
			}), cb);

	});
}

module.exports = verifyAsic;
