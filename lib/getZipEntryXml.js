'use strict';

const { promisify } = require('node:util');
const GetZipEntryContents = require('./getZipEntryContents');
const ParseXmlString = promisify(require('xml2js').parseString);

const { DOMParser } = require('@xmldom/xmldom');

const getZipEntryXml = async function (zipfile, entry) {

    const contents = await GetZipEntryContents(zipfile, entry);
    const xml = await ParseXmlString(contents);

    // @todo: get rid of xml2js and rely on xmldom, possibly with some extra layer around it
    return {
        xml,
        raw: contents,
        dom: new DOMParser().parseFromString(contents.toString(), 'text/xml')
    };
};

module.exports = getZipEntryXml;
