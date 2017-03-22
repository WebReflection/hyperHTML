'use strict';

var _templateObject = _taggedTemplateLiteral(['\n    <article\n      onclick="alert([this.id,this.className])"\n      data-magic="', '"\n      id="', '"\n      class="', '"\n    >\n      <h3>', '</h3>\n      List of ', ' paragraphs:\n      <ul onclick="', '">', '</ul>\n    </article>\n    '], ['\n    <article\n      onclick="alert([this.id,this.className])"\n      data-magic="', '"\n      id="', '"\n      class="', '"\n    >\n      <h3>', '</h3>\n      List of ', ' paragraphs:\n      <ul onclick="', '">', '</ul>\n    </article>\n    ']),
    _templateObject2 = _taggedTemplateLiteral(['<li>', '</li>'], ['<li>', '</li>']),
    _templateObject3 = _taggedTemplateLiteral(['\n      <tr>\n        <td>even</td>\n        <td style="text-align:right;font-weight:bold">IE</td>\n      </tr>\n      <tr>\n        <td colspan="2">\n          can do partial ', '\n        </td>\n      </tr>\n    '], ['\n      <tr>\n        <td>even</td>\n        <td style="text-align:right;font-weight:bold">IE</td>\n      </tr>\n      <tr>\n        <td colspan="2">\n          can do partial ', '\n        </td>\n      </tr>\n    ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

window.onload = function () {

  var articleElement = document.querySelector('article');

  var update = function update(render, state) {
    return render(_templateObject, state.magic, state.id, state.class, state.title, state.paragraphs.length, function (e) {
      return alert(e.target.innerHTML);
    }, state.paragraphs.map(function (p) {
      return hyperHTML.wire(p)(_templateObject2, p.title);
    }));
  };

  update(hyperHTML.bind(articleElement), {
    id: 'completely-random',
    class: 'it-does-not-matter',
    title: 'True story',
    magic: true,
    paragraphs: [{ title: 'touching' }, { title: 'incredible' }, { title: 'doge' }]
  });

  var tbody = hyperHTML.bind(document.body.appendChild(document.createElement('table')).appendChild(document.createElement('tbody')));

  tbody(_templateObject3, '<tr>');
};