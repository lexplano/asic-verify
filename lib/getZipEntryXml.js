"use strict";

var getZipEntryContents = require("./getZipEntryContents"),
	xml2js = require("xml2js");

function getZipEntryXml(zipfile, entry) {
	return new Promise(function (resolve, reject) {
		getZipEntryContents(zipfile, entry).then(function (buf) {
			xml2js.parseString(buf, function (err, xml) {
				if (err) {
					reject(err);
				} else {
					resolve(xml);
				}
			})
		})
	});
}

module.exports = getZipEntryXml;
