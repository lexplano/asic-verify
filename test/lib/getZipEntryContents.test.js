"use strict";

/*global describe, it, beforeEach, afterEach */

const expect = require("expect.js"),
	path = require("path"),
	getZip = require("../../lib/getZip"),
	findEntry = require("../../lib/findEntry"),
	getZipEntryContents = require("../../lib/getZipEntryContents");

const FIXTURE_FILE_PATH = path.join(__dirname, "../fixtures/valid.zip");

describe("getZipEntryContents()", function () {

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

	it("should return the contents of an entry", function () {
		return getZipEntryContents(fixtureZip.zipFile, findEntry(fixtureZip.entries, "mimetype")).then(function (contents) {
			expect(contents.toString()).to.eql("application/vnd.etsi.asic-e+zip");
		});
	});

	it("should errback when no such entry");
	it("should errback when corrupt file");

});
