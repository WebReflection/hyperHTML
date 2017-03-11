"use strict";

var _templateObject = _taggedTemplateLiteral(["\n  <div onclick=\"", "\">Hello World</div>\n"], ["\n  <div onclick=\"", "\">Hello World</div>\n"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var render = hyperHTML.bind(document.body);

var update = function update(render, info) {
  return render(_templateObject, function (event) {
    return alert(event.type);
  });
};

update(render);