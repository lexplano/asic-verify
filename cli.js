var fn = process.argv[2];

if (!fn) {
	throw new Error("File name not provided");
}

require("./index.js")(fn, function (err) {
	if (err) throw err;
	console.log("OK");
});
