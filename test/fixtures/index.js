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
