"use strict";

/*global describe, it */

const expect = require("expect.js"),
	fixtures = require("../fixtures"),
	derToPem = require("../../lib/derToPem");

function normalizeString(str) {
	return str.toString().trim().replace(/\r/g, "");
}

describe("derToPem()", function () {

	it("should convert DER to PEM", function () {
		const ACTUAL_PEM = derToPem(fixtures.SIGNING_CERTIFICATE_DER);
		expect(normalizeString(ACTUAL_PEM)).to.equal(fixtures.SIGNING_CERTIFICATE_PEM);
	});

});
