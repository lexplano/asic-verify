var _ = require("lodash"),
	Q = require("q"),
	yauzl = require("yauzl"),
	xml2js = require("xml2js"),
	parseXml = Q.nbind(xml2js.parseString, xml2js),
	concat = require("concat-stream"),
	assert = require("assert");

function readEntryToBuffer(zipfile, entry) {
	var deferred = Q.defer();
	zipfile.openReadStream(entry, function (err, readStream) {
		if (err) {
			deferred.reject(err);
			return;
		}

		readStream.pipe(concat(function (buf) {
			deferred.resolve(buf);
		}));
	});

	return deferred.promise;
}

function verifyMimetype(mimetype) {
	return Q.resolve(mimetype).then(function (m) {
		assert.equal(m, "application/vnd.etsi.asic-e+zip", "Unexpected mimetype: " + m);
	});
}

function verifyManifest(entries, manifest) {
	return Q.all([entries, manifest]).spread(function (e, m) {
		var entriesInManifest = _.pluck(m["manifest:manifest"]["manifest:file-entry"], "$.manifest:full-path").filter(function (fn) {
				return fn !== "META-INF/" && fn !== "/"
			}),
			entriesInZip = _.pluck(entries, "fileName").filter(function (fn) {
				return fn !== "mimetype" && fn !== "META-INF/manifest.xml"
			});

		var entriesNotInzip = _.difference(entriesInManifest, entriesInZip).join(",");
		assert(!entriesNotInzip, "Entries not present in zip: " + entriesNotInzip);

		var entriesNotInManifest = _.difference(entriesInZip, entriesInManifest).join(",");
		assert(!entriesNotInManifest, "Entries not present in manifest: " + entriesNotInManifest);
	});
}

function verifySignatures(zipfile, entries, signatures) {
	return Q.all([entries, signatures]).spread(function (e, s) {
		throw new Error("Not implemented");
		console.log(s["document-signatures"]["Signature"][0]["SignedInfo"][0]["Reference"]);
	});
}

module.exports = function verifyAsic(fn, cb) {
	yauzl.open(fn, {autoClose: false}, function (err, zipfile) {
		if (err) {
			return cb(err);
		}

		var entriesDeferred = Q.defer(),
			mimetypePromise = null,
			manifestPromise = null,
			signaturesPromise = null;

		var entries = [];

		zipfile
			.on("entry", function onEntry(entry) {
				if (entry.fileName === "mimetype") {
					mimetypePromise = readEntryToBuffer(zipfile, entry);
				}
				if (entry.fileName === "META-INF/manifest.xml") {
					manifestPromise = readEntryToBuffer(zipfile, entry).then(parseXml);
				}
				if (entry.fileName === "META-INF/signatures.xml") {
					signaturesPromise = readEntryToBuffer(zipfile, entry).then(parseXml);
				}
				entries.push(entry);
			})
			.on("error", function onZipError(err) {
				entriesDeferred.reject(err);
			})
			.on("end", function onEnd() {
				entriesDeferred.resolve(entries);
			});

		entriesDeferred.promise
			.then(function (entries) {
				console.log(entries);

				return Q.all([
					verifyMimetype(mimetypePromise),
					verifyManifest(entries, manifestPromise),
					verifySignatures(zipfile, entries, signaturesPromise)
				]);
			})
			.then(function () {
				cb();
			})
			.catch(function (err) {
				cb(err)
			})
			.done(function () {
				zipfile.close();
			});
	});
};
