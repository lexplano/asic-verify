'use strict';

const Fixtures = require('./fixtures');
const AsicVerify = require('../lib/index');

describe('asic-verify', () => {

    it('should return OK for valid.zip', async () => {

        const signatureInfo = await AsicVerify(Fixtures.VALID_ZIP_PATH);
        expect(signatureInfo.signingCertificate).toEqual(Fixtures.SIGNING_CERTIFICATE_PEM);
        expect(signatureInfo.signingTime).toBe('2015-07-21T22:00:13Z');
    });

    it('should reject when no such file', async () => {

        await expect(AsicVerify('no-such-file'))
            .rejects.toThrow('ENOENT: no such file or directory, open \'no-such-file\'');
    });

});
