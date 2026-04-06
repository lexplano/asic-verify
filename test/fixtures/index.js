import { join } from 'node:path';
import { readFileSync } from 'node:fs';

const readFixtureFile = function (fn) {

    return readFileSync(join(import.meta.dirname, fn)).toString();
};

export const VALID_ZIP_PATH = join(import.meta.dirname, 'valid.zip');
export const PAKETO_INFO_XML = readFixtureFile('PaketoInfo.xml');
export const SIGNING_CERTIFICATE_PEM = readFixtureFile('cert.pem');
