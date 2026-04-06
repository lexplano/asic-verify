import { promisify } from 'node:util';
import xml2js from 'xml2js';
import { DOMParser } from '@xmldom/xmldom';
import { getZipEntryContents } from './getZipEntryContents.js';

const parseXmlString = promisify(xml2js.parseString);

export async function getZipEntryXml(zipfile, entry) {
  const contents = await getZipEntryContents(zipfile, entry);
  const xml = await parseXmlString(contents);

  // @todo: get rid of xml2js and rely on xmldom, possibly with some extra layer around it
  return {
    xml,
    raw: contents,
    dom: new DOMParser().parseFromString(contents.toString(), 'text/xml'),
  };
}
