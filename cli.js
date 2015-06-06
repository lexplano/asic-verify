"use strict";

var fn = process.argv[2];

if (!fn) {
	throw new Error("File name not provided");
}

process.on("unhandledRejection", function (err) {
	console.warn("Unhandled rejection:", err, "\n", err.stack);
});

require("./index.js")(fn, function (err) {
	if (err) throw err;
	console.log("OK");
});
