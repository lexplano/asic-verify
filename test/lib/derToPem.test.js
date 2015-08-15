"use strict";

/*global describe, it */

const fs = require("fs"),
	path = require("path"),
	expect = require("expect.js");

const derToPem = require("../../lib/derToPem");

function normalizeString(str) {
	return str.toString().trim().replace(/\r/g, "");
}

describe("derToPem()", function () {

	const INPUT_DER = normalizeString(fs.readFileSync(path.join(__dirname, "../fixtures/cert.der.txt"))),
		EXPECTED_PEM = normalizeString(fs.readFileSync(path.join(__dirname, "../fixtures/cert.pem")));

	it("should convert DER to PEM", function () {
		const ACTUAL_PEM = derToPem(INPUT_DER);
		expect(normalizeString(ACTUAL_PEM)).to.equal(EXPECTED_PEM);
	});

});
