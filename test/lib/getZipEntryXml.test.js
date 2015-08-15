"use strict";

/*global describe, it, beforeEach, afterEach */

const expect = require("expect.js"),
	path = require("path"),
	getZip = require("../../lib/getZip"),
	findEntry = require("../../lib/findEntry"),
	getZipEntryXml = require("../../lib/getZipEntryXml");

const FIXTURE_FILE_PATH = path.join(__dirname, "../fixtures/valid.zip");

describe("getZipEntryXml()", function () {

	var fixtureZip;
	beforeEach(function (done) {
		getZip(FIXTURE_FILE_PATH, function (err, zip) {
			fixtureZip = zip;
			done(err);
		});
	});

	afterEach(function () {
		fixtureZip.zipFile.close();
	});

	it("should return the parsed XML of an entry", function () {
		return getZipEntryXml(fixtureZip.zipFile, findEntry(fixtureZip.entries, "PaketoInfo.xml")).then(function (xml) {
			expect(xml).to.eql({
				paketoInfo: {
					"ID": ["8CDFB892-BC65-4192-AA23-907A5F856662"],
					"PaketoDydisMB": ["1"],
					"SukūrimoData": ["2015-07-22"],
					"TeisėsAktaiIki": ["2015-07-21"],
					"TeisėsAktaiNuo": ["2015-07-21"]
				}
			});
		});
	});

	it("should errback when no such entry");
	it("should errback when corrupt file");

});
