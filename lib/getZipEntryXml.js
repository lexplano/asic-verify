'use strict';

const GetZipEntryContents = require('./getZipEntryContents');
const ParseXmlString = require('denodeify')(require('xml2js').parseString);

const DOMParser = require('xmldom').DOMParser;

const getZipEntryXml = function (zipfile, entry) {

    return GetZipEntryContents(zipfile, entry)
        .then((contents) => {

            return Promise.all([contents, ParseXmlString(contents)]);
        })
        .then((res) => {

            // @todo: get rid of xml2js and rely on xmldom, possibly with some extra layer around it
            return {
                xml: res[1],
                raw: res[0],
                dom: new DOMParser().parseFromString(res[0].toString(), 'text/xml')
            };
        });
};

module.exports = getZipEntryXml;
