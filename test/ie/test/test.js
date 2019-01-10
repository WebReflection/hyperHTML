(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
      raw = strings.slice(0);
    }

    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  }

  function _templateObject137() {
    var data = _taggedTemplateLiteral(["<a-scene></a-scene>"]);

    _templateObject137 = function _templateObject137() {
      return data;
    };

    return data;
  }

  function _templateObject136() {
    var data = _taggedTemplateLiteral(["<svg viewBox=", "></svg>"]);

    _templateObject136 = function _templateObject136() {
      return data;
    };

    return data;
  }

  function _templateObject135() {
    var data = _taggedTemplateLiteral(["<p\n    other-attribute=", "\n    disappeared-attribute=", "\n    whatever-attribute=", "\n    null-attribute=", "\n  />"]);

    _templateObject135 = function _templateObject135() {
      return data;
    };

    return data;
  }

  function _templateObject134() {
    var data = _taggedTemplateLiteral(["<p hyper-attribute=", "/>"]);

    _templateObject134 = function _templateObject134() {
      return data;
    };

    return data;
  }

  function _templateObject133() {
    var data = _taggedTemplateLiteral(["", " - ", ""]);

    _templateObject133 = function _templateObject133() {
      return data;
    };

    return data;
  }

  function _templateObject132() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject132 = function _templateObject132() {
      return data;
    };

    return data;
  }

  function _templateObject131() {
    var data = _taggedTemplateLiteral(["<p>c</p>"]);

    _templateObject131 = function _templateObject131() {
      return data;
    };

    return data;
  }

  function _templateObject130() {
    var data = _taggedTemplateLiteral(["<p>a</p><p>b</p>"]);

    _templateObject130 = function _templateObject130() {
      return data;
    };

    return data;
  }

  function _templateObject129() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject129 = function _templateObject129() {
      return data;
    };

    return data;
  }

  function _templateObject128() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject128 = function _templateObject128() {
      return data;
    };

    return data;
  }

  function _templateObject127() {
    var data = _taggedTemplateLiteral(["\n        <li>", "</li>\n      "]);

    _templateObject127 = function _templateObject127() {
      return data;
    };

    return data;
  }

  function _templateObject126() {
    var data = _taggedTemplateLiteral(["\n        <div>A simple menu</div>\n        <ul>\n          ", "\n        </ul>\n      "]);

    _templateObject126 = function _templateObject126() {
      return data;
    };

    return data;
  }

  function _templateObject125() {
    var data = _taggedTemplateLiteral(["\n        <div>A simple menu</div>\n        <ul>\n          ", "\n        </ul>\n      "]);

    _templateObject125 = function _templateObject125() {
      return data;
    };

    return data;
  }

  function _templateObject124() {
    var data = _taggedTemplateLiteral(["\n          <div class=\"parent\" onconnected=", " ondisconnected=", ">I'm parent\n            ", "\n          </div>\n        "]);

    _templateObject124 = function _templateObject124() {
      return data;
    };

    return data;
  }

  function _templateObject123() {
    var data = _taggedTemplateLiteral(["\n          <div class=\"child\" onconnected=", " ondisconnected=", ">I'm child\n            ", "\n          </div>\n        "]);

    _templateObject123 = function _templateObject123() {
      return data;
    };

    return data;
  }

  function _templateObject122() {
    var data = _taggedTemplateLiteral(["\n        <p class=\"grandchild\" onconnected=", " ondisconnected=", ">I'm grand child</p>"]);

    _templateObject122 = function _templateObject122() {
      return data;
    };

    return data;
  }

  function _templateObject121() {
    var data = _taggedTemplateLiteral(["\n    <form onsubmit=\"", "\">\n      <label/>\n      <input type=\"email\" placeholder=\"email\" />\n      <button>Button</button>\n    </form>"]);

    _templateObject121 = function _templateObject121() {
      return data;
    };

    return data;
  }

  function _templateObject120() {
    var data = _taggedTemplateLiteral(["\n    <form onsubmit=\"", "\">\n      <label/>\n      <input type=\"email\" placeholder=\"email\">\n      <button>Button</button>\n    </form>"]);

    _templateObject120 = function _templateObject120() {
      return data;
    };

    return data;
  }

  function _templateObject119() {
    var data = _taggedTemplateLiteral(["\n    <form onsubmit=", ">\n      <label />\n      <input type=\"email\" placeholder=\"email\"/>\n      <button>Button</button>\n    </form>"]);

    _templateObject119 = function _templateObject119() {
      return data;
    };

    return data;
  }

  function _templateObject118() {
    var data = _taggedTemplateLiteral(["\n    <form onsubmit=", ">\n      <label/>\n      <input type=\"email\" placeholder=\"email\">\n      <button>Button</button>\n    </form>"]);

    _templateObject118 = function _templateObject118() {
      return data;
    };

    return data;
  }

  function _templateObject117() {
    var data = _taggedTemplateLiteral(["\n  <div style=\"width: 200px;\">\n    <svg viewBox=\"0 0 30 30\" fill=\"currentColor\">\n      <path d=\"M 0,27 L 27,0 L 30,3 L 3,30 Z\" />\n      <path d=\"M 0,3 L 3,0 L 30,27 L 27,30 Z\" />\n    </svg>\n  </div>\n  "]);

    _templateObject117 = function _templateObject117() {
      return data;
    };

    return data;
  }

  function _templateObject116() {
    var data = _taggedTemplateLiteral(["<div>\n    <self-closing\n      test=1\n    /><input\n    /><self-closing test=\"2\"\n     />\n     </div>"]);

    _templateObject116 = function _templateObject116() {
      return data;
    };

    return data;
  }

  function _templateObject115() {
    var data = _taggedTemplateLiteral(["<div><self-closing test=", " /><input /><self-closing test=\"2\" /></div>"]);

    _templateObject115 = function _templateObject115() {
      return data;
    };

    return data;
  }

  function _templateObject114() {
    var data = _taggedTemplateLiteral(["<p style=", "></p>"]);

    _templateObject114 = function _templateObject114() {
      return data;
    };

    return data;
  }

  function _templateObject113() {
    var data = _taggedTemplateLiteral(["\n        <p onconnected=", " ondisconnected=", ">hello</p>"]);

    _templateObject113 = function _templateObject113() {
      return data;
    };

    return data;
  }

  function _templateObject112() {
    var data = _taggedTemplateLiteral(["<li data-id=", ">", "</li>"]);

    _templateObject112 = function _templateObject112() {
      return data;
    };

    return data;
  }

  function _templateObject111() {
    var data = _taggedTemplateLiteral(["<ul>\n      ", "\n    </ul>"]);

    _templateObject111 = function _templateObject111() {
      return data;
    };

    return data;
  }

  function _templateObject110() {
    var data = _taggedTemplateLiteral(["<div>\n      <dumb-element dumb=", " asd=", "></dumb-element><dumber-element dumb=", "></dumber-element>\n    </div>"]);

    _templateObject110 = function _templateObject110() {
      return data;
    };

    return data;
  }

  function _templateObject109() {
    var data = _taggedTemplateLiteral(["\n        <p data-call=\"test\" onclick=", ">hello</p>"]);

    _templateObject109 = function _templateObject109() {
      return data;
    };

    return data;
  }

  function _templateObject108() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject108 = function _templateObject108() {
      return data;
    };

    return data;
  }

  function _templateObject107() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject107 = function _templateObject107() {
      return data;
    };

    return data;
  }

  function _templateObject106() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject106 = function _templateObject106() {
      return data;
    };

    return data;
  }

  function _templateObject105() {
    var data = _taggedTemplateLiteral(["\n      <p attr=", " onclick=", ">hello</p>"]);

    _templateObject105 = function _templateObject105() {
      return data;
    };

    return data;
  }

  function _templateObject104() {
    var data = _taggedTemplateLiteral(["\n      <rect x=", " y=", " />"]);

    _templateObject104 = function _templateObject104() {
      return data;
    };

    return data;
  }

  function _templateObject103() {
    var data = _taggedTemplateLiteral(["\n      <button>hello</button>"]);

    _templateObject103 = function _templateObject103() {
      return data;
    };

    return data;
  }

  function _templateObject102() {
    var data = _taggedTemplateLiteral(["<div data=", ">abc</div>"]);

    _templateObject102 = function _templateObject102() {
      return data;
    };

    return data;
  }

  function _templateObject101() {
    var data = _taggedTemplateLiteral(["<rect />"]);

    _templateObject101 = function _templateObject101() {
      return data;
    };

    return data;
  }

  function _templateObject100() {
    var data = _taggedTemplateLiteral(["<p>a", "c</p>"]);

    _templateObject100 = function _templateObject100() {
      return data;
    };

    return data;
  }

  function _templateObject99() {
    var data = _taggedTemplateLiteral(["abc"]);

    _templateObject99 = function _templateObject99() {
      return data;
    };

    return data;
  }

  function _templateObject98() {
    var data = _taggedTemplateLiteral(["<p>a", "c</p>"]);

    _templateObject98 = function _templateObject98() {
      return data;
    };

    return data;
  }

  function _templateObject97() {
    var data = _taggedTemplateLiteral(["abc"]);

    _templateObject97 = function _templateObject97() {
      return data;
    };

    return data;
  }

  function _templateObject96() {
    var data = _taggedTemplateLiteral(["a", "c"]);

    _templateObject96 = function _templateObject96() {
      return data;
    };

    return data;
  }

  function _templateObject95() {
    var data = _taggedTemplateLiteral(["abc"]);

    _templateObject95 = function _templateObject95() {
      return data;
    };

    return data;
  }

  function _templateObject94() {
    var data = _taggedTemplateLiteral(["<p>a", "c</p>"]);

    _templateObject94 = function _templateObject94() {
      return data;
    };

    return data;
  }

  function _templateObject93() {
    var data = _taggedTemplateLiteral(["abc"]);

    _templateObject93 = function _templateObject93() {
      return data;
    };

    return data;
  }

  function _templateObject92() {
    var data = _taggedTemplateLiteral(["<p>", "</p>"]);

    _templateObject92 = function _templateObject92() {
      return data;
    };

    return data;
  }

  function _templateObject91() {
    var data = _taggedTemplateLiteral(["<p>", "</p>"]);

    _templateObject91 = function _templateObject91() {
      return data;
    };

    return data;
  }

  function _templateObject90() {
    var data = _taggedTemplateLiteral(["<p>", "</p>"]);

    _templateObject90 = function _templateObject90() {
      return data;
    };

    return data;
  }

  function _templateObject89() {
    var data = _taggedTemplateLiteral(["a=", ""]);

    _templateObject89 = function _templateObject89() {
      return data;
    };

    return data;
  }

  function _templateObject88() {
    var data = _taggedTemplateLiteral(["<p>", "</p>"]);

    _templateObject88 = function _templateObject88() {
      return data;
    };

    return data;
  }

  function _templateObject87() {
    var data = _taggedTemplateLiteral(["<input name=", ">"]);

    _templateObject87 = function _templateObject87() {
      return data;
    };

    return data;
  }

  function _templateObject86() {
    var data = _taggedTemplateLiteral(["<input name=", ">"]);

    _templateObject86 = function _templateObject86() {
      return data;
    };

    return data;
  }

  function _templateObject85() {
    var data = _taggedTemplateLiteral(["<input name=", ">"]);

    _templateObject85 = function _templateObject85() {
      return data;
    };

    return data;
  }

  function _templateObject84() {
    var data = _taggedTemplateLiteral(["<input name=", ">"]);

    _templateObject84 = function _templateObject84() {
      return data;
    };

    return data;
  }

  function _templateObject83() {
    var data = _taggedTemplateLiteral(["<p any-attr=", ">any content</p>"]);

    _templateObject83 = function _templateObject83() {
      return data;
    };

    return data;
  }

  function _templateObject82() {
    var data = _taggedTemplateLiteral(["<p any-attr=", ">any content</p>"]);

    _templateObject82 = function _templateObject82() {
      return data;
    };

    return data;
  }

  function _templateObject81() {
    var data = _taggedTemplateLiteral(["<p any-attr=", ">any content</p>"]);

    _templateObject81 = function _templateObject81() {
      return data;
    };

    return data;
  }

  function _templateObject80() {
    var data = _taggedTemplateLiteral(["<p any-attr=", ">any content</p>"]);

    _templateObject80 = function _templateObject80() {
      return data;
    };

    return data;
  }

  function _templateObject79() {
    var data = _taggedTemplateLiteral(["<p any-attr=", ">any content</p>"]);

    _templateObject79 = function _templateObject79() {
      return data;
    };

    return data;
  }

  function _templateObject78() {
    var data = _taggedTemplateLiteral(["a=", ""]);

    _templateObject78 = function _templateObject78() {
      return data;
    };

    return data;
  }

  function _templateObject77() {
    var data = _taggedTemplateLiteral(["<p>", "</p>"]);

    _templateObject77 = function _templateObject77() {
      return data;
    };

    return data;
  }

  function _templateObject76() {
    var data = _taggedTemplateLiteral(["a=", ""]);

    _templateObject76 = function _templateObject76() {
      return data;
    };

    return data;
  }

  function _templateObject75() {
    var data = _taggedTemplateLiteral(["a ", ""]);

    _templateObject75 = function _templateObject75() {
      return data;
    };

    return data;
  }

  function _templateObject74() {
    var data = _taggedTemplateLiteral(["a ", ""]);

    _templateObject74 = function _templateObject74() {
      return data;
    };

    return data;
  }

  function _templateObject73() {
    var data = _taggedTemplateLiteral(["a ", ""]);

    _templateObject73 = function _templateObject73() {
      return data;
    };

    return data;
  }

  function _templateObject72() {
    var data = _taggedTemplateLiteral(["a ", ""]);

    _templateObject72 = function _templateObject72() {
      return data;
    };

    return data;
  }

  function _templateObject71() {
    var data = _taggedTemplateLiteral(["a ", ""]);

    _templateObject71 = function _templateObject71() {
      return data;
    };

    return data;
  }

  function _templateObject70() {
    var data = _taggedTemplateLiteral(["<p>", "</p>"]);

    _templateObject70 = function _templateObject70() {
      return data;
    };

    return data;
  }

  function _templateObject69() {
    var data = _taggedTemplateLiteral(["<p>", "</p>"]);

    _templateObject69 = function _templateObject69() {
      return data;
    };

    return data;
  }

  function _templateObject68() {
    var data = _taggedTemplateLiteral(["<p>", "</p>"]);

    _templateObject68 = function _templateObject68() {
      return data;
    };

    return data;
  }

  function _templateObject67() {
    var data = _taggedTemplateLiteral(["<p test=", "></p>"]);

    _templateObject67 = function _templateObject67() {
      return data;
    };

    return data;
  }

  function _templateObject66() {
    var data = _taggedTemplateLiteral(["<p _foo=", "></p>"]);

    _templateObject66 = function _templateObject66() {
      return data;
    };

    return data;
  }

  function _templateObject65() {
    var data = _taggedTemplateLiteral(["<textarea>", "</textarea>"]);

    _templateObject65 = function _templateObject65() {
      return data;
    };

    return data;
  }

  function _templateObject64() {
    var data = _taggedTemplateLiteral(["\n  <p></p>", ""]);

    _templateObject64 = function _templateObject64() {
      return data;
    };

    return data;
  }

  function _templateObject63() {
    var data = _taggedTemplateLiteral(["\n    <p></p>", ""]);

    _templateObject63 = function _templateObject63() {
      return data;
    };

    return data;
  }

  function _templateObject62() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject62 = function _templateObject62() {
      return data;
    };

    return data;
  }

  function _templateObject61() {
    var data = _taggedTemplateLiteral(["\n    <div>First name: ", "</div>\n    <p></p>"]);

    _templateObject61 = function _templateObject61() {
      return data;
    };

    return data;
  }

  function _templateObject60() {
    var data = _taggedTemplateLiteral(["\n    <input value=\"", "\" shaka=\"", "\">"]);

    _templateObject60 = function _templateObject60() {
      return data;
    };

    return data;
  }

  function _templateObject59() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject59 = function _templateObject59() {
      return data;
    };

    return data;
  }

  function _templateObject58() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject58 = function _templateObject58() {
      return data;
    };

    return data;
  }

  function _templateObject57() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject57 = function _templateObject57() {
      return data;
    };

    return data;
  }

  function _templateObject56() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject56 = function _templateObject56() {
      return data;
    };

    return data;
  }

  function _templateObject55() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject55 = function _templateObject55() {
      return data;
    };

    return data;
  }

  function _templateObject54() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject54 = function _templateObject54() {
      return data;
    };

    return data;
  }

  function _templateObject53() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject53 = function _templateObject53() {
      return data;
    };

    return data;
  }

  function _templateObject52() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject52 = function _templateObject52() {
      return data;
    };

    return data;
  }

  function _templateObject51() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject51 = function _templateObject51() {
      return data;
    };

    return data;
  }

  function _templateObject50() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject50 = function _templateObject50() {
      return data;
    };

    return data;
  }

  function _templateObject49() {
    var data = _taggedTemplateLiteral(["<rect style=", " />"]);

    _templateObject49 = function _templateObject49() {
      return data;
    };

    return data;
  }

  function _templateObject48() {
    var data = _taggedTemplateLiteral(["<script\n      src=\"../index.js?_=asd\"\n      onreadystatechange=\"", "\"\n      onload=\"", "\"\n      onerror=\"", "\"\n    ></script>"]);

    _templateObject48 = function _templateObject48() {
      return data;
    };

    return data;
  }

  function _templateObject47() {
    var data = _taggedTemplateLiteral(["<p><!--ok--></p>"]);

    _templateObject47 = function _templateObject47() {
      return data;
    };

    return data;
  }

  function _templateObject46() {
    var data = _taggedTemplateLiteral(["<textarea new>", "</textarea>"]);

    _templateObject46 = function _templateObject46() {
      return data;
    };

    return data;
  }

  function _templateObject45() {
    var data = _taggedTemplateLiteral(["<p data=", ">", "</p>"]);

    _templateObject45 = function _templateObject45() {
      return data;
    };

    return data;
  }

  function _templateObject44() {
    var data = _taggedTemplateLiteral(["<p data=", "></p>"]);

    _templateObject44 = function _templateObject44() {
      return data;
    };

    return data;
  }

  function _templateObject43() {
    var data = _taggedTemplateLiteral(["<textarea style=", ">", "</textarea>"]);

    _templateObject43 = function _templateObject43() {
      return data;
    };

    return data;
  }

  function _templateObject42() {
    var data = _taggedTemplateLiteral([" <br/>", "<br/> "]);

    _templateObject42 = function _templateObject42() {
      return data;
    };

    return data;
  }

  function _templateObject41() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject41 = function _templateObject41() {
      return data;
    };

    return data;
  }

  function _templateObject40() {
    var data = _taggedTemplateLiteral(["<tr><td>ok</td></tr>"]);

    _templateObject40 = function _templateObject40() {
      return data;
    };

    return data;
  }

  function _templateObject39() {
    var data = _taggedTemplateLiteral([""]);

    _templateObject39 = function _templateObject39() {
      return data;
    };

    return data;
  }

  function _templateObject38() {
    var data = _taggedTemplateLiteral(["<svg></svg>"]);

    _templateObject38 = function _templateObject38() {
      return data;
    };

    return data;
  }

  function _templateObject37() {
    var data = _taggedTemplateLiteral(["<rect x=\"1\" y=\"2\" />"]);

    _templateObject37 = function _templateObject37() {
      return data;
    };

    return data;
  }

  function _templateObject36() {
    var data = _taggedTemplateLiteral(["<br/>", "<br/>"]);

    _templateObject36 = function _templateObject36() {
      return data;
    };

    return data;
  }

  function _templateObject35() {
    var data = _taggedTemplateLiteral(["<p onclick=\"", "\" onmouseover=\"", "\" align=\"", "\"></p>"]);

    _templateObject35 = function _templateObject35() {
      return data;
    };

    return data;
  }

  function _templateObject34() {
    var data = _taggedTemplateLiteral(["[", "]"]);

    _templateObject34 = function _templateObject34() {
      return data;
    };

    return data;
  }

  function _templateObject33() {
    var data = _taggedTemplateLiteral(["a=", ""]);

    _templateObject33 = function _templateObject33() {
      return data;
    };

    return data;
  }

  function _templateObject32() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject32 = function _templateObject32() {
      return data;
    };

    return data;
  }

  function _templateObject31() {
    var data = _taggedTemplateLiteral(["<style> ", " </style>"]);

    _templateObject31 = function _templateObject31() {
      return data;
    };

    return data;
  }

  function _templateObject30() {
    var data = _taggedTemplateLiteral(["", "<br/>"]);

    _templateObject30 = function _templateObject30() {
      return data;
    };

    return data;
  }

  function _templateObject29() {
    var data = _taggedTemplateLiteral(["<br/>", ""]);

    _templateObject29 = function _templateObject29() {
      return data;
    };

    return data;
  }

  function _templateObject28() {
    var data = _taggedTemplateLiteral(["<!--not hyperHTML-->"]);

    _templateObject28 = function _templateObject28() {
      return data;
    };

    return data;
  }

  function _templateObject27() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject27 = function _templateObject27() {
      return data;
    };

    return data;
  }

  function _templateObject26() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject26 = function _templateObject26() {
      return data;
    };

    return data;
  }

  function _templateObject25() {
    var data = _taggedTemplateLiteral(["<p>", "</p>", "<hr><div>", "</div>", ""]);

    _templateObject25 = function _templateObject25() {
      return data;
    };

    return data;
  }

  function _templateObject24() {
    var data = _taggedTemplateLiteral(["<p></p>"]);

    _templateObject24 = function _templateObject24() {
      return data;
    };

    return data;
  }

  function _templateObject23() {
    var data = _taggedTemplateLiteral(["<a></a>"]);

    _templateObject23 = function _templateObject23() {
      return data;
    };

    return data;
  }

  function _templateObject22() {
    var data = _taggedTemplateLiteral(["<div>", "</div>"]);

    _templateObject22 = function _templateObject22() {
      return data;
    };

    return data;
  }

  function _templateObject21() {
    var data = _taggedTemplateLiteral(["<div>", "</div>"]);

    _templateObject21 = function _templateObject21() {
      return data;
    };

    return data;
  }

  function _templateObject20() {
    var data = _taggedTemplateLiteral(["<div>", "</div>"]);

    _templateObject20 = function _templateObject20() {
      return data;
    };

    return data;
  }

  function _templateObject19() {
    var data = _taggedTemplateLiteral(["<div>", "</div>"]);

    _templateObject19 = function _templateObject19() {
      return data;
    };

    return data;
  }

  function _templateObject18() {
    var data = _taggedTemplateLiteral(["<div>", "</div>"]);

    _templateObject18 = function _templateObject18() {
      return data;
    };

    return data;
  }

  function _templateObject17() {
    var data = _taggedTemplateLiteral(["<div>", "</div>"]);

    _templateObject17 = function _templateObject17() {
      return data;
    };

    return data;
  }

  function _templateObject16() {
    var data = _taggedTemplateLiteral(["\n            <li data-test=\"", "\">", "</li>\n            "]);

    _templateObject16 = function _templateObject16() {
      return data;
    };

    return data;
  }

  function _templateObject15() {
    var data = _taggedTemplateLiteral(["\n      <section>\n        <ul>", "</ul>\n      </section>"]);

    _templateObject15 = function _templateObject15() {
      return data;
    };

    return data;
  }

  function _templateObject14() {
    var data = _taggedTemplateLiteral(["\n      <span style=\"", "\">O</span>"]);

    _templateObject14 = function _templateObject14() {
      return data;
    };

    return data;
  }

  function _templateObject13() {
    var data = _taggedTemplateLiteral(["a"]);

    _templateObject13 = function _templateObject13() {
      return data;
    };

    return data;
  }

  function _templateObject12() {
    var data = _taggedTemplateLiteral(["", ""]);

    _templateObject12 = function _templateObject12() {
      return data;
    };

    return data;
  }

  function _templateObject11() {
    var data = _taggedTemplateLiteral(["\n        0\n        <p>1</p>\n      "]);

    _templateObject11 = function _templateObject11() {
      return data;
    };

    return data;
  }

  function _templateObject10() {
    var data = _taggedTemplateLiteral(["\n        <p>1</p>\n      "]);

    _templateObject10 = function _templateObject10() {
      return data;
    };

    return data;
  }

  function _templateObject9() {
    var data = _taggedTemplateLiteral(["<p id=", " class='class'>OK</p>"]);

    _templateObject9 = function _templateObject9() {
      return data;
    };

    return data;
  }

  function _templateObject8() {
    var data = _taggedTemplateLiteral(["\n      <p>1</p>\n      <p>2</p>\n      <p>3</p>\n    "]);

    _templateObject8 = function _templateObject8() {
      return data;
    };

    return data;
  }

  function _templateObject7() {
    var data = _taggedTemplateLiteral(["\n      <p>1</p>\n      <p>2</p>\n    "]);

    _templateObject7 = function _templateObject7() {
      return data;
    };

    return data;
  }

  function _templateObject6() {
    var data = _taggedTemplateLiteral(["<span onCustom-EVENT=\"", "\">how cool</span>"]);

    _templateObject6 = function _templateObject6() {
      return data;
    };

    return data;
  }

  function _templateObject5() {
    var data = _taggedTemplateLiteral(["<p>", "</p>"]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    var data = _taggedTemplateLiteral(["<a href=\"#\" onClick=\"", "\">click</a>"]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    var data = _taggedTemplateLiteral(["<p>", "</p>"]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    var data = _taggedTemplateLiteral(["<p>", " world</p>"]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    var data = _taggedTemplateLiteral(["\n    <p data-counter=\"", "\">\n      Time: ", "\n    </p>\n    "]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  tressa.title('HyperHTML');
  tressa.assert(typeof hyperHTML === 'function', 'hyperHTML is a function');

  try {
    tressa.log('');
  } catch (e) {
    tressa.log = console.log.bind(console);
  }

  tressa.async(function (done) {
    tressa.log('## injecting text and attributes');
    var i = 0;
    var div = document.body.appendChild(document.createElement('div'));
    var render = hyperHTML.bind(div);

    function update(i) {
      return render(_templateObject(), i, // IE Edge mobile did something funny here
      // as template string returned xxx.xxxx
      // but as innerHTML returned xxx.xx
      (Math.random() * new Date()).toFixed(2));
    }

    function compare(html) {
      return /^\s*<p data-counter="\d">\s*Time: \d+\.\d+<[^>]+?>\s*<\/p>\s*$/i.test(html);
    }

    var html = update(i++).innerHTML;
    var p = div.querySelector('p');
    var attr = p.attributes[0];
    tressa.assert(compare(html), 'correct HTML');
    tressa.assert(html === div.innerHTML, 'correctly returned');
    setTimeout(function () {
      tressa.log('## updating same nodes');
      var html = update(i++).innerHTML;
      tressa.assert(compare(html), 'correct HTML update');
      tressa.assert(html === div.innerHTML, 'update applied');
      tressa.assert(p === div.querySelector('p'), 'no node was changed');
      tressa.assert(attr === p.attributes[0], 'no attribute was changed');
      done();
    });
  }).then(function () {
    return tressa.async(function (done) {
      tressa.log('## perf: same virtual text twice');
      var div = document.body.appendChild(document.createElement('div'));
      var render = hyperHTML.bind(div);
      var html = (update('hello').innerHTML, update('hello').innerHTML);

      function update(text) {
        return render(_templateObject2(), text);
      }

      tressa.assert(update('hello').innerHTML === update('hello').innerHTML, 'same text');
      done(div);
    });
  }).then(function () {
    return tressa.async(function (done) {
      tressa.log('## injecting HTML');
      var div = document.body.appendChild(document.createElement('div'));
      var render = hyperHTML.bind(div);
      var html = update('hello').innerHTML;

      function update(text) {
        return render(_templateObject3(), ['<strong>' + text + '</strong>']);
      }

      function compare(html) {
        return /^<p><strong>\w+<\/strong><!--.+?--><\/p>$/i.test(html);
      }

      tressa.assert(compare(html), 'HTML injected');
      tressa.assert(html === div.innerHTML, 'HTML returned');
      done(div);
    });
  }).then(function (div) {
    return tressa.async(function (done) {
      tressa.log('## function attributes');
      var render = hyperHTML.bind(div);
      var times = 0;
      update(function (e) {
        console.log(e.type);

        if (++times > 1) {
          return tressa.assert(false, 'events are broken');
        }

        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }

        tressa.assert(true, 'onclick invoked');
        tressa.assert(!a.hasAttribute('onclick'), 'no attribute');
        update(null);
        e = document.createEvent('Event');
        e.initEvent('click', false, false);
        a.dispatchEvent(e);
        done(div);
      });

      function update(click) {
        // also test case-insensitive builtin events
        return render(_templateObject4(), click);
      }

      var a = div.querySelector('a');
      var e = document.createEvent('Event');
      e.initEvent('click', false, false);
      a.dispatchEvent(e);
    });
  }).then(function (div) {
    return tressa.async(function (done) {
      tressa.log('## changing template');
      var render = hyperHTML.bind(div);
      var html = update('hello').innerHTML;

      function update(text) {
        return render(_templateObject5(), {
          any: ['<em>' + text + '</em>']
        });
      }

      function compare(html) {
        return /^<p><em>\w+<\/em><!--.+?--><\/p>$/i.test(html);
      }

      tressa.assert(compare(html), 'new HTML injected');
      tressa.assert(html === div.innerHTML, 'new HTML returned');
      done(div);
    });
  }).then(function () {
    return tressa.async(function (done) {
      tressa.log('## custom events');
      var render = hyperHTML.bind(document.createElement('p'));
      var e = document.createEvent('Event');
      e.initEvent('Custom-EVENT', true, true);
      render(_templateObject6(), function (e) {
        tressa.assert(e.type === 'Custom-EVENT', 'event triggered');
        done();
      }).firstElementChild.dispatchEvent(e);
    });
  }).then(function () {
    tressa.log('## multi wire removal');
    var render = hyperHTML.wire();

    var update = function update() {
      return render(_templateObject7());
    };

    update().remove();

    update = function update() {
      return render(_templateObject8());
    };

    update().remove();
    tressa.assert(true, 'OK');
  }).then(function () {
    tressa.log('## the attribute id');
    var div = document.createElement('div');
    hyperHTML.bind(div)(_templateObject9(), 'id');
    tressa.assert(div.firstChild.id === 'id', 'the id is preserved');
    tressa.assert(div.firstChild.className === 'class', 'the class is preserved');
  }).then(function () {
    return tressa.async(function (done) {
      tressa.log('## hyperHTML.wire()');
      var render = hyperHTML.wire();

      var update = function update() {
        return render(_templateObject10());
      };

      var node = update();
      tressa.assert(node.nodeName.toLowerCase() === 'p', 'correct node');
      var same = update();
      tressa.assert(node === same, 'same node returned');
      render = hyperHTML.wire(null);

      update = function update() {
        return render(_templateObject11());
      };

      node = update().childNodes;
      tressa.assert(Array.isArray(node), 'list of nodes');
      same = update().childNodes;
      tressa.assert(node.length === same.length && node[0] && node.every(function (n, i) {
        return same[i] === n;
      }), 'same list returned');
      var div = document.createElement('div');
      render = hyperHTML.bind(div);
      render(_templateObject12(), node);
      same = div.childNodes;
      tressa.assert(node[0] && node.every(function (n, i) {
        return same[i] === n;
      }), 'same list applied');

      function returnSame() {
        return render(_templateObject13());
      }

      render = hyperHTML.wire();
      tressa.assert(returnSame() === returnSame(), 'template sensible wire');
      done();
    });
  }).then(function () {
    return tressa.async(function (done) {
      tressa.log('## hyperHTML.wire(object)');
      var point = {
        x: 1,
        y: 2
      };

      function update() {
        return hyperHTML.wire(point)(_templateObject14(), "\n        position: absolute;\n        left: ".concat(point.x, "px;\n        top: ").concat(point.y, "px;\n      "));
      }

      try {
        update();
      } catch (e) {
        console.error(e);
      }

      tressa.assert(update() === update(), 'same output');
      tressa.assert(hyperHTML.wire(point) === hyperHTML.wire(point), 'same wire');
      done();
    });
  }).then(function () {
    if (typeof MutationObserver === 'undefined') return;
    return tressa.async(function (done) {
      tressa.log('## preserve first child where first child is the same as incoming');
      var div = document.body.appendChild(document.createElement('div'));
      var render = hyperHTML.bind(div);
      var observer = new MutationObserver(function (mutations) {
        for (var i = 0, len = mutations.length; i < len; i++) {
          trackMutations(mutations[i].addedNodes, 'added');
          trackMutations(mutations[i].removedNodes, 'removed');
        }
      });
      observer.observe(div, {
        childList: true,
        subtree: true
      });
      var counters = [];

      function trackMutations(nodes, countKey) {
        for (var i = 0, len = nodes.length, counter, key; i < len; i++) {
          if (nodes[i] && nodes[i].getAttribute && nodes[i].getAttribute('data-test')) {
            key = nodes[i].getAttribute('data-test');
            counter = counters[key] || (counters[key] = {
              added: 0,
              removed: 0
            });
            counter[countKey]++;
          }

          if (nodes[i].childNodes.length > 0) {
            trackMutations(nodes[i].childNodes, countKey);
          }
        }
      }

      var listItems = [];

      function update(items) {
        render(_templateObject15(), items.map(function (item, i) {
          return hyperHTML.wire(listItems[i] || (listItems[i] = {}))(_templateObject16(), i, function () {
            return item.text;
          });
        }));
      }

      update([]);
      setTimeout(function () {
        update([{
          text: 'test1'
        }]);
      }, 10);
      setTimeout(function () {
        update([{
          text: 'test1'
        }, {
          text: 'test2'
        }]);
      }, 20);
      setTimeout(function () {
        update([{
          text: 'test1'
        }]);
      }, 30);
      setTimeout(function () {
        if (counters.length) {
          tressa.assert(counters[0].added === 1, 'first item added only once');
          tressa.assert(counters[0].removed === 0, 'first item never removed');
        }

        done();
      }, 100);
    });
  }).then(function () {
    tressa.log('## rendering one node');
    var div = document.createElement('div');
    var br = document.createElement('br');
    var hr = document.createElement('hr');
    hyperHTML.bind(div)(_templateObject17(), br);
    tressa.assert(div.firstChild.firstChild === br, 'one child is added');
    hyperHTML.bind(div)(_templateObject18(), hr);
    tressa.assert(div.firstChild.firstChild === hr, 'one child is changed');
    hyperHTML.bind(div)(_templateObject19(), [hr, br]);
    tressa.assert(div.firstChild.childNodes[0] === hr && div.firstChild.childNodes[1] === br, 'more children are added');
    hyperHTML.bind(div)(_templateObject20(), [br, hr]);
    tressa.assert(div.firstChild.childNodes[0] === br && div.firstChild.childNodes[1] === hr, 'children can be swapped');
    hyperHTML.bind(div)(_templateObject21(), br);
    tressa.assert(div.firstChild.firstChild === br, 'one child is kept');
    hyperHTML.bind(div)(_templateObject22(), []);
    tressa.assert(/<div><!--.+?--><\/div>/.test(div.innerHTML), 'dropped all children');
  }).then(function () {
    tressa.log('## wire by id');
    var ref = {};
    var wires = {
      a: function a() {
        return hyperHTML.wire(ref, ':a')(_templateObject23());
      },
      p: function p() {
        return hyperHTML.wire(ref, ':p')(_templateObject24());
      }
    };
    tressa.assert(wires.a().nodeName.toLowerCase() === 'a', '<a> is correct');
    tressa.assert(wires.p().nodeName.toLowerCase() === 'p', '<p> is correct');
    tressa.assert(wires.a() === wires.a(), 'same wire for <a>');
    tressa.assert(wires.p() === wires.p(), 'same wire for <p>');
  }).then(function () {
    return tressa.async(function (done) {
      tressa.log('## Promises instead of nodes');
      var wrap = document.createElement('div');
      var render = hyperHTML.bind(wrap);
      render(_templateObject25(), new Promise(function (r) {
        setTimeout(r, 50, 'any');
      }), new Promise(function (r) {
        setTimeout(r, 10, 'virtual');
      }), [new Promise(function (r) {
        setTimeout(r, 20, 1);
      }), new Promise(function (r) {
        setTimeout(r, 10, 2);
      })], [new Promise(function (r) {
        setTimeout(r, 20, 3);
      }), new Promise(function (r) {
        setTimeout(r, 10, 4);
      })]);
      var result = wrap.innerHTML;
      setTimeout(function () {
        tressa.assert(result !== wrap.innerHTML, 'promises fullfilled');
        tressa.assert(/^<p>any<!--.+?--><\/p>virtual<!--.+?--><hr(?: ?\/)?><div>12<!--.+?--><\/div>34<!--.+?-->$/.test(wrap.innerHTML), 'both any and virtual content correct');
        done();
      }, 100);
    });
  }).then(function () {
    hyperHTML.engine = hyperHTML.engine;
    tressa.log('## for code coverage sake');
    var wrap = document.createElement('div');
    var text = [document.createTextNode('a'), document.createTextNode('b'), document.createTextNode('c')];
    var testingMajinBuu = hyperHTML.bind(wrap);
    testingMajinBuu(_templateObject26(), [text]);
    tressa.assert(wrap.textContent === 'abc');
    text[0] = document.createTextNode('c');
    text[2] = document.createTextNode('a');
    testingMajinBuu(_templateObject27(), [text]);
    tressa.assert(wrap.textContent === 'cba');
    var result = hyperHTML.wire()(_templateObject28());
    tressa.assert(result.nodeType === 8, 'it is a comment');
    tressa.assert(result.textContent === 'not hyperHTML', 'correct content');
    hyperHTML.bind(wrap)(_templateObject29(), 'node before');
    tressa.assert(/^<br(?: ?\/)?>node before<!--.+?-->$/i.test(wrap.innerHTML), 'node before');
    hyperHTML.bind(wrap)(_templateObject30(), 'node after');
    tressa.assert(/^node after<!--.+?--><br(?: ?\/)?>$/i.test(wrap.innerHTML), 'node after');
    hyperHTML.bind(wrap)(_templateObject31(), 'hyper-html{}');
    tressa.assert('<style>hyper-html{}</style>' === wrap.innerHTML.toLowerCase(), 'node style');

    var empty = function empty(value) {
      return hyperHTML.bind(wrap)(_templateObject32(), value);
    };

    empty(document.createTextNode('a'));
    empty(document.createDocumentFragment());
    empty(document.createDocumentFragment());
    var fragment = document.createDocumentFragment();
    fragment.appendChild(document.createTextNode('b'));
    empty(fragment);
    empty(123);
    tressa.assert(wrap.textContent === '123', 'text as number');
    empty(true);
    tressa.assert(wrap.textContent === 'true', 'text as boolean');
    empty([1]);
    tressa.assert(wrap.textContent === '1', 'text as one entry array');
    empty(['1', '2']);
    tressa.assert(wrap.textContent === '12', 'text as multi entry array of strings');
    var arr = [document.createTextNode('a'), document.createTextNode('b')];
    empty([arr]);
    tressa.assert(wrap.textContent === 'ab', 'text as multi entry array of nodes');
    empty([arr]);
    tressa.assert(wrap.textContent === 'ab', 'same array of nodes');
    empty(wrap.childNodes);
    tressa.assert(wrap.textContent === 'ab', 'childNodes as list');
    hyperHTML.bind(wrap)(_templateObject33(), {
      length: 1,
      '0': 'b'
    });
    tressa.assert(wrap.textContent === 'a=b', 'childNodes as virtual list');

    empty = function empty() {
      return hyperHTML.bind(wrap)(_templateObject34(), 'text');
    };

    empty();
    empty();

    var onclick = function onclick(e) {};

    var handler = {
      handleEvent: onclick
    };

    empty = function empty() {
      return hyperHTML.bind(wrap)(_templateObject35(), onclick, handler, 'left');
    };

    empty();
    handler = {
      handleEvent: onclick
    };
    empty();
    empty();

    empty = function empty(value) {
      return hyperHTML.bind(wrap)(_templateObject36(), value);
    };

    empty(arr[0]);
    empty(arr);
    empty(arr);
    empty([]);
    empty(['1', '2']);
    empty(document.createDocumentFragment());
    tressa.assert(true, 'passed various virtual content scenarios');
    var svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    if (!('ownerSVGElement' in svgContainer)) svgContainer.ownerSVGElement = null;
    hyperHTML.bind(svgContainer)(_templateObject37());
    result = hyperHTML.wire(null, 'svg')(_templateObject38());
    tressa.assert(result.nodeName.toLowerCase() === 'svg', 'svg content is allowed too');
    result = hyperHTML.wire()(_templateObject39());
    tressa.assert(!result.innerHTML, 'empty content');
    var tr = hyperHTML.wire()(_templateObject40());
    tressa.assert(true, 'even TR as template');
    hyperHTML.bind(wrap)(_templateObject41(), ' 1 ');
    tressa.assert(wrap.textContent === ' 1 ', 'text in between');
    hyperHTML.bind(wrap)(_templateObject42(), 1);
    tressa.assert(/^\s*<br(?: ?\/)?>1<!--.+?--><br(?: ?\/)?>\s*$/.test(wrap.innerHTML), 'virtual content in between');
    var last = hyperHTML.wire();

    empty = function empty(style) {
      return last(_templateObject43(), style, function () {
        return 'same text';
      });
    };

    empty('border:0');
    empty({
      border: 0
    });
    empty({
      vh: 100
    });
    empty({
      vh: 10,
      vw: 1
    });
    empty(null);
    empty('');
    var sameStyle = {
      ord: 0
    };
    empty(sameStyle);
    empty(sameStyle);

    empty = function empty() {
      return last(_templateObject44(), last);
    };

    empty();
    empty();
    var p = last(_templateObject45(), last, 0);
    var UID = p.childNodes[1].data;
    last(_templateObject46(), "<!--".concat(UID, "-->"));
    hyperHTML.wire()(_templateObject47());
  }).then(function () {
    tressa.log('## <script> shenanigans');
    return tressa.async(function (done) {
      var div = document.createElement('div');
      document.body.appendChild(div);
      hyperHTML.bind(div)(_templateObject48(), function (event) {
        if (/loaded|complete/.test(event.readyState)) setTimeout(function () {
          tressa.assert(true, 'executed');
          done();
        });
      }, function () {
        tressa.assert(true, 'executed');
        done();
      }, function () {
        tressa.assert(true, 'executed');
        done();
      }); // in nodejs case

      if (!('onload' in document.defaultView)) {
        var evt = document.createEvent('Event');
        evt.initEvent('load', false, false);
        div.firstChild.dispatchEvent(evt);
      }
    });
  }).then(function () {
    tressa.log('## SVG and style');
    var render = hyperHTML.wire(null, 'svg');
    Object.prototype.ownerSVGElement = null;

    function rect(style) {
      return render(_templateObject49(), style);
    }

    var node = rect({});
    delete Object.prototype.ownerSVGElement;
    rect({
      width: 100
    });
    console.log(node.getAttribute('style'));
    tressa.assert(/width:\s*100px;/.test(node.getAttribute('style')), 'correct style object');
    rect('height:10px;');
    tressa.assert(/height:\s*10px;/.test(node.getAttribute('style')), 'correct style string');
    rect(null);
    tressa.assert(/^(?:|null)$/.test(node.getAttribute('style')), 'correct style reset');
  }).then(function () {
    var a = document.createTextNode('a');
    var b = document.createTextNode('b');
    var c = document.createTextNode('c');
    var d = document.createTextNode('d');
    var e = document.createTextNode('e');
    var f = document.createTextNode('f');
    var g = document.createTextNode('g');
    var h = document.createTextNode('h');
    var i = document.createTextNode('i');
    var div = document.createElement('div');
    var render = hyperHTML.bind(div);
    render(_templateObject50(), []);
    tressa.assert(div.textContent === '', 'div is empty');
    render(_templateObject51(), [c, d, e, f]); // all tests know that a comment node is inside the div

    tressa.assert(div.textContent === 'cdef' && div.childNodes.length === 5, 'div has 4 nodes');
    render(_templateObject52(), [c, d, e, f]);
    tressa.assert(div.textContent === 'cdef', 'div has same 4 nodes');
    render(_templateObject53(), [a, b, c, d, e, f]);
    tressa.assert(div.textContent === 'abcdef' && div.childNodes.length === 7, 'div has same 4 nodes + 2 prepends');
    render(_templateObject54(), [a, b, c, d, e, f, g, h, i]);
    tressa.assert(div.textContent === 'abcdefghi' && div.childNodes.length === 10, 'div has 6 nodes + 3 appends');
    render(_templateObject55(), [b, c, d, e, f, g, h, i]);
    tressa.assert(div.textContent === 'bcdefghi' && div.childNodes.length === 9, 'div has dropped first node');
    render(_templateObject56(), [b, c, d, e, f, g, h]);
    tressa.assert(div.textContent === 'bcdefgh' && div.childNodes.length === 8, 'div has dropped last node');
    render(_templateObject57(), [b, c, d, f, e, g, h]);
    tressa.assert(div.textContent === 'bcdfegh', 'div has changed 2 nodes');
    render(_templateObject58(), [b, d, c, f, g, e, h]);
    tressa.assert(div.textContent === 'bdcfgeh', 'div has changed 4 nodes');
    render(_templateObject59(), [b, d, c, g, e, h]);
    tressa.assert(div.textContent === 'bdcgeh' && div.childNodes.length === 7, 'div has removed central node');
  }).then(function () {
    tressa.log('## no WebKit backfire');
    var div = document.createElement('div');

    function update(value, attr) {
      return hyperHTML.bind(div)(_templateObject60(), value, attr);
    }

    var input = update('', '').firstElementChild;
    input.value = '456';
    input.setAttribute('shaka', 'laka');
    update('123', 'laka');
    tressa.assert(input.value === '123', 'correct input');
    tressa.assert(input.value === '123', 'correct attribute');
    update('', '');
    input.value = '123';
    input.attributes.shaka.value = 'laka';
    update('123', 'laka');
    tressa.assert(input.value === '123', 'input.value was not reassigned');
  }).then(function () {
    tressa.log('## wired arrays are rendered properly');
    var div = document.createElement('div');
    var employees = [{
      first: 'Bob',
      last: 'Li'
    }, {
      first: 'Ayesha',
      last: 'Johnson'
    }];

    var getEmployee = function getEmployee(employee) {
      return hyperHTML.wire(employee)(_templateObject61(), employee.first);
    };

    hyperHTML.bind(div)(_templateObject62(), employees.map(getEmployee));
    tressa.assert(div.childElementCount === 4, 'correct elements as setAny');
    hyperHTML.bind(div)(_templateObject63(), employees.map(getEmployee));
    tressa.assert(div.childElementCount === 5, 'correct elements as setVirtual');
    hyperHTML.bind(div)(_templateObject64(), []);
    tressa.assert(div.childElementCount === 1, 'only one element left');
  }).then(function () {
    return tressa.async(function (done) {
      function textarea(value) {
        return hyperHTML.bind(div)(_templateObject65(), value);
      }

      tressa.log('## textarea text');
      var div = document.createElement('div');
      textarea(1);
      var ta = div.firstElementChild;
      tressa.assert(ta.textContent === '1', 'primitives are fine');
      textarea(null);
      tressa.assert(ta.textContent === '', 'null/undefined is fine');
      var p = Promise.resolve('OK');
      textarea(p);
      p.then(function () {
        console.log(div.innerHTML);
        tressa.assert(ta.textContent === 'OK', 'promises are fine');
        textarea({
          text: 'text'
        });
        tressa.assert(ta.textContent === 'text', 'text is fine');
        textarea({
          html: 'html'
        });
        tressa.assert(ta.textContent === 'html', 'html is fine');
        textarea({
          any: 'any'
        });
        tressa.assert(ta.textContent === 'any', 'any is fine');
        textarea(['ar', 'ray']);
        tressa.assert(ta.textContent === 'array', 'array is fine');
        textarea({
          placeholder: 'placeholder'
        });
        tressa.assert(ta.textContent === 'placeholder', 'placeholder is fine');
        textarea({
          unknown: 'unknown'
        });
        tressa.assert(ta.textContent === '', 'intents are fine');
        done();
      });
    });
  }).then(function () {
    tressa.log('## attributes with weird chars');
    var div = document.createElement('div');
    hyperHTML.bind(div)(_templateObject66(), 'bar');
    tressa.assert(div.firstChild.getAttribute('_foo') === 'bar', 'OK');
  }).then(function () {
    tressa.log('## attributes without quotes');
    var div = document.createElement('div');
    hyperHTML.bind(div)(_templateObject67(), 'a"b');
    tressa.assert(div.firstChild.getAttribute('test') === 'a"b', 'OK');
  }).then(function () {
    tressa.log('## any content extras');
    var div = document.createElement('div');
    var html = hyperHTML.bind(div);
    setContent(undefined);
    tressa.assert(/<p><!--.+?--><\/p>/.test(div.innerHTML), 'expected layout');
    setContent({
      text: '<img/>'
    });
    tressa.assert(/<p>&lt;img(?: ?\/)?&gt;<!--.+?--><\/p>/.test(div.innerHTML), 'expected text');

    function setContent(which) {
      return html(_templateObject68(), which);
    }
  }).then(function () {
    tressa.log('## any different content extras');
    var div = document.createElement('div');
    hyperHTML.bind(div)(_templateObject69(), undefined);
    tressa.assert(/<p><!--.+?--><\/p>/.test(div.innerHTML), 'expected layout');
    hyperHTML.bind(div)(_templateObject70(), {
      text: '<img/>'
    });
    tressa.assert(/<p>&lt;img(?: ?\/)?&gt;<!--.+?--><\/p>/.test(div.innerHTML), 'expected text');
  }).then(function () {
    tressa.log('## virtual content extras');
    var div = document.createElement('div');
    hyperHTML.bind(div)(_templateObject71(), null);
    tressa.assert(/a <[^>]+?>/.test(div.innerHTML), 'expected layout');
    hyperHTML.bind(div)(_templateObject72(), {
      text: '<img/>'
    });
    tressa.assert(/a &lt;img(?: ?\/)?&gt;<[^>]+?>/.test(div.innerHTML), 'expected text');
    hyperHTML.bind(div)(_templateObject73(), {
      any: 123
    });
    tressa.assert(/a 123<[^>]+?>/.test(div.innerHTML), 'expected any');
    hyperHTML.bind(div)(_templateObject74(), {
      html: '<b>ok</b>'
    });
    tressa.assert(/a <b>ok<\/b><[^>]+?>/.test(div.innerHTML), 'expected html');
    hyperHTML.bind(div)(_templateObject75(), {});
    tressa.assert(/a <[^>]+?>/.test(div.innerHTML), 'expected nothing');
  }).then(function () {
    tressa.log('## defined transformer');
    hyperHTML.define('eUC', encodeURIComponent);
    var div = document.createElement('div');
    hyperHTML.bind(div)(_templateObject76(), {
      eUC: 'b c'
    });
    tressa.assert(/a=b%20c<[^>]+?>/.test(div.innerHTML), 'expected virtual layout');
    hyperHTML.bind(div)(_templateObject77(), {
      eUC: 'b c'
    });
    tressa.assert(/<p>b%20c<!--.+?--><\/p>/.test(div.innerHTML), 'expected layout'); // TODO: for coverage sake
    //       defined transformer ... so what?

    hyperHTML.define('eUC', encodeURIComponent); //       non existent one ... so what?

    hyperHTML.bind(div)(_templateObject78(), {
      nOPE: 'b c'
    });
  }).then(function () {
    tressa.log('## attributes with null values');
    var div = document.createElement('div');
    hyperHTML.bind(div)(_templateObject79(), '1');
    tressa.assert(div.firstChild.hasAttribute('any-attr') && div.firstChild.getAttribute('any-attr') === '1', 'regular attribute');
    hyperHTML.bind(div)(_templateObject80(), null);
    tressa.assert(!div.firstChild.hasAttribute('any-attr') && div.firstChild.getAttribute('any-attr') == null, 'can be removed');
    hyperHTML.bind(div)(_templateObject81(), undefined);
    tressa.assert(!div.firstChild.hasAttribute('any-attr') && div.firstChild.getAttribute('any-attr') == null, 'multiple times');
    hyperHTML.bind(div)(_templateObject82(), '2');
    tressa.assert(div.firstChild.hasAttribute('any-attr') && div.firstChild.getAttribute('any-attr') === '2', 'but can be also reassigned');
    hyperHTML.bind(div)(_templateObject83(), '3');
    tressa.assert(div.firstChild.hasAttribute('any-attr') && div.firstChild.getAttribute('any-attr') === '3', 'many other times');
    hyperHTML.bind(div)(_templateObject84(), 'test');
    tressa.assert(div.firstChild.hasAttribute('name') && div.firstChild.name === 'test', 'special attributes are set too');
    hyperHTML.bind(div)(_templateObject85(), null);
    tressa.assert(!div.firstChild.hasAttribute('name') && !div.firstChild.name, 'but can also be removed');
    hyperHTML.bind(div)(_templateObject86(), undefined);
    tressa.assert(!div.firstChild.hasAttribute('name') && !div.firstChild.name, 'with either null or undefined');
    hyperHTML.bind(div)(_templateObject87(), 'back');
    tressa.assert(div.firstChild.hasAttribute('name') && div.firstChild.name === 'back', 'and can be put back');
  }).then(function () {
    return tressa.async(function (done) {
      tressa.log('## placeholder');
      var div = document.createElement('div');
      var vdiv = document.createElement('div');
      hyperHTML.bind(div)(_templateObject88(), {
        eUC: 'b c',
        placeholder: 'z'
      });
      hyperHTML.bind(vdiv)(_templateObject89(), {
        eUC: 'b c',
        placeholder: 'z'
      });
      tressa.assert(/<p>z<!--.+?--><\/p>/.test(div.innerHTML), 'expected inner placeholder layout');
      tressa.assert(/a=z<[^>]+?>/.test(vdiv.innerHTML), 'expected virtual placeholder layout');
      setTimeout(function () {
        tressa.assert(/<p>b%20c<!--.+?--><\/p>/.test(div.innerHTML), 'expected inner resolved layout');
        tressa.assert(/a=b%20c<[^>]+?>/.test(vdiv.innerHTML), 'expected virtual resolved layout');
        hyperHTML.bind(div)(_templateObject90(), {
          text: 1,
          placeholder: '9'
        });
        setTimeout(function () {
          tressa.assert(/<p>1<!--.+?--><\/p>/.test(div.innerHTML), 'placeholder with text');
          hyperHTML.bind(div)(_templateObject91(), {
            any: [1, 2],
            placeholder: '9'
          });
          setTimeout(function () {
            tressa.assert(/<p>12<!--.+?--><\/p>/.test(div.innerHTML), 'placeholder with any');
            hyperHTML.bind(div)(_templateObject92(), {
              html: '<b>3</b>',
              placeholder: '9'
            });
            setTimeout(function () {
              tressa.assert(/<p><b>3<\/b><!--.+?--><\/p>/.test(div.innerHTML), 'placeholder with html');
              done();
            }, 10);
          }, 10);
        }, 10);
      }, 10);
    });
  }).then(function () {
    tressa.log('## hyper(...)');
    var hyper = hyperHTML.hyper;
    tressa.assert(typeof hyper() === 'function', 'empty hyper() is a wire tag');
    tressa.assert(hyper(_templateObject93()).textContent === 'abc', 'hyper`abc`');
    tressa.assert(hyper(_templateObject94(), 2).textContent === 'a2c', 'hyper`<p>a${2}c</p>`');
    tressa.assert(hyper(document.createElement('div'))(_templateObject95()).textContent === 'abc', 'hyper(div)`abc`');
    tressa.assert(hyper(document.createElement('div'))(_templateObject96(), 'b').textContent === 'abc', 'hyper(div)`a${"b"}c`'); // WFT jsdom ?!

    delete Object.prototype.nodeType;
    tressa.assert(hyper({})(_templateObject97()).textContent === 'abc', 'hyper({})`abc`');
    tressa.assert(hyper({})(_templateObject98(), 'b').textContent === 'abc', 'hyper({})`<p>a${\'b\'}c</p>`');
    tressa.assert(hyper({}, ':id')(_templateObject99()).textContent === 'abc', 'hyper({}, \':id\')`abc`');
    tressa.assert(hyper({}, ':id')(_templateObject100(), 'b').textContent === 'abc', 'hyper({}, \':id\')`<p>a${\'b\'}c</p>`');
    tressa.assert(hyper('svg')(_templateObject101()), 'hyper("svg")`<rect />`');
  }).then(function () {
    tressa.log('## data=${anyContent}');
    var obj = {
      rand: Math.random()
    };
    var div = hyperHTML.wire()(_templateObject102(), obj);
    tressa.assert(div.data === obj, 'data available without serialization');
    tressa.assert(div.outerHTML === '<div>abc</div>', 'attribute not there');
  }).then(function () {
    tressa.log('## hyper.Component');

    var Button =
    /*#__PURE__*/
    function (_hyperHTML$Component) {
      _inherits(Button, _hyperHTML$Component);

      function Button() {
        _classCallCheck(this, Button);

        return _possibleConstructorReturn(this, _getPrototypeOf(Button).apply(this, arguments));
      }

      _createClass(Button, [{
        key: "render",
        value: function render() {
          return this.html(_templateObject103());
        }
      }]);

      return Button;
    }(hyperHTML.Component);

    var Rect =
    /*#__PURE__*/
    function (_hyperHTML$Component2) {
      _inherits(Rect, _hyperHTML$Component2);

      function Rect(state) {
        var _this;

        _classCallCheck(this, Rect);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Rect).call(this));

        _this.setState(state, false);

        return _this;
      }

      _createClass(Rect, [{
        key: "render",
        value: function render() {
          return this.svg(_templateObject104(), this.state.x, this.state.y);
        }
      }]);

      return Rect;
    }(hyperHTML.Component);

    var Paragraph =
    /*#__PURE__*/
    function (_hyperHTML$Component3) {
      _inherits(Paragraph, _hyperHTML$Component3);

      function Paragraph(state) {
        var _this2;

        _classCallCheck(this, Paragraph);

        _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Paragraph).call(this));

        _this2.setState(state);

        return _this2;
      }

      _createClass(Paragraph, [{
        key: "onclick",
        value: function onclick() {
          this.clicked = true;
        }
      }, {
        key: "render",
        value: function render() {
          return this.html(_templateObject105(), this.state.attr, this);
        }
      }]);

      return Paragraph;
    }(hyperHTML.Component);

    var div = document.createElement('div');
    var render = hyperHTML.bind(div);
    render(_templateObject106(), [new Button(), new Rect({
      x: 123,
      y: 456
    })]);
    tressa.assert(div.querySelector('button'), 'the <button> exists');
    tressa.assert(div.querySelector('rect'), 'the <rect /> exists');
    tressa.assert(div.querySelector('rect').getAttribute('x') == '123', 'attributes are OK');
    var p = new Paragraph(function () {
      return {
        attr: 'test'
      };
    });
    render(_templateObject107(), p);
    tressa.assert(div.querySelector('p').getAttribute('attr') === 'test', 'the <p attr=test> is defined');
    p.render().click();
    tressa.assert(p.clicked, 'the event worked');
    render(_templateObject108(), [hyperHTML.Component.for.call(Rect, {
      x: 789,
      y: 123
    })]);
    tressa.assert(div.querySelector('rect').getAttribute('x') == '789', 'the for(state) worked');
  }).then(function () {
    return tressa.async(function (done) {
      tressa.log('## Component method via data-call');

      var Paragraph =
      /*#__PURE__*/
      function (_hyperHTML$Component4) {
        _inherits(Paragraph, _hyperHTML$Component4);

        function Paragraph() {
          _classCallCheck(this, Paragraph);

          return _possibleConstructorReturn(this, _getPrototypeOf(Paragraph).apply(this, arguments));
        }

        _createClass(Paragraph, [{
          key: "globally",
          value: function globally(e) {
            tressa.assert(e.type === 'click', 'data-call invoked globall');
            done();
          }
        }, {
          key: "test",
          value: function test(e) {
            tressa.assert(e.type === 'click', 'data-call invoked locally');
          }
        }, {
          key: "render",
          value: function render() {
            return this.html(_templateObject109(), this);
          }
        }]);

        return Paragraph;
      }(hyperHTML.Component);

      var GlobalEvent =
      /*#__PURE__*/
      function (_hyperHTML$Component5) {
        _inherits(GlobalEvent, _hyperHTML$Component5);

        function GlobalEvent() {
          _classCallCheck(this, GlobalEvent);

          return _possibleConstructorReturn(this, _getPrototypeOf(GlobalEvent).apply(this, arguments));
        }

        _createClass(GlobalEvent, [{
          key: "onclick",
          value: function onclick(e) {
            tressa.assert(e.type === 'click', 'click invoked globally');
            document.removeEventListener('click', this);
            done();
          }
        }, {
          key: "render",
          value: function render() {
            document.addEventListener('click', this);
            return document;
          }
        }]);

        return GlobalEvent;
      }(hyperHTML.Component);

      var p = new Paragraph();
      p.render().click();
      var e = document.createEvent('Event');
      e.initEvent('click', true, true);
      new GlobalEvent().render().dispatchEvent(e);
    });
  }).then(function () {
    return tressa.async(function (done) {
      tressa.log('## Custom Element attributes');
      var global = document.defaultView;
      var registry = global.customElements;
      var customElements = {
        _: Object.create(null),
        define: function define(name, Class) {
          this._[name.toLowerCase()] = Class;
        },
        get: function get(name) {
          return this._[name.toLowerCase()];
        }
      };
      Object.defineProperty(global, 'customElements', {
        configurable: true,
        value: customElements
      });

      function DumbElement() {}

      DumbElement.prototype.dumb = null;
      DumbElement.prototype.asd = null;
      customElements.define('dumb-element', DumbElement);

      function update(wire) {
        return wire(_templateObject110(), true, 'qwe', true);
      }

      var div = update(hyperHTML.wire());

      if (!(div.firstElementChild instanceof DumbElement)) {
        tressa.assert(div.firstElementChild.dumb !== true, 'not upgraded elements does not have special attributes');
        tressa.assert(div.lastElementChild.dumb !== true, 'unknown elements never have special attributes'); // simulate an upgrade

        div.firstElementChild.constructor.prototype.dumb = null;
      }

      div = update(hyperHTML.wire());
      delete div.firstElementChild.constructor.prototype.dumb;
      tressa.assert(div.firstElementChild.dumb === true, 'upgraded elements have special attributes');
      Object.defineProperty(global, 'customElements', {
        configurable: true,
        value: registry
      });
      done();
    });
  }).then(function () {
    tressa.log('## hyper.Component state');

    var DefaultState =
    /*#__PURE__*/
    function (_hyperHTML$Component6) {
      _inherits(DefaultState, _hyperHTML$Component6);

      function DefaultState() {
        _classCallCheck(this, DefaultState);

        return _possibleConstructorReturn(this, _getPrototypeOf(DefaultState).apply(this, arguments));
      }

      _createClass(DefaultState, [{
        key: "render",
        value: function render() {}
      }, {
        key: "defaultState",
        get: function get() {
          return {
            a: 'a'
          };
        }
      }]);

      return DefaultState;
    }(hyperHTML.Component);

    var State =
    /*#__PURE__*/
    function (_hyperHTML$Component7) {
      _inherits(State, _hyperHTML$Component7);

      function State() {
        _classCallCheck(this, State);

        return _possibleConstructorReturn(this, _getPrototypeOf(State).apply(this, arguments));
      }

      return State;
    }(hyperHTML.Component);

    var ds = new DefaultState();
    var o = ds.state;
    tressa.assert(!ds.propertyIsEnumerable('state'), 'states are not enumerable');
    tressa.assert(!ds.propertyIsEnumerable('_state$'), 'neither their secret');
    tressa.assert(o.a === 'a', 'default state retrieved');
    var s = new State();
    s.state = o;
    tressa.assert(s.state === o, 'state can be set too');
    ds.setState({
      b: 'b'
    });
    tressa.assert(o.a === 'a' && o.b === 'b', 'state was updated');
    s.state = {
      z: 123
    };
    tressa.assert(s.state.z === 123 && !s.state.a, 'state can be re-set too');
  }).then(function () {
    tressa.log('## splice and sort');
    var todo = [{
      id: 0,
      text: 'write documentation'
    }, {
      id: 1,
      text: 'publish online'
    }, {
      id: 2,
      text: 'create Code Pen'
    }];
    var div = document.createElement('div');
    update();
    todo.sort(function (a, b) {
      return a.text < b.text ? -1 : 1;
    });
    update();
    tressa.assert(/^\s+create Code Pen\s*publish online\s*write documentation\s+$/.test(div.textContent), 'correct order');

    function update() {
      hyperHTML.bind(div)(_templateObject111(), todo.map(function (item) {
        return hyperHTML.wire(item)(_templateObject112(), item.id, item.text);
      }));
    }
  }).then(function () {
    return tressa.async(function (done) {
      tressa.log('## Component connected/disconnected');
      var calls = 0;

      var Paragraph =
      /*#__PURE__*/
      function (_hyperHTML$Component8) {
        _inherits(Paragraph, _hyperHTML$Component8);

        function Paragraph() {
          _classCallCheck(this, Paragraph);

          return _possibleConstructorReturn(this, _getPrototypeOf(Paragraph).apply(this, arguments));
        }

        _createClass(Paragraph, [{
          key: "onconnected",
          value: function onconnected(e) {
            calls++;
            tressa.assert(e.type === 'connected', 'component connected');
            e.currentTarget.parentNode.removeChild(e.currentTarget);
          }
        }, {
          key: "ondisconnected",
          value: function ondisconnected(e) {
            calls++;
            tressa.assert(e.type === 'disconnected', 'component disconnected');
          }
        }, {
          key: "render",
          value: function render() {
            return this.html(_templateObject113(), this, this);
          }
        }]);

        return Paragraph;
      }(hyperHTML.Component);

      var p = new Paragraph().render();
      document.body.appendChild(p);

      if (p.parentNode) {
        setTimeout(function () {
          var e = document.createEvent('Event');
          e.initEvent('DOMNodeInserted', false, false);
          Object.defineProperty(e, 'target', {
            value: document.body
          });
          document.dispatchEvent(e);
          setTimeout(function () {
            e = document.createEvent('Event');
            e.initEvent('DOMNodeInserted', false, false);
            Object.defineProperty(e, 'target', {
              value: document.createTextNode('')
            });
            document.dispatchEvent(e);
            setTimeout(function () {
              e = document.createEvent('Event');
              e.initEvent('DOMNodeRemoved', false, false);
              Object.defineProperty(e, 'target', {
                value: p
              });
              document.dispatchEvent(e);
              setTimeout(function () {
                tressa.assert(calls === 2, 'correct amount of calls');
                done();
              }, 100);
            }, 100);
          }, 100);
        }, 100);
      }
    });
  }).then(function () {
    tressa.log('## style=${fun}');
    var render = hyperHTML.wire();

    function p(style) {
      return render(_templateObject114(), style);
    }

    var node = p({
      fontSize: 24
    });
    tressa.assert(node.style.fontSize, node.style.fontSize);
    p({});
    tressa.assert(!node.style.fontSize, 'object cleaned');
    p('font-size: 18px');
    tressa.assert(node.style.fontSize, node.style.fontSize);
    p({
      '--custom-color': 'red'
    });
    if (node.style.cssText !== '') tressa.assert(node.style.getPropertyValue('--custom-color') === 'red', 'custom style');else console.log('skipping CSS properties for IE');
  }).then(function () {
    tressa.log('## <self-closing />');
    var div = hyperHTML.wire()(_templateObject115(), 1);
    tressa.assert(div.childNodes.length === 3, 'nodes did self close');
    tressa.assert(div.childNodes[0].getAttribute('test') == "1", 'first node ok');
    tressa.assert(/input/i.test(div.childNodes[1].nodeName), 'second node ok');
    tressa.assert(div.childNodes[2].getAttribute('test') == "2", 'third node ok');
    div = hyperHTML.wire()(_templateObject116());
    tressa.assert(div.children.length === 3, 'nodes did self close');
    tressa.assert(div.children[0].getAttribute('test') == "1", 'first node ok');
    tressa.assert(/input/i.test(div.children[1].nodeName), 'second node ok');
    tressa.assert(div.children[2].getAttribute('test') == "2", 'third node ok');
    div = hyperHTML.wire()(_templateObject117());
    tressa.assert(div.children.length === 1, 'one svg');
    tressa.assert(div.querySelectorAll('path').length === 2, 'two paths');
  }).then(function () {
    tressa.log('## <with><self-closing /></with>');

    function check(form) {
      return form.children.length === 3 && /label/i.test(form.children[0].nodeName) && /input/i.test(form.children[1].nodeName) && /button/i.test(form.children[2].nodeName);
    }

    tressa.assert(check(hyperHTML.wire()(_templateObject118(), check)), 'no quotes is OK');
    tressa.assert(check(hyperHTML.wire()(_templateObject119(), check)), 'self closing is OK');
    tressa.assert(check(hyperHTML.wire()(_templateObject120(), check)), 'quotes are OK');
    tressa.assert(check(hyperHTML.wire()(_templateObject121(), check)), 'quotes and self-closing too OK');
  }).then(function () {
    return tressa.async(function (done) {
      tressa.log('## Nested Component connected/disconnected');

      var GrandChild =
      /*#__PURE__*/
      function (_hyperHTML$Component9) {
        _inherits(GrandChild, _hyperHTML$Component9);

        function GrandChild() {
          _classCallCheck(this, GrandChild);

          return _possibleConstructorReturn(this, _getPrototypeOf(GrandChild).apply(this, arguments));
        }

        _createClass(GrandChild, [{
          key: "onconnected",
          value: function onconnected(e) {
            tressa.assert(e.type === 'connected', 'grand child component connected');
          }
        }, {
          key: "ondisconnected",
          value: function ondisconnected(e) {
            tressa.assert(e.type === 'disconnected', 'grand child component disconnected');
          }
        }, {
          key: "render",
          value: function render() {
            return this.html(_templateObject122(), this, this);
          }
        }]);

        return GrandChild;
      }(hyperHTML.Component);

      var Child =
      /*#__PURE__*/
      function (_hyperHTML$Component10) {
        _inherits(Child, _hyperHTML$Component10);

        function Child() {
          _classCallCheck(this, Child);

          return _possibleConstructorReturn(this, _getPrototypeOf(Child).apply(this, arguments));
        }

        _createClass(Child, [{
          key: "onconnected",
          value: function onconnected(e) {
            tressa.assert(e.type === 'connected', 'child component connected');
          }
        }, {
          key: "ondisconnected",
          value: function ondisconnected(e) {
            tressa.assert(e.type === 'disconnected', 'child component disconnected');
          }
        }, {
          key: "render",
          value: function render() {
            return this.html(_templateObject123(), this, this, new GrandChild());
          }
        }]);

        return Child;
      }(hyperHTML.Component);

      var connectedTimes = 0,
          disconnectedTimes = 0;

      var Parent =
      /*#__PURE__*/
      function (_hyperHTML$Component11) {
        _inherits(Parent, _hyperHTML$Component11);

        function Parent() {
          _classCallCheck(this, Parent);

          return _possibleConstructorReturn(this, _getPrototypeOf(Parent).apply(this, arguments));
        }

        _createClass(Parent, [{
          key: "onconnected",
          value: function onconnected(e) {
            connectedTimes++;
            tressa.assert(e.type === 'connected', 'parent component connected');
            tressa.assert(connectedTimes === 1, 'connected callback should only be triggered once');
          }
        }, {
          key: "ondisconnected",
          value: function ondisconnected(e) {
            disconnectedTimes++;
            tressa.assert(e.type === 'disconnected', 'parent component disconnected');
            tressa.assert(disconnectedTimes === 1, 'disconnected callback should only be triggered once');
            done();
          }
        }, {
          key: "render",
          value: function render() {
            return this.html(_templateObject124(), this, this, new Child());
          }
        }]);

        return Parent;
      }(hyperHTML.Component);

      var p = new Parent().render();
      document.body.appendChild(p);
      setTimeout(function () {
        if (p.parentNode) {
          var e = document.createEvent('Event');
          e.initEvent('DOMNodeInserted', false, false);
          Object.defineProperty(e, 'target', {
            value: document.body
          });
          document.dispatchEvent(e);
          setTimeout(function () {
            e = document.createEvent('Event');
            e.initEvent('DOMNodeRemoved', false, false);
            Object.defineProperty(e, 'target', {
              value: p
            });
            document.dispatchEvent(e);
            if (p.parentNode) p.parentNode.removeChild(p);
          }, 100);
        }
      }, 100);
    });
  }).then(function () {
    tressa.log('## Declarative Components');

    var MenuSimple =
    /*#__PURE__*/
    function (_hyperHTML$Component12) {
      _inherits(MenuSimple, _hyperHTML$Component12);

      function MenuSimple() {
        _classCallCheck(this, MenuSimple);

        return _possibleConstructorReturn(this, _getPrototypeOf(MenuSimple).apply(this, arguments));
      }

      _createClass(MenuSimple, [{
        key: "render",
        value: function render(props) {
          var _this3 = this;

          return this.setState(props, false).html(_templateObject125(), props.items.map(function (item, i) {
            return MenuItem.for(_this3, i).render(item);
          }));
        }
      }]);

      return MenuSimple;
    }(hyperHTML.Component);

    var MenuWeakMap =
    /*#__PURE__*/
    function (_hyperHTML$Component13) {
      _inherits(MenuWeakMap, _hyperHTML$Component13);

      function MenuWeakMap() {
        _classCallCheck(this, MenuWeakMap);

        return _possibleConstructorReturn(this, _getPrototypeOf(MenuWeakMap).apply(this, arguments));
      }

      _createClass(MenuWeakMap, [{
        key: "render",
        value: function render(props) {
          var _this4 = this;

          return this.setState(props, false).html(_templateObject126(), props.items.map(function (item) {
            return MenuItem.for(_this4, item).render(item);
          }));
        }
      }]);

      return MenuWeakMap;
    }(hyperHTML.Component);

    var MenuItem =
    /*#__PURE__*/
    function (_hyperHTML$Component14) {
      _inherits(MenuItem, _hyperHTML$Component14);

      function MenuItem() {
        _classCallCheck(this, MenuItem);

        return _possibleConstructorReturn(this, _getPrototypeOf(MenuItem).apply(this, arguments));
      }

      _createClass(MenuItem, [{
        key: "render",
        value: function render(props) {
          return this.setState(props, false).html(_templateObject127(), props.name);
        }
      }]);

      return MenuItem;
    }(hyperHTML.Component);

    var a = document.createElement('div');
    var b = document.createElement('div');
    var method = hyperHTML.Component.for;

    if (!MenuSimple.for) {
      MenuSimple.for = method;
      MenuWeakMap.for = method;
      MenuItem.for = method;
    }

    hyperHTML.bind(a)(_templateObject128(), MenuSimple.for(a).render({
      items: [{
        name: 'item 1'
      }, {
        name: 'item 2'
      }, {
        name: 'item 3'
      }]
    }));
    tressa.assert(MenuSimple.for(a) === MenuSimple.for(a), 'same simple menu');
    hyperHTML.bind(b)(_templateObject129(), MenuWeakMap.for(b).render({
      items: [{
        name: 'item 1'
      }, {
        name: 'item 2'
      }, {
        name: 'item 3'
      }]
    }));
    tressa.assert(MenuWeakMap.for(a) === MenuWeakMap.for(a), 'same weakmap menu');
    tressa.assert(MenuSimple.for(a) !== MenuWeakMap.for(a), 'different from simple');
    tressa.assert(MenuSimple.for(a) === MenuSimple.for(a), 'same as simple');
    tressa.assert(a.outerHTML === b.outerHTML, 'same layout');
  }).then(function () {
    tressa.log('## Component.dispatch');

    var Pomponent =
    /*#__PURE__*/
    function (_hyperHTML$Component15) {
      _inherits(Pomponent, _hyperHTML$Component15);

      function Pomponent() {
        _classCallCheck(this, Pomponent);

        return _possibleConstructorReturn(this, _getPrototypeOf(Pomponent).apply(this, arguments));
      }

      _createClass(Pomponent, [{
        key: "trigger",
        value: function trigger() {
          this.dispatch('event', 123);
        }
      }, {
        key: "render",
        value: function render() {
          return this.html(_templateObject130());
        }
      }]);

      return Pomponent;
    }(hyperHTML.Component);

    var Solonent =
    /*#__PURE__*/
    function (_hyperHTML$Component16) {
      _inherits(Solonent, _hyperHTML$Component16);

      function Solonent() {
        _classCallCheck(this, Solonent);

        return _possibleConstructorReturn(this, _getPrototypeOf(Solonent).apply(this, arguments));
      }

      _createClass(Solonent, [{
        key: "render",
        value: function render() {
          return this.html(_templateObject131());
        }
      }]);

      return Solonent;
    }(hyperHTML.Component);

    var a = document.createElement('div');
    var p = new Pomponent();
    p.trigger();
    var s = new Solonent();
    var dispatched = false;
    hyperHTML.bind(a)(_templateObject132(), [p, s]);
    a.addEventListener('event', function (event) {
      tressa.assert(event.detail === 123, 'expected details');
      tressa.assert(event.component === p, 'expected component');
      dispatched = true;
    });
    p.trigger();
    s.dispatch('test');
    if (!dispatched) throw new Error('broken dispatch');
  }).then(function () {
    tressa.log('## slotted callback');
    var div = document.createElement('div');
    var result = [];

    function A() {
      result.push(arguments);
      return {
        html: '<b>a</b>'
      };
    }

    function B() {
      result.push(arguments);
      return {
        html: '<b>b</b>'
      };
    }

    function update() {
      hyperHTML.bind(div)(_templateObject133(), A, B);
    }

    update();
    tressa.assert(result[0][0].parentNode === div, 'expected parent node for A');
    tressa.assert(result[1][0].parentNode === div, 'expected parent node for B');
  }).then(function () {
    tressa.log('## define(hyper-attribute, callback)');
    var a = document.createElement('div');
    var random = Math.random().toPrecision(6); // IE < 11

    var result = [];
    hyperHTML.define('hyper-attribute', function (target, value) {
      result.push(target, value);
      return random;
    });
    hyperHTML.bind(a)(_templateObject134(), random);
    if (!result.length) throw new Error('attributes intents failed');else {
      tressa.assert(result[0] === a.firstElementChild, 'expected target');
      tressa.assert(result[1] === random, 'expected value');
      tressa.assert(a.firstElementChild.getAttribute('hyper-attribute') == random, 'expected attribute');
    }
    result.splice(0);
    hyperHTML.define('other-attribute', function (target, value) {
      result.push(target, value);
      return '';
    });
    hyperHTML.define('disappeared-attribute', function (target, value) {});
    hyperHTML.define('whatever-attribute', function (target, value) {
      return value;
    });
    hyperHTML.define('null-attribute', function (target, value) {
      return null;
    });
    hyperHTML.bind(a)(_templateObject135(), random, random, random, random);
    if (!result.length) throw new Error('attributes intents failed');else {
      tressa.assert(result[0] === a.firstElementChild, 'expected other target');
      tressa.assert(result[1] === random, 'expected other value');
      tressa.assert(a.firstElementChild.getAttribute('other-attribute') === '', 'expected other attribute');
      tressa.assert(!a.firstElementChild.hasAttribute('disappeared-attribute'), 'disappeared-attribute removed');
      tressa.assert(a.firstElementChild.getAttribute('whatever-attribute') == random, 'whatever-attribute set');
      tressa.assert(!a.firstElementChild.hasAttribute('null-attribute'), 'null-attribute removed');
    }
  }) // WARNING THESE TEST MUST BE AT THE VERY END
  // WARNING THESE TEST MUST BE AT THE VERY END
  // WARNING THESE TEST MUST BE AT THE VERY END
  .then(function () {
    // WARNING THESE TEST MUST BE AT THE VERY END
    tressa.log('## IE9 double viewBox 🌈 🌈');
    var output = document.createElement('div');

    try {
      hyperHTML.bind(output)(_templateObject136(), '0 0 50 50');
      tressa.assert(output.firstChild.getAttribute('viewBox') == '0 0 50 50', 'correct camelCase attribute');
    } catch (o_O) {
      tressa.assert(true, 'code coverage caveat');
    }
  }).then(function () {
    tressa.log('## A-Frame compatibility');
    var output = hyperHTML.wire()(_templateObject137());
    tressa.assert(output.nodeName.toLowerCase() === 'a-scene', 'correct element');
  }) // */
  .then(function () {
    if (!tressa.exitCode) {
      document.body.style.backgroundColor = '#0FA';
    }

    tressa.end();
  });

}());
