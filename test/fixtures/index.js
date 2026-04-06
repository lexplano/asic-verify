import { join } from 'node:path';
import { readFileSync } from 'node:fs';

const readFixtureFile = function (fn) {

    return readFileSync(join(import.meta.dirname, fn)).toString();
};

export const VALID_ZIP_PATH = join(import.meta.dirname, 'valid.zip');
export const PAKETO_INFO_XML = readFixtureFile('PaketoInfo.xml');
export const SIGNING_CERTIFICATE_PEM = readFixtureFile('cert.pem');

// The first deflate-compressed entry in valid.zip, whose data is corrupted by createCorruptZipBuffer()
export const CORRUPT_ZIP_ENTRY = '20150721-0b35d3402fae11e5b1be8e104a145478.zip';

/**
 * Returns a Buffer based on valid.zip with bytes corrupted inside the deflate-compressed
 * data of CORRUPT_ZIP_ENTRY, causing a decompression error when that entry is read.
 * The central directory is untouched so the zip opens successfully.
 */
export function createCorruptZipBuffer() {

    const buf = Buffer.from(readFileSync(VALID_ZIP_PATH));
    // Entry at offset 69: local header (30 bytes) + filename (45 bytes) = data at byte 144
    // Corrupt bytes 100 bytes into the compressed data stream
    for (let i = 244; i < 344; i++) {
        buf[i] = 0xFF;
    }
    return buf;
}

/**
 * Returns a Buffer based on valid.zip with the second central directory entry's signature
 * corrupted. The EOCD and first CD entry are intact so the zip opens and emits the first
 * entry, but yauzl then emits an error event — covering the zipFile.on('error') path in getZip.
 */
export function createCorruptCentralDirectoryBuffer() {

    const buf = Buffer.from(readFileSync(VALID_ZIP_PATH));
    // EOCD is the last 22 bytes (valid.zip has no zip comment)
    const eocdOffset = buf.length - 22;
    const cdOffset = buf.readUInt32LE(eocdOffset + 16);
    // Skip the first CD entry: 46-byte fixed header + filename + extra + comment
    const firstFilenameLen = buf.readUInt16LE(cdOffset + 28);
    const firstExtraLen = buf.readUInt16LE(cdOffset + 30);
    const firstCommentLen = buf.readUInt16LE(cdOffset + 32);
    const secondCdOffset = cdOffset + 46 + firstFilenameLen + firstExtraLen + firstCommentLen;
    // Overwrite the second entry's signature bytes
    buf[secondCdOffset] = 0xFF;
    buf[secondCdOffset + 1] = 0xFF;
    return buf;
}

/**
 * Returns a Buffer based on valid.zip with the local file header signature of the first
 * entry (mimetype, at offset 0) corrupted. The central directory is untouched so getZip()
 * enumerates all entries, but openReadStream() for 'mimetype' fails with an invalid
 * local header signature — covering the openReadStream err callback path.
 */
export function createCorruptLocalHeaderBuffer() {

    const buf = Buffer.from(readFileSync(VALID_ZIP_PATH));
    // Local file header signature for 'mimetype' is at offset 0 (PK\x03\x04)
    buf[0] = 0xFF;
    buf[1] = 0xFF;
    return buf;
}
