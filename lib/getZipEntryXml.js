"use strict";

var getZipEntryContents = require("./getZipEntryContents"),
	parseXmlString = require("denodeify")(require("xml2js").parseString);

var DOMParser = require("xmldom").DOMParser;

function getZipEntryXml(zipfile, entry) {
	return getZipEntryContents(zipfile, entry)
		.then(function (contents) {
			return Promise.all([contents, parseXmlString(contents)]);
		})
		.then(function (res) {
			// @todo: get rid of xml2js and rely on xmldom, possibly with some extra layer around it
			return {
				xml: res[1],
				raw: res[0],
				dom: new DOMParser().parseFromString(res[0].toString(), "text/xml")
			};
		});
}

module.exports = getZipEntryXml;
