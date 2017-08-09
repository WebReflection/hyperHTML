'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n    <div class="app-wrapper">', '<div class="controls">\n        # Points\n        <input name="numPoints" type="range" min=10 max=10000 value="', '" onchange="', '">\n        ', '\n        <label>\n          <input name="async" type="checkbox" onchange="', '">\n          Async\n        </label>\n      </div>\n      <div class="about">\n        Demo by <a href="https://twitter.com/WebReflection" target="_blank">Andrea Giammarchi</a>,\n        based on the Preact demo by <a href="https://github.com/developit" target="_blank">Jason Miller</a>,\n        based on the Glimmer demo by <a href="http://mlange.io" target="_blank">Michael Lange</a>.\n      </div>\n    </div>'], ['\n    <div class="app-wrapper">', '<div class="controls">\n        # Points\n        <input name="numPoints" type="range" min=10 max=10000 value="', '" onchange="', '">\n        ', '\n        <label>\n          <input name="async" type="checkbox" onchange="', '">\n          Async\n        </label>\n      </div>\n      <div class="about">\n        Demo by <a href="https://twitter.com/WebReflection" target="_blank">Andrea Giammarchi</a>,\n        based on the Preact demo by <a href="https://github.com/developit" target="_blank">Jason Miller</a>,\n        based on the Glimmer demo by <a href="http://mlange.io" target="_blank">Michael Lange</a>.\n      </div>\n    </div>']),
    _templateObject2 = _taggedTemplateLiteral(['\n    <svg class="demo">\n      <g>', '</g>\n    </svg>'], ['\n    <svg class="demo">\n      <g>', '</g>\n    </svg>']),
    _templateObject3 = _taggedTemplateLiteral(['\n  <rect\n    class="point"\n    fill="', '"\n    transform="', '"\n  />'], ['\n  <rect\n    class="point"\n    fill="', '"\n    transform="', '"\n  />']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Demo = function () {
  function Demo(numPoints) {
    _classCallCheck(this, Demo);

    this.numPoints = numPoints;
    this.update = this.update.bind(this);
    this.vd = new VizDemo(numPoints, false);
  }

  _createClass(Demo, [{
    key: 'update',
    value: function update(e) {
      var prop = e.currentTarget.name;
      this[prop] = e.currentTarget[prop === 'async' ? 'checked' : 'value'];
      this.vd.update(+this.numPoints, this.async);
      this.render();
    }
  }, {
    key: 'render',
    value: function render() {
      return hyperHTML.wire(this)(_templateObject, this.vd.render(), this.numPoints, this.update, this.numPoints, this.update);
    }
  }]);

  return Demo;
}();

var Layout = {
  PHYLLOTAXIS: 0,
  GRID: 1,
  WAVE: 2,
  SPIRAL: 3
};

var LAYOUT_ORDER = [Layout.PHYLLOTAXIS, Layout.SPIRAL, Layout.PHYLLOTAXIS, Layout.GRID, Layout.WAVE];

var VizDemo = function () {
  function VizDemo(count, async) {
    _classCallCheck(this, VizDemo);

    this.layout = 0;
    this.step = 0;
    this.numSteps = 60 * 2;

    this.points = [];

    this.update(count, async);

    (this.next = this.next.bind(this))();
  }

  _createClass(VizDemo, [{
    key: 'next',
    value: function next() {
      var _this = this;

      requestAnimationFrame(this.next);

      this.step = (this.step + 1) % this.numSteps;

      if (this.step === 0) {
        this.layout = (this.layout + 1) % LAYOUT_ORDER.length;
      }

      // Clamp the linear interpolation at 80% for a pause at each finished layout state
      var pct = Math.min(1, this.step / (this.numSteps * 0.8));

      var currentLayout = LAYOUT_ORDER[this.layout];
      var nextLayout = LAYOUT_ORDER[(this.layout + 1) % LAYOUT_ORDER.length];

      // Keep these redundant computations out of the loop
      var pxProp = xForLayout(currentLayout);
      var nxProp = xForLayout(nextLayout);
      var pyProp = yForLayout(currentLayout);
      var nyProp = yForLayout(nextLayout);

      this.points.forEach(function (point) {
        point.x = lerp(point, pct, pxProp, nxProp);
        point.y = lerp(point, pct, pyProp, nyProp);
      });

      if (this.async) {
        if (!this.ric) this.ric = requestIdleCallback(function () {
          _this.ric = 0;_this.render();
        }, { timeout: 50 });
      } else {
        this.render();
      }
    }
  }, {
    key: 'makePoints',
    value: function makePoints() {
      var newPoints = [];
      for (var i = 0; i < this.count; i++) {
        newPoints.push({
          x: 0,
          y: 0,
          color: d3.interpolateViridis(i / this.count)
        });
      }
      this.points = newPoints;
      this.setAnchors();
    }
  }, {
    key: 'setAnchors',
    value: function setAnchors() {
      var _this2 = this;

      this.points.forEach(function (p, index) {
        var _project = project(_this2.grid(index)),
            _project2 = _slicedToArray(_project, 2),
            gx = _project2[0],
            gy = _project2[1];

        var _project3 = project(_this2.wave(index)),
            _project4 = _slicedToArray(_project3, 2),
            wx = _project4[0],
            wy = _project4[1];

        var _project5 = project(_this2.spiral(index)),
            _project6 = _slicedToArray(_project5, 2),
            sx = _project6[0],
            sy = _project6[1];

        var _project7 = project(_this2.phyllotaxis(index)),
            _project8 = _slicedToArray(_project7, 2),
            px = _project8[0],
            py = _project8[1];

        Object.assign(p, { gx: gx, gy: gy, wx: wx, wy: wy, sx: sx, sy: sy, px: px, py: py });
      });
    }
  }, {
    key: 'update',
    value: function update(count, async) {
      this.count = count;
      this.async = async;

      this.phyllotaxis = genPhyllotaxis(count);
      this.grid = genGrid(count);
      this.wave = genWave(count);
      this.spiral = genSpiral(count);

      this.makePoints();
    }
  }, {
    key: 'render',
    value: function render() {
      return hyperHTML.wire(this)(_templateObject2, this.points.map(renderPoint));
    }
  }]);

  return VizDemo;
}();

// utilities

function renderPoint(point) {
  return hyperHTML.wire(point, 'svg')(_templateObject3, point.color, 'translate(' + point.x + ', ' + point.y + ')');
}

var theta = Math.PI * (3 - Math.sqrt(5));

function xForLayout(layout) {
  switch (layout) {
    case Layout.PHYLLOTAXIS:
      return 'px';
    case Layout.GRID:
      return 'gx';
    case Layout.WAVE:
      return 'wx';
    case Layout.SPIRAL:
      return 'sx';
  }
}

function yForLayout(layout) {
  switch (layout) {
    case Layout.PHYLLOTAXIS:
      return 'py';
    case Layout.GRID:
      return 'gy';
    case Layout.WAVE:
      return 'wy';
    case Layout.SPIRAL:
      return 'sy';
  }
}

function lerp(obj, percent, startProp, endProp) {
  var px = obj[startProp];
  return px + (obj[endProp] - px) * percent;
}

function genPhyllotaxis(n) {
  return function (i) {
    var r = Math.sqrt(i / n);
    var th = i * theta;
    return [r * Math.cos(th), r * Math.sin(th)];
  };
}

function genGrid(n) {
  var rowLength = Math.round(Math.sqrt(n));
  return function (i) {
    return [-0.8 + 1.6 / rowLength * (i % rowLength), -0.8 + 1.6 / rowLength * Math.floor(i / rowLength)];
  };
}

function genWave(n) {
  var xScale = 2 / (n - 1);
  return function (i) {
    var x = -1 + i * xScale;
    return [x, Math.sin(x * Math.PI * 3) * 0.3];
  };
}

function genSpiral(n) {
  return function (i) {
    var t = Math.sqrt(i / (n - 1)),
        phi = t * Math.PI * 10;
    return [t * Math.cos(phi), t * Math.sin(phi)];
  };
}

function scale(magnitude, vector) {
  return vector.map(function (p) {
    return p * magnitude;
  });
}

function translate(translation, vector) {
  return vector.map(function (p, i) {
    return p + translation[i];
  });
}

function project(vector) {
  var wh = window.innerHeight / 2;
  var ww = window.innerWidth / 2;
  return translate([ww, wh], scale(Math.min(wh, ww), vector));
}

document.body.appendChild(new Demo(1000).render());