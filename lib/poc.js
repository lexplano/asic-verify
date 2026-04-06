import { Crypto } from '@peculiar/webcrypto';
import { Application } from 'xmldsigjs';
Application.setEngine('NodeJS', new Crypto());

import * as xmldom from '@xmldom/xmldom';
import xpath from 'xpath';
import { setNodeDependencies, Parse } from 'xml-core';

setNodeDependencies({
    XMLSerializer: xmldom.XMLSerializer,
    DOMParser: xmldom.DOMParser,
    DOMImplementation: xmldom.DOMImplementation,
    xpath,
});

import * as xadesjs from 'xadesjs';

import {getZip} from "../lib/getZip.js";
import {findEntry} from "../lib/findEntry.js";
import {getZipEntryXml} from "../lib/getZipEntryXml.js";
import {getZipEntryContents} from "../lib/getZipEntryContents.js";
import {getZipEntrySha256} from "../lib/getZipEntrySha256.js";

const zip = await getZip("../test/fixtures/valid.zip");

const { entries } = zip;
const manifestEntry = findEntry(entries, 'META-INF/signatures.xml');
const { xml: signaturesXml, raw: signaturesRaw, dom: signaturesDom } = await getZipEntryXml(zip.zipFile, manifestEntry);

console.info(await verifyXAdES(signaturesRaw.toString()));

async function verifyXAdES(signedXmlString) {
    const doc = xadesjs.Parse(signedXmlString);
    const signatures = doc.getElementsByTagNameNS(
        'http://www.w3.org/2000/09/xmldsig#',
        'Signature'
    );

    const signedXml = new xadesjs.SignedXml(doc);
    signedXml.LoadXml(signatures[0]);

    signedXml.contentHandler = async (reference, target) => {

        if (reference.Uri.startsWith('#')) {
            const id = reference.Uri.substr(1);
            // temporary workaround until https://github.com/PeculiarVentures/xmldsigjs/pull/94
            // for (const el of target.document.getElementsByTagName('*')) {
            //     const idAttrNames = ['Id', 'ID', 'id'];
            //     for (const attrName of idAttrNames) {
            //         if (el.hasAttribute(attrName) && el.getAttribute(attrName) === id) {
            //             return el;
            //         }
            //     }
            // }
            return; // let it resolve itself
        }

        const contents = await getZipEntryContents(zip.zipFile, findEntry(entries, reference.Uri));
        return contents;
    }

    const isValid = await signedXml.Verify();
    return isValid;
}
