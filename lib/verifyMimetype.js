'use strict';

const Assert = require('assert');
const FindEntry = require('./findEntry');
const GetZipEntryContents = require('./getZipEntryContents');

/**
 * current implementation:
 *       etar.lt contains the mimetype file inside a file with .zip extension - we only verify that
 *
 * @todo implement spec
 *
 * 6.2.1 Media type identification
 *       1) File extension: ".asice" should be used (".sce" is allowed for operating systems and/or file systems not
 *          allowing more than 3 characters file extensions).
 *       2) Mime type: "application/vnd.etsi.asic-e+zip" mime type should be used to identify the format of this container.
 *       3) The archive level comment field in the ZIP header may be used to identify the type of content within the
 *          container. If this field is present, it should be set with "mimetype=" followed by the mime type defined above
 *          and shall have the same value of the "mimetype" specified in clause 6.2.2 item 1 if present.
 *
 * 6.2.2 Contents of Container
 *       [..]
 *       1) An optional "mimetype", defined in clause A.1, containing the mime type as defined in clause 6.2.1, item 2. If
 *          the container file extension does not imply use of a supported container format then the "mimetype" shall be
 *          present.
 *       [..]
 */
const verifyMimetype = function (zip) {

    return Promise.resolve(zip.entries)
        .then((entries) => {

            return GetZipEntryContents(zip.zipFile, FindEntry(entries, 'mimetype'));
        })
        .then((mimetype) => {

            Assert.equal(mimetype, 'application/vnd.etsi.asic-e+zip', `Unexpected mimetype: ${mimetype}`);
        });

};

module.exports = verifyMimetype;
