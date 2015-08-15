"use strict";

/*global describe, it, beforeEach, afterEach */

const expect = require("expect.js"),
	fixtures = require("../fixtures"),
	getZip = require("../../lib/getZip"),
	findEntry = require("../../lib/findEntry"),
	getZipEntryXml = require("../../lib/getZipEntryXml");

describe("getZipEntryXml()", function () {

	var fixtureZip;
	beforeEach(function (done) {
		getZip(fixtures.VALID_ZIP_PATH, function (err, zip) {
			fixtureZip = zip;
			done(err);
		});
	});

	afterEach(function () {
		fixtureZip.zipFile.close();
	});

	it("should return the parsed XML of an entry", function () {
		return getZipEntryXml(fixtureZip.zipFile, findEntry(fixtureZip.entries, "PaketoInfo.xml")).then(function (data) {
			expect(data.xml).to.eql({
				paketoInfo: {
					"ID": ["8CDFB892-BC65-4192-AA23-907A5F856662"],
					"PaketoDydisMB": ["1"],
					"SukūrimoData": ["2015-07-22"],
					"TeisėsAktaiIki": ["2015-07-21"],
					"TeisėsAktaiNuo": ["2015-07-21"]
				}
			});

			expect(data.raw.toString()).to.eql(fixtures.PAKETO_INFO_XML);

			expect(data.dom.getElementsByTagName("SukūrimoData")[0].textContent).to.eql("2015-07-22");
		});
	});

	it("should errback when no such entry");
	it("should errback when corrupt file");

});
