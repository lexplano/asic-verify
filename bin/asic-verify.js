#!/usr/bin/env node
'use strict';

const fn = process.argv[2];

if (!fn) {
    throw new Error('File name not provided');
}

process.on('unhandledRejection', (err) => {

    console.warn('Unhandled rejection:', err, '\n', err.stack);
});

require('../index.js')(fn, (err) => {

    if (err) {
        throw err;
    }
    console.log('OK');
});
