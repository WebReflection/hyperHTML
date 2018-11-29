export const G = document.defaultView;

// Node.CONSTANTS
// 'cause some engine has no global Node defined
// (i.e. Node, NativeScript, basicHTML ... )
export const ELEMENT_NODE = 1;
export const DOCUMENT_FRAGMENT_NODE = 11;

// SVG related constants
export const OWNER_SVG_ELEMENT = 'ownerSVGElement';

// Custom Elements / MutationObserver constants
export const CONNECTED = 'connected';
export const DISCONNECTED = 'dis' + CONNECTED;
