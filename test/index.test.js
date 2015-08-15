"use strict";

/*global describe, it */

const expect = require("expect.js"),
	fixtures = require("./fixtures"),
	asicVerify = require("../index");

describe("asic-verify", function () {

	it("should return OK for valid.zip", function (done) {
		asicVerify(fixtures.VALID_ZIP_PATH, function (e, signatureInfo) {
			expect(e).to.be(null);
			expect(signatureInfo.signingCertificate).to.eql(fixtures.SIGNING_CERTIFICATE_PEM);
			expect(signatureInfo.signingTime).to.eql("2015-07-21T22:00:13Z");
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
