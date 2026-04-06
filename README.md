# asic-verify
Verify ASiC (Associated Signature Container)

## Usage

```js
import { verifyAsic } from 'asic-verify';

try {
  const signedSignatureProperties = await verifyAsic('/path/to/some-package.asice');
  console.log('Verified OK');
  console.log('Signed on ', signedSignatureProperties.signingTime);
  console.log('Signed by ', signedSignatureProperties.signingCertificate);
} catch (err) {
  console.error('Verification failed with an error', err);
}
```

```sh
asic-verify /path/to/some-package.asice
```

## Support

Limited to ASiC-e + XAdES for packages received via https://www.e-tar.lt/ data export API.

## Docs
* http://www.etsi.org/deliver/etsi_ts/102900_102999/102918/01.03.01_60/ts_102918v010301p.pdf
* http://www.etsi.org/deliver/etsi_ts%5C101900_101999%5C101903%5C01.04.02_60%5Cts_101903v010402p.pdf
