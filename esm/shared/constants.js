export const global = document.defaultView;

// Node.CONSTANTS
// 'cause some engine has no global Node defined
// (i.e. Node, NativeScript, basicHTML ... )
export const ELEMENT_NODE = 1;
export const ATTRIBUTE_NODE = 2;
export const TEXT_NODE = 3;
export const COMMENT_NODE = 8;
export const DOCUMENT_FRAGMENT_NODE = 11;

// SVG related constants
export const OWNER_SVG_ELEMENT = 'ownerSVGElement';
export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

// Custom Elements / MutationObserver constants
export const CONNECTED = 'connected';
export const DISCONNECTED = 'dis' + CONNECTED;

// hyperHTML related constants
export const EXPANDO = '_hyper: ';
export const SHOULD_USE_TEXT_CONTENT = /^style|textarea$/i;
export const UID = EXPANDO + ((Math.random() * new Date) | 0) + ';';
export const UIDC = '<!--' + UID + '-->';
