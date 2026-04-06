import { createHash } from 'node:crypto';

export function getZipEntrySha256(zipfile, entry) {
  return new Promise((resolve, reject) => {
    zipfile.openReadStream(entry, (err, readStream) => {
      if (err) {
        return reject(err);
      }

      const hash = createHash('sha256');

      readStream
        .on('data', (chunk) => {
          hash.update(chunk);
        })
        .on('error', (err) => {
          reject(err);
        })
        .on('end', () => {
          resolve(hash.digest('base64'));
        });
    });
  });
}
