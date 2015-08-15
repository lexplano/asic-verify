"use strict";

var getZipEntryContents = require("./getZipEntryContents"),
	parseXmlString = require("denodeify")(require("xml2js").parseString);

function getZipEntryXml(zipfile, entry) {
	return getZipEntryContents(zipfile, entry)
		.then(function (contents) {
			return Promise.all([ contents, parseXmlString(contents) ]);
		})
		.then(function (res) {
			return { xml: res[1], raw: res[0] };
		});
}

module.exports = getZipEntryXml;
