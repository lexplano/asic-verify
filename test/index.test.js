"use strict";

/*global describe, it */

const expect = require("expect.js"),
	path = require("path"),
	asicVerify = require("../index");

const FIXTURE_FILE_PATH = path.join(__dirname, "./fixtures/valid.zip");

describe("asic-verify", function () {

	it("should return OK for valid.zip", function (done) {
		asicVerify(FIXTURE_FILE_PATH, function (e) {
			expect(e).to.be(null);
			done();
		});
	});

	it("should errback when no such file", function (done) {
		asicVerify("no-such-file", function (err) {
			expect(err).to.be.an(Error);
			done();
		});
	});

});
