'use strict';

const _ = require('lodash');
const Assert = require('node:assert');
const FindEntry = require('./findEntry');
const GetZipEntryXml = require('./getZipEntryXml');

/**
 * current implementation:
 *       etar.lt does not include mimetype in the manifest; also ignore "folders" - assume they are present
 *
 * @todo implement spec
 *
 * 6.2.2 Contents of Container
 *       [..]
 *       4) Other application specific information may be added in further files contained within the META-INF
 *          directory, such as:
 *          [..]
 *          b) "META-INF/manifest.xml" if present shall be well formed XML conformant to OASIS Open Document
 *             Format [9] specifications.
 *         [..]
 *       [..]
 *
 * [9] OASIS: "Open Document Format for Office Applications (OpenDocument) Version 1.2; Part 3:
 *     Packages" 29 September 2011. OASIS Standard.
 *     http://docs.oasis-open.org/office/v1.2/OpenDocument-v1.2.html
 *
 */
const verifyManifest = async function (zip) {

    const manifestEntry = FindEntry(zip.entries, 'META-INF/manifest.xml');
    const { xml } = await GetZipEntryXml(zip.zipFile, manifestEntry);
    const manifest = xml;

    const entriesInManifest = _.map(manifest['manifest:manifest']['manifest:file-entry'], '$.manifest:full-path').filter((fn) => {

        return fn !== 'META-INF/' && fn !== '/';
    });

    const entriesInZip = _.map(zip.entries, 'fileName').filter((fn) => {

        return fn !== 'mimetype' && fn !== 'META-INF/manifest.xml';
    });

    const entriesNotInZip = _.difference(entriesInManifest, entriesInZip).join(',');
    Assert(!entriesNotInZip, `Entries not present in zip: ${entriesNotInZip}`);

    const entriesNotInManifest = _.difference(entriesInZip, entriesInManifest).join(',');
    Assert(!entriesNotInManifest, `Entries not present in manifest: ${entriesNotInManifest}`);
};

module.exports = verifyManifest;
