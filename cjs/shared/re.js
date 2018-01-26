'use strict';
// TODO:  I'd love to code-cover RegExp too here
//        these are fundamental for this library

const almostEverything = '[^ \\f\\n\\r\\t\\/>"\'=]+';
const attrName = '[^\\S]+' + almostEverything;
const tagName = '<([a-z]+[a-z0-9:_-]*)((?:';
const attrPartials = '(?:=(?:\'.*?\'|".*?"|<.+?>|' + almostEverything + '))?)';

const attrSeeker = new RegExp(
  tagName + attrName + attrPartials + '+)([^\\S]*/?>)',
  'gi'
);

const selfClosing = new RegExp(
  tagName + attrName + attrPartials + '*)([^\\S]*/>)',
  'gi'
);

exports.attrName = attrName;
exports.attrSeeker = attrSeeker;
exports.selfClosing = selfClosing;
