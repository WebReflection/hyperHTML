// TODO:  I'd love to code-cover RegExp too here
//        these are fundamental for this library

const attrName = '[^\\S]+[^ \\f\\n\\r\\t\\/><"\'=]+';
const tagName = '<([a-z]+[a-z0-9:_-]*)((?:';
const attrPartials = '(?:=(?:\'.*?\'|".*?"|<.+?>|\\S+))?)';

const attrSeeker = new RegExp(
  tagName + attrName + attrPartials + '+)([^\\S]*/?>)',
  'gi'
);

const selfClosing = new RegExp(
  tagName + attrName + attrPartials + '*)([^\\S]*/>)',
  'gi'
);

export {attrName, attrSeeker, selfClosing};
