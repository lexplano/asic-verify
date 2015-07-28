"use strict";

/*global describe, it, beforeEach, afterEach */

const expect = require("expect.js"),
	path = require("path"),
	getZip = require("../lib/getZip"),
	findEntry = require("../lib/findEntry"),
	getZipEntrySha256 = require("../lib/getZipEntrySha256");

const FIXTURE_FILE_PATH = path.join(__dirname, "fixture.zip");

describe("getZipEntrySha256()", function () {

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

	it("should return the hash of an entry", function () {
		return getZipEntrySha256(fixtureZip.zipFile, findEntry(fixtureZip.entries, "mimetype")).then(function (sha) {
			expect(sha).to.eql("SfhiIVunWeabZOqZ9cCxFczyt4s5HJVWYHIV1xxcn3I=");
		});
	});

	it("should errback when no such entry");
	it("should errback when corrupt file");

});
