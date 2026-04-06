#!/usr/bin/env node
'use strict';

const fn = process.argv[2];

if (!fn) {
    throw new Error('File name not provided');
}

require('../index.js')(fn).then(() => {

    console.log('OK');
}).catch((err) => {

    console.error(err.message);
    process.exit(1);
});
