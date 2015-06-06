"use strict";

var getZipEntryContents = require("./getZipEntryContents"),
	parseXmlString = require("denodeify")(require("xml2js").parseString);

function getZipEntryXml(zipfile, entry) {
	return getZipEntryContents(zipfile, entry).then(parseXmlString);
}

module.exports = getZipEntryXml;
