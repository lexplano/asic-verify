import Yauzl from 'yauzl';

export function getZip(fn) {

    return new Promise((resolve, reject) => {

        Yauzl.open(fn, { autoClose: false }, (err, zipFile) => {

            if (err) {
                reject(err);
                return;
            }

            const entries = [];
            zipFile
                .on('entry', (entry) => {

                    entries.push(entry);
                })
                .on('error', (err) => {

                    reject(err); // @todo: create a bad zip to fake an error and test this
                })
                .on('end', () => {

                    resolve({
                        zipFile,
                        entries
                    });
                });
        });

    });

}
