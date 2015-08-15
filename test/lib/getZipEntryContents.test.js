"use strict";

/*global describe, it, beforeEach, afterEach */

const expect = require("expect.js"),
	fixtures = require("../fixtures"),
	getZip = require("../../lib/getZip"),
	findEntry = require("../../lib/findEntry"),
	getZipEntryContents = require("../../lib/getZipEntryContents");

describe("getZipEntryContents()", function () {

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

	it("should return the contents of an entry", function () {
		return getZipEntryContents(fixtureZip.zipFile, findEntry(fixtureZip.entries, "mimetype")).then(function (contents) {
			expect(contents.toString()).to.eql("application/vnd.etsi.asic-e+zip");
		});
	});

	it("should errback when no such entry");
	it("should errback when corrupt file");

});
