import { getZip } from './getZip.js';
import { verifyMimetype } from './verifyMimetype.js';
import { verifyManifest } from './verifyManifest.js';
import { verifySignatures } from './verifySignatures.js';

export async function verifyAsic(fn) {

    const zip = await getZip(fn);

    try {
        const [,,certInfo] = await Promise.all([
            verifyMimetype(zip),
            verifyManifest(zip),
            verifySignatures(zip)
        ]);

        return certInfo;
    }
    finally {
        zip.zipFile.close();
    }
}
