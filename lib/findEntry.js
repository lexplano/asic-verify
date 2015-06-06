"use strict";

var assert = require("assert");

function findEntry(entries, fn) {
	var entry = entries.filter(function (entry) {
		return entry.fileName === fn;
	});
	assert.equal(entry.length, 1, `Could not find exactly one entry for ${fn}`);
	return entry[0];
}

module.exports = findEntry;
