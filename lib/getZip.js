"use strict";

const yauzl = require("yauzl");

module.exports = function (fn, cb) {

	yauzl.open(fn, {autoclose: false}, function (err, zipFile) {

		if (err) {
			cb(err);
			return;
		}

		const entries = [];
		zipFile
			.on("entry", function (entry) {
				entries.push(entry);
			})
			.on("error", function (err) {
				cb(err); // @todo: create a bad zip to fake an error and test this
			})
			.on("end", function () {
				cb(null, {
					zipFile: zipFile,
					entries: entries
				});
			});
	});

};
