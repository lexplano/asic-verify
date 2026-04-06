#!/usr/bin/env node

import { verifyAsic } from '../lib/index.js';

const fn = process.argv[2];

if (!fn) {
    throw new Error('File name not provided');
}

try {
    await verifyAsic(fn);
    console.log('OK');
}
catch (err) {
    console.error(err.message);
    process.exit(1);
}
