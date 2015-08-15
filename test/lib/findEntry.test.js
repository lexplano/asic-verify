"use strict";

/*global describe, it, beforeEach, afterEach */

const expect = require("expect.js"),
	fixtures = require("../fixtures"),
	getZip = require("../../lib/getZip"),
	findEntry = require("../../lib/findEntry");

describe("findEntry()", function () {

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

	it("should return the entry", function () {
		var entry = findEntry(fixtureZip.entries, "mimetype");
		expect(entry.fileName).to.eql("mimetype");
		expect(entry.crc32).to.eql(1173954954);
	});

	it("should throw when no such entry", function () {
		expect(function () {
			findEntry(fixtureZip.entries, "no-such-file");
		}).to.throwException(/Could not find exactly one entry for no-such-file/);
	});

	it("should throw when entry exists twice (impossible...)", function () {
		expect(function () {
			findEntry([{fileName: "wtf"}, {fileName: "wtf"}], "wtf");
		}).to.throwException(/Could not find exactly one entry for wtf/);
	});

});
