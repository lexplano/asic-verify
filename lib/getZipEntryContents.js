import Concat from 'concat-stream';

export function getZipEntryContents(zipfile, entry) {
  return new Promise((resolve, reject) => {
    zipfile.openReadStream(entry, (err, readStream) => {
      if (err) {
        return reject(err);
      }

      readStream.on('error', (e) => reject(e)).pipe(Concat((buf) => resolve(buf)));
    });
  });
}
