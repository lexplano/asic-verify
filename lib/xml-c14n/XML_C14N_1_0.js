"use strict";

// note: this is a dirty dirty dirty hack, just to make things work
// real reference implementation: https://git.gnome.org/browse/libxml2/tree/c14n.c

var ExclusiveCanonicalization = require("xml-crypto/lib/exclusive-canonicalization").ExclusiveCanonicalization;

function XML_C14N_1_0() {
	ExclusiveCanonicalization.call(this);
}

XML_C14N_1_0.prototype = Object.create(ExclusiveCanonicalization.prototype);
XML_C14N_1_0.prototype.constructor = XML_C14N_1_0;
XML_C14N_1_0.prototype.getAlgorithmName = function () {
	return 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315';
};
XML_C14N_1_0.prototype.process = function (node, options) {

	// it seems to me, that the primary difference is that xmlns:* attributes are not copied over in
	// exclusive canonicalization - I don't know why
	// I arrived at this conclusion by reusing PHP's C14N, which is essentially libxml's C14N
	// so the hack I'm putting in is to clone the xmlns:*, clone the original node and try Exclusive again
	var xmlnsAttributes = [];
	var parentNode = node.parentNode;
	while (parentNode) {
		if (parentNode.attributes) {
			var filtered = [].slice.apply(parentNode.attributes)
				.filter(function (attribute) {
					return attribute.prefix === "xmlns";
				})
				.map(function (attribute) {
					return attribute.cloneNode();
				});
			xmlnsAttributes.push.apply(xmlnsAttributes, filtered);
		}
		parentNode = parentNode.parentNode;
	}

	var cloned = node.cloneNode(true);
	xmlnsAttributes.forEach(function (attribute) {
		cloned.setAttributeNode(attribute);
	});
	return ExclusiveCanonicalization.prototype.process.call(this, cloned, options);

};

module.exports = XML_C14N_1_0;
