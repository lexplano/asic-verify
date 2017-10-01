'use strict';

const Assert = require('assert');

/**
 * @param {yauzl.Entry[]} entries
 * @param {string} fn
 * @returns {yauzl.Entry}
 */
const findEntry = function (entries, fn) {

    const entry = entries.filter((item) => {

        return item.fileName === fn;
    });
    Assert.equal(entry.length, 1, `Could not find exactly one entry for ${fn}`);
    return entry[0];
};

module.exports = findEntry;
