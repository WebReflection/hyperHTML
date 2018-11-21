/*! (c) Andrea Giammarchi (ISC) */var hyperHTML=function(e){"use strict";function t(){return this}function n(e){this.childNodes=e,this.length=e.length,this.first=e[0],this.last=e[this.length-1],this._=null}function r(){}function i(e){var t=Fe.get(this);return t&&t.template===Y(e)?a.apply(t.updates,arguments):o.apply(this,arguments),this}function o(e){e=Y(e);var t=Be.get(e)||u.call(this,e),n=U(this.ownerDocument,t.fragment),r=ze.create(n,t.paths);Fe.set(this,{template:e,updates:r}),a.apply(r,arguments),this.textContent="",this.appendChild(n)}function a(){for(var e=arguments.length,t=1;t<e;t++)this[t-1](arguments[t])}function u(e){var t=[],n=e.join(v).replace(Ze,Ve),r=K(this,n);ze.find(r,t,e.slice());var i={fragment:r,paths:t};return Be.set(e,i),i}function c(e){return arguments.length<2?null==e?qe("html"):"string"==typeof e?c.wire(null,e):"raw"in e?qe("html")(e):"nodeType"in e?c.bind(e):Je(e,"html"):("raw"in e?qe("html"):c.wire).apply(null,arguments)}var l=document.defaultView,f=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,s="http://www.w3.org/2000/svg",d=/^(?:style|textarea)$/i,h="_hyper: "+(Math.random()*new Date|0)+";",v="\x3c!--"+h+"--\x3e",p=l.Event;try{new p("Event")}catch(Xe){p=function(e){var t=document.createEvent("Event");return t.initEvent(e,!1,!1),t}}var m=l.Map||function(){var e=[],t=[];return{get:function(n){return t[e.indexOf(n)]},set:function(n,r){t[e.push(n)-1]=r}}},g=0,b=l.WeakMap||function(){var e=h+g++;return{"delete":function(t){delete t[e]},get:function(t){return t[e]},set:function(t,n){Object.defineProperty(t,e,{configurable:!0,value:n})}}},w=l.WeakSet||function(){var e=new b;return{"delete":function(t){e["delete"](t)},add:function(t){e.set(t,!0)},has:function(t){return!0===e.get(t)}}},y=Array.isArray||function(e){return function(t){return"[object Array]"===e.call(t)}}({}.toString),N=h.trim||function(){return this.replace(/^\s+|\s+$/g,"")},x=function(e,t){var n="_"+e+"$";return{get:function(){return this[n]||E(this,n,t.call(this,e))},set:function(e){E(this,n,e)}}},E=function(e,t,n){return Object.defineProperty(e,t,{configurable:!0,value:"function"==typeof n?function(){return e._wire$=n.apply(this,arguments)}:n})[t]},k={},C={},A=[],O=C.hasOwnProperty,j=0,S={attributes:k,define:function(e,t){e.indexOf("-")<0?(e in C||(j=A.push(e)),C[e]=t):k[e]=t},invoke:function(e,t){for(var n=0;n<j;n++){var r=A[n];if(O.call(e,r))return C[r](e[r],t)}}},T=" \\f\\n\\r\\t",L="[ "+T+"]+[^  \\f\\n\\r\\t\\/>\"'=]+",M="<([A-Za-z]+[A-Za-z0-9:_-]*)((?:",$="(?:=(?:'[^']*?'|\"[^\"]*?\"|<[^>]*?>|[^  \\f\\n\\r\\t\\/>\"'=]+))?)",_=new RegExp(M+L+$+"+)([ "+T+"]*/?>)","g"),D=new RegExp(M+L+$+"*)([ "+T+"]*/>)","g"),P=function(e,t){return R(e).createElement(t)},R=function(e){return e.ownerDocument||e},H=function(e){return R(e).createDocumentFragment()},W=function(e,t){return R(e).createTextNode(t)},z=H(document),F="append"in z,B="content"in P(document,"template");z.appendChild(W(z,"g")),z.appendChild(W(z,""));var Z=1===z.cloneNode(!0).childNodes.length,V="importNode"in document,G=F?function(e,t){e.append.apply(e,t)}:function(e,t){for(var n=t.length,r=0;r<n;r++)e.appendChild(t[r])},I=new RegExp("("+L+"=)(['\"]?)"+v+"\\2","gi"),q=function(e,t,n,r){return"<"+t+n.replace(I,J)+r},J=function(e,t,n){return t+(n||'"')+h+(n||'"')},K=function(e,t){return("ownerSVGElement"in e?ne:te)(e,t.replace(_,q))},Q=Z?function(e){for(var t=e.cloneNode(),n=e.childNodes||[],r=n.length,i=0;i<r;i++)t.appendChild(Q(n[i]));return t}:function(e){return e.cloneNode(!0)},U=V?function(e,t){return e.importNode(t,!0)}:function(e,t){return Q(t)},X=[].slice,Y=function(e){return ee(e)},ee=function(e){if(e.propertyIsEnumerable("raw")||!Object.isFrozen(e.raw)||/Firefox\/(\d+)/.test((l.navigator||{}).userAgent)&&parseFloat(RegExp.$1)<55){var t={};ee=function(e){var n="^"+e.join("^");return t[n]||(t[n]=e)}}else ee=function(e){return e};return ee(e)},te=B?function(e,t){var n=P(e,"template");return n.innerHTML=t,n.content}:function(e,t){var n=P(e,"template"),r=H(e);if(/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(t)){var i=RegExp.$1;n.innerHTML="<table>"+t+"</table>",G(r,X.call(n.querySelectorAll(i)))}else n.innerHTML=t,G(r,X.call(n.childNodes));return r},ne=B?function(e,t){var n=H(e),r=R(e).createElementNS(s,"svg");return r.innerHTML=t,G(n,X.call(r.childNodes)),n}:function(e,t){var n=H(e),r=P(e,"div");return r.innerHTML='<svg xmlns="'+s+'">'+t+"</svg>",G(n,X.call(r.firstChild.childNodes)),n};n.prototype.valueOf=function(e){var t=null==this._;return t&&(this._=H(this.first)),(t||e)&&G(this._,this.childNodes),this._},n.prototype.remove=function(){this._=null;var e=this.first,t=this.last;if(2===this.length)t.parentNode.removeChild(t);else{var n=R(e).createRange();n.setStartBefore(this.childNodes[1]),n.setEndAfter(t),n.deleteContents()}return e};var re=function(e){var t=[],n=void 0;switch(e.nodeType){case 1:case 11:n=e;break;case 8:n=e.parentNode,ie(t,n,e);break;default:n=e.ownerElement}for(e=n;n=n.parentNode;e=n)ie(t,n,e);return t},ie=function(e,t,n){e.unshift(e.indexOf.call(t.childNodes,n))},oe={create:function(e,t,n){return{type:e,name:n,node:t,path:re(t)}},find:function(e,t){for(var n=t.length,r=0;r<n;r++)e=e.childNodes[t[r]];return e}},ae=/acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i,ue=function(e,t,n){if(n){var r=t.cloneNode(!0);return r.value="",e.setAttributeNode(r),ce(r,n)}return ce(e.style,n)},ce=function(e,t){var n=void 0,r=void 0;return function(i){switch(typeof i){case"object":if(i){if("object"===n){if(!t&&r!==i)for(var o in r)o in i||(e[o]="")}else t?e.value="":e.cssText="";var a=t?{}:e;for(var u in i){var c=i[u],l="number"!=typeof c||ae.test(u)?c:c+"px";!t&&/^--/.test(u)?a.setProperty(u,l):a[u]=l}n="object",t?e.value=se(r=a):r=i;break}default:r!=i&&(n="string",r=i,t?e.value=i||"":e.cssText=i||"")}}},le=/([^A-Z])([A-Z]+)/g,fe=function(e,t,n){return t+"-"+n.toLowerCase()},se=function(e){var t=[];for(var n in e)t.push(n.replace(le,fe),":",e[n],";");return t.join("")},de=function(e,t,n,r,i,o){if(i-r<2)t.insertBefore(e(n[r],1),o);else{for(var a=t.ownerDocument.createDocumentFragment();r<i;)a.appendChild(e(n[r++],1));t.insertBefore(a,o)}},he=function(e,t){return e==t},ve=function(e){return e},pe=function(e,t,n,r,i,o,a){var u=o-i;if(u<1)return-1;for(;n-t>=u;){for(var c=t,l=i;c<n&&l<o&&a(e[c],r[l]);)c++,l++;if(l===o)return t;t=c+1}return-1},me=function(e,t,n,r,i,o){for(;r<i&&o(n[r],e[t-1]);)r++,t--;return 0===t},ge=function(e,t,n,r,i){return n<r?e(t[n],0):0<n?e(t[n-1],-0).nextSibling:i},be=function(e,t,n,r,i){if(i-r<2)t.removeChild(e(n[r],-1));else{var o=t.ownerDocument.createRange();o.setStartBefore(e(n[r],-1)),o.setEndAfter(e(n[i-1],-1)),o.deleteContents()}},we="undefined"==typeof Map?function(){var e=[],t=[];return{has:function(t){return-1<e.indexOf(t)},get:function(n){return t[e.indexOf(n)]},set:function(n){var r=e.indexOf(n);t[r<0?e.push(n)-1:r]=n}}}:Map,ye=function(e,t,n,r,i,o,a,u){var c=0,l=r<u?r:u,f=Array(l++),s=Array(l);s[0]=-1;for(var d=1;d<l;d++)s[d]=a;for(var h=new we,v=o;v<a;v++)h.set(i[v],v);for(var p=t;p<n;p++){var m=h.get(e[p]);null!=m&&-1<(c=Ee(s,l,m))&&(s[c]=m,f[c]={newi:p,oldi:m,prev:f[c-1]})}for(c=--l,--a;s[c]>a;)--c;l=u+r-c;var g=Array(l),b=f[c];for(--n;b;){for(var w=b,y=w.newi,N=w.oldi;n>y;)g[--l]=1,--n;for(;a>N;)g[--l]=-1,--a;g[--l]=0,--n,--a,b=b.prev}for(;n>=t;)g[--l]=1,--n;for(;a>=o;)g[--l]=-1,--a;return g},Ne=function(e,t,n,r,i,o,a){var u=n+o,c=[],l=void 0,f=void 0,s=void 0,d=void 0,h=void 0,v=void 0,p=void 0;e:for(l=0;l<=u;l++){if(l>50)return null;for(p=l-1,h=l?c[l-1]:[0,0],v=c[l]=[],f=-l;f<=l;f+=2){for(d=f===-l||f!==l&&h[p+f-1]<h[p+f+1]?h[p+f+1]:h[p+f-1]+1,s=d-f;d<o&&s<n&&a(r[i+d],e[t+s]);)d++,s++;if(d===o&&s===n)break e;v[l+f]=d}}var m=Array(l/2+u/2),g=m.length-1;for(l=c.length-1;l>=0;l--){for(;d>0&&s>0&&a(r[i+d-1],e[t+s-1]);)m[g--]=0,d--,s--;if(!l)break;p=l-1,h=l?c[l-1]:[0,0],f=d-s,f===-l||f!==l&&h[p+f-1]<h[p+f+1]?(s--,m[g--]=1):(d--,m[g--]=-1)}return m},xe=function(e,t,n,r,i,o,a,u,c){for(var l=new we,f=e.length,s=a,d=0;d<f;)switch(e[d++]){case 0:i++,s++;break;case 1:l.set(r[i],1),de(t,n,r,i++,i,s<u?t(o[s],1):c);break;case-1:s++}for(d=0;d<f;)switch(e[d++]){case 0:a++;break;case-1:l.has(o[a])?a++:be(t,n,o,a++,a)}},Ee=function(e,t,n){for(var r=1,i=t;r<i;){var o=(r+i)/2>>>0;n<e[o]?i=o:r=o+1}return r},ke=function(e,t,n,r,i,o,a,u,c,l,f,s,d){xe(Ne(n,r,o,a,u,l,s)||ye(n,r,i,o,a,u,c,l),e,t,n,r,a,u,f,d)},Ce=function(e,t,n,r){r||(r={});for(var i=r.compare||he,o=r.node||ve,a=null==r.before?null:o(r.before,0),u=t.length,c=u,l=0,f=n.length,s=0;l<c&&s<f&&i(t[l],n[s]);)l++,s++;for(;l<c&&s<f&&i(t[c-1],n[f-1]);)c--,f--;var d=l===c,h=s===f;if(d&&h)return n;if(d&&s<f)return de(o,e,n,s,f,ge(o,t,l,u,a)),n;if(h&&l<c)return be(o,e,t,l,c),n;var v=c-l,p=f-s,m=-1;if(v<p){if(-1<(m=pe(n,s,f,t,l,c,i)))return de(o,e,n,s,m,o(t[l],0)),de(o,e,n,m+v,f,ge(o,t,c,u,a)),n}else if(p<v&&-1<(m=pe(t,l,c,n,s,f,i)))return be(o,e,t,l,m),be(o,e,t,m+p,c),n;return v<2||p<2?(de(o,e,n,s,f,o(t[l],0)),be(o,e,t,l,c),n):v===p&&me(n,f,t,l,c,i)?(de(o,e,n,s,f,ge(o,t,c,u,a)),n):(ke(o,e,n,s,f,p,t,l,c,v,u,i,a),n)},Ae=l.document,Oe=/*! (c) Andrea Giammarchi */
function(e){function t(e){function t(e){f=new l;for(var t,i=e.length,o=0;o<i;o++)t=e[o],a(t.removedNodes,r,n),a(t.addedNodes,n,r);f=null}function a(e,t,n){for(var r,o=new i(t),a=e.length,u=0;u<a;1===(r=e[u++]).nodeType&&c(r,o,t,n));}function c(e,t,n,r){u.has(e)&&!f[n].has(e)&&(f[r]["delete"](e),f[n].add(e),e.dispatchEvent(t));for(var i=e.children,o=i.length,a=0;a<o;c(i[a++],t,n,r));}function l(){this[n]=new o,this[r]=new o}var f=null;try{new MutationObserver(t).observe(e,{subtree:!0,childList:!0})}catch(Xe){var s=0,d=[],h=function(e){d.push(e),clearTimeout(s),s=setTimeout(function(){t(d.splice(s=0,d.length))},0)};e.addEventListener("DOMNodeRemoved",function(e){h({addedNodes:[],removedNodes:[e.target]})},!0),e.addEventListener("DOMNodeInserted",function(e){h({addedNodes:[e.target],removedNodes:[]})},!0)}}var n="connected",r="dis"+n,i=e.Event,o=e.WeakSet,a=!0,u=new o;return function(e){return a&&(a=!a,t(e.ownerDocument)),u.add(e),e}}({Event:p,WeakSet:w});r.prototype=Object.create(null);var je=function(e){return{html:e}},Se=function Ye(e,t){return"ELEMENT_NODE"in e?e:e.constructor===n?1/t<0?t?e.remove():e.last:t?e.valueOf(!0):e.first:Ye(e.render(),t)},Te=function(e){return"ELEMENT_NODE"in e||e instanceof n||e instanceof t},Le=function(e,t){for(var n=[],r=t.length,i=0;i<r;i++){var o=t[i],a=oe.find(e,o.path);switch(o.type){case"any":n.push(Re(a,[]));break;case"attr":n.push(He(a,o.name,o.node));break;case"text":n.push(We(a)),a.textContent=""}}return n},Me=function et(e,t,n){for(var r=e.childNodes,i=r.length,o=0;o<i;o++){var a=r[o];switch(a.nodeType){case 1:$e(a,t,n),et(a,t,n);break;case 8:a.textContent===h&&(n.shift(),t.push(d.test(e.nodeName)?oe.create("text",e):oe.create("any",a)));break;case 3:d.test(e.nodeName)&&N.call(a.textContent)===v&&(n.shift(),t.push(oe.create("text",e)))}}},$e=function(e,t,n){for(var i=new r,o=e.attributes,a=X.call(o),u=[],c=a.length,l=0;l<c;l++){var f=a[l];if(f.value===h){var s=f.name;if(!(s in i)){var d=n.shift().replace(/^(?:|[\S\s]*?\s)(\S+?)=['"]?$/,"$1");i[s]=o[d]||o[d.toLowerCase()],t.push(oe.create("attr",i[s],d))}u.push(f)}}for(var v=u.length,p=0;p<v;p++){var m=u[p];/^id$/i.test(m.name)?e.removeAttribute(m.name):e.removeAttributeNode(u[p])}var g=e.nodeName;if(/^script$/i.test(g)){for(var b=Ae.createElement(g),w=0;w<o.length;w++)b.setAttributeNode(o[w].cloneNode(!0));b.textContent=e.textContent,e.parentNode.replaceChild(b,e)}},_e=function(e,t){t(e.placeholder),"text"in e?Promise.resolve(e.text).then(String).then(t):"any"in e?Promise.resolve(e.any).then(t):"html"in e?Promise.resolve(e.html).then(je).then(t):Promise.resolve(S.invoke(e,t)).then(t)},De=function(e){return null!=e&&"then"in e},Pe=/^(?:form|list)$/i,Re=function(e,t){var n={node:Se,before:e},r=!1,i=void 0;return function o(a){switch(typeof a){case"string":case"number":case"boolean":r?i!==a&&(i=a,t[0].textContent=a):(r=!0,i=a,t=Ce(e.parentNode,t,[W(e,a)],n));break;case"function":o(a(e));break;case"object":case"undefined":if(null==a){r=!1,t=Ce(e.parentNode,t,[],n);break}default:if(r=!1,i=a,y(a))if(0===a.length)t.length&&(t=Ce(e.parentNode,t,[],n));else switch(typeof a[0]){case"string":case"number":case"boolean":o({html:a});break;case"object":if(y(a[0])&&(a=a.concat.apply([],a)),De(a[0])){Promise.all(a).then(o);break}default:t=Ce(e.parentNode,t,a,n)}else Te(a)?t=Ce(e.parentNode,t,11===a.nodeType?X.call(a.childNodes):[a],n):De(a)?a.then(o):"placeholder"in a?_e(a,o):"text"in a?o(String(a.text)):"any"in a?o(a.any):"html"in a?t=Ce(e.parentNode,t,X.call(K(e,[].concat(a.html).join("")).childNodes),n):o("length"in a?X.call(a):S.invoke(a,o))}}},He=function(e,t,n){var r="ownerSVGElement"in e,i=void 0;if("style"===t)return ue(e,n,r);if(/^on/.test(t)){var o=t.slice(2);return"connected"===o||"disconnected"===o?Oe(e):t.toLowerCase()in e&&(o=o.toLowerCase()),function(t){i!==t&&(i&&e.removeEventListener(o,i,!1),i=t,t&&e.addEventListener(o,t,!1))}}if("data"===t||!r&&t in e&&!Pe.test(t))return function(n){i!==n&&(i=n,e[t]!==n&&(e[t]=n,null==n&&e.removeAttribute(t)))};if(t in S.attributes)return function(n){i=S.attributes[t](e,n),e.setAttribute(t,null==i?"":i)};var a=!1,u=n.cloneNode(!0);return function(t){i!==t&&(i=t,u.value!==t&&(null==t?(a&&(a=!1,e.removeAttributeNode(u)),u.value=t):(u.value=t,a||(a=!0,e.setAttributeNode(u)))))}},We=function(e){var t=void 0;return function n(r){if(t!==r){t=r;var i=typeof r;"object"===i&&r?De(r)?r.then(n):"placeholder"in r?_e(r,n):n("text"in r?String(r.text):"any"in r?r.any:"html"in r?[].concat(r.html).join(""):"length"in r?X.call(r).join(""):S.invoke(r,n)):"function"===i?n(r(e)):e.textContent=null==r?"":r}}},ze={create:Le,find:Me},Fe=new b,Be=function(){try{var e=new b,t=Object.freeze([]);if(e.set(t,!0),!e.get(t))throw t;return e}catch(t){return new m}}(),Ze=D,Ve=function(e,t,n){return f.test(t)?e:"<"+t+n+"></"+t+">"},Ge=new b,Ie=function(e,t){return null==e?qe(t||"html"):Je(e,t||"html")},qe=function(e){var t=void 0,n=void 0,r=void 0,o=void 0,a=void 0;return function(u){u=Y(u);var c=o!==u;return c&&(o=u,r=H(document),n="svg"===e?document.createElementNS(s,"svg"):r,a=i.bind(n)),a.apply(null,arguments),c&&("svg"===e&&G(r,X.call(n.childNodes)),t=Ke(r)),t}},Je=function(e,t){var n=t.indexOf(":"),r=Ge.get(e),i=t;return-1<n&&(i=t.slice(n+1),t=t.slice(0,n)||"html"),r||Ge.set(e,r={}),r[i]||(r[i]=qe(t))},Ke=function(e){for(var t=e.childNodes,r=t.length,i=[],o=0;o<r;o++){var a=t[o];1!==a.nodeType&&0===N.call(a.textContent).length||i.push(a)}return 1===i.length?i[0]:new n(i)},Qe=function(e){return i.bind(e)},Ue=S.define;return c.Component=t,c.bind=Qe,c.define=Ue,c.diff=Ce,c.hyper=c,c.observe=Oe,c.wire=Ie,c._={global:l,WeakMap:b,WeakSet:w},function(e){var n=new b,r=Object.create,i=function(e,t,n){return e.set(t,n),n},o=function(e,t,n,o){var u=t.get(e)||a(e,t);switch(typeof o){case"object":case"function":var c=u.w||(u.w=new b);return c.get(o)||i(c,o,new e(n));default:var l=u.p||(u.p=r(null));return l[o]||(l[o]=new e(n))}},a=function(e,t){var n={w:null,p:null};return t.set(e,n),n},u=function(e){var t=new m;return n.set(e,t),t};Object.defineProperties(t,{"for":{configurable:!0,value:function(e,t){return o(this,n.get(e)||u(e),e,null==t?"default":t)}}}),Object.defineProperties(t.prototype,{handleEvent:{value:function(e){var t=e.currentTarget;this["getAttribute"in t&&t.getAttribute("data-call")||"on"+e.type](e)}},html:x("html",e),svg:x("svg",e),state:x("state",function(){return this.defaultState}),defaultState:{get:function(){return{}}},dispatch:{value:function(e,t){var n=this._wire$;if(n){var r=new CustomEvent(e,{bubbles:!0,cancelable:!0,detail:t});return r.component=this,(n.dispatchEvent?n:n.childNodes[0]).dispatchEvent(r)}return!1}},setState:{value:function(e,t){var n=this.state,r="function"==typeof e?e.call(this,n):e;for(var i in r)n[i]=r[i];return!1!==t&&this.render(),this}}})}(qe),c}(window);
export default hyperHTML;
export const {Component, bind, define, diff, hyper, wire} = hyperHTML;
