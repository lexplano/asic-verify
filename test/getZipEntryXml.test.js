import {PAKETO_INFO_XML, VALID_ZIP_PATH} from './fixtures/index.js';
import { getZip } from '../lib/getZip.js';
import { findEntry } from '../lib/findEntry.js';
import { getZipEntryXml } from '../lib/getZipEntryXml.js';

describe('getZipEntryXml', () => {

    let fixtureZip;
    beforeEach(async () => {

        fixtureZip = await getZip(VALID_ZIP_PATH);
    });

    afterEach(() => {

        fixtureZip.zipFile.close();
    });

    it('should return the parsed XML of an entry', async () => {

        const data = await getZipEntryXml(fixtureZip.zipFile, findEntry(fixtureZip.entries, 'PaketoInfo.xml'));

        expect(data.xml).toEqual({
            paketoInfo: {
                'ID': ['8CDFB892-BC65-4192-AA23-907A5F856662'],
                'PaketoDydisMB': ['1'],
                'SukūrimoData': ['2015-07-22'],
                'TeisėsAktaiIki': ['2015-07-21'],
                'TeisėsAktaiNuo': ['2015-07-21']
            }
        });

        expect(data.raw.toString()).toBe(PAKETO_INFO_XML);

        expect(data.dom.getElementsByTagName('SukūrimoData')[0].textContent).toBe('2015-07-22');
    });

    it.todo('should errback when no such entry');
    it.todo('should errback when corrupt file');

});
