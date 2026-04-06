import { VALID_ZIP_PATH, SIGNING_CERTIFICATE_PEM } from './fixtures/index.js';
import { verifyAsic } from '../lib/index.js';

describe('asic-verify', () => {

    it('should return OK for valid.zip', async () => {

        const signatureInfo = await verifyAsic(VALID_ZIP_PATH);
        expect(signatureInfo.signingCertificate).toEqual(SIGNING_CERTIFICATE_PEM);
        expect(signatureInfo.signingTime).toBe('2015-07-21T22:00:13Z');
    });

    it('should reject when no such file', async () => {

        await expect(verifyAsic('no-such-file'))
            .rejects.toThrow('ENOENT: no such file or directory, open \'no-such-file\'');
    });

});
