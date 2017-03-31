class Demo {

  constructor(numPoints) {
    this.numPoints = numPoints;
    this.update = this.update.bind(this);
    this.vd = new VizDemo(numPoints, false);
  }

  update(e) {
    const prop = e.currentTarget.name;
    this[prop] = e.currentTarget[prop === 'async' ? 'checked' : 'value'];
    this.vd.update(+this.numPoints, this.async);
    this.render();
  }

  render() {
    return hyperHTML.wire(this)`
    <div class="app-wrapper">${
      this.vd.render()
    }<div class="controls">
        # Points
        <input name="numPoints" type="range" min=10 max=10000 value="${this.numPoints}" onchange="${this.update}">
        ${this.numPoints}
        <label>
          <input name="async" type="checkbox" onchange="${this.update}">
          Async
        </label>
      </div>
      <div class="about">
        Demo by <a href="https://twitter.com/WebReflection" target="_blank">Andrea Giammarchi</a>,
        based on the Preact demo by <a href="https://github.com/developit" target="_blank">Jason Miller</a>,
        based on the Glimmer demo by <a href="http://mlange.io" target="_blank">Michael Lange</a>.
      </div>
    </div>`;
  }
}

const Layout = {
  PHYLLOTAXIS: 0,
  GRID: 1,
  WAVE: 2,
  SPIRAL: 3
};

const LAYOUT_ORDER = [
  Layout.PHYLLOTAXIS,
  Layout.SPIRAL,
  Layout.PHYLLOTAXIS,
  Layout.GRID,
  Layout.WAVE
];

class VizDemo {

  constructor(count, async) {

    this.layout = 0;
    this.step = 0;
    this.numSteps = 60 * 2;

    this.points = [];

    this.update(count, async);

    (this.next = this.next.bind(this))();
  }

  next() {

		requestAnimationFrame(this.next);

    this.step = (this.step + 1) % this.numSteps;

    if (this.step === 0) {
      this.layout = (this.layout + 1) % LAYOUT_ORDER.length;
    }

    // Clamp the linear interpolation at 80% for a pause at each finished layout state
    const pct = Math.min(1, this.step / (this.numSteps * 0.8));

    const currentLayout = LAYOUT_ORDER[this.layout];
    const nextLayout = LAYOUT_ORDER[(this.layout + 1) % LAYOUT_ORDER.length];

    // Keep these redundant computations out of the loop
    const pxProp = xForLayout(currentLayout);
    const nxProp = xForLayout(nextLayout);
    const pyProp = yForLayout(currentLayout);
    const nyProp = yForLayout(nextLayout);

    this.points.forEach(point => {
      point.x = lerp(point, pct, pxProp, nxProp);
      point.y = lerp(point, pct, pyProp, nyProp);
    });

		if (this.async) {
			if (!this.ric) this.ric = requestIdleCallback(
				() => { this.ric = 0; this.render(); },
				{timeout: 50}
			);
		} else {
    	this.render();
		}
  }

  makePoints() {
    const newPoints = [];
    for (var i = 0; i < this.count; i++) {
      newPoints.push({
        x: 0,
        y: 0,
        color: d3.interpolateViridis(i / this.count),
      });
    }
    this.points = newPoints;
    this.setAnchors();
  }

  setAnchors() {
    this.points.forEach((p, index) => {
      const [ gx, gy ] = project(this.grid(index));
      const [ wx, wy ] = project(this.wave(index));
      const [ sx, sy ] = project(this.spiral(index));
      const [ px, py ] = project(this.phyllotaxis(index));
      Object.assign(p, { gx, gy, wx, wy, sx, sy, px, py });
    });
  }

  update(count, async) {
    this.count = count;
    this.async = async;

    this.phyllotaxis = genPhyllotaxis(count);
    this.grid = genGrid(count);
    this.wave = genWave(count);
    this.spiral = genSpiral(count);

    this.makePoints();
  }

  render() {
    return hyperHTML.wire(this)`
    <svg class="demo">
      <g>${
        this.points.map(renderPoint)
      }</g>
    </svg>`;
  } 
}

// utilities

function renderPoint(point) {
  return hyperHTML.wire(point, 'svg')`
  <rect
    class="point"
    fill="${point.color}"
    transform="${`translate(${point.x}, ${point.y})`}"
  />`;
}

const theta = Math.PI * (3 - Math.sqrt(5));

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
  let px = obj[startProp];
  return px + (obj[endProp] - px) * percent;
}

function genPhyllotaxis(n) {
  return i => {
    let r = Math.sqrt(i / n);
    let th = i * theta;
    return [r * Math.cos(th), r * Math.sin(th)];
  };
}

function genGrid(n) {
  let rowLength = Math.round(Math.sqrt(n));
  return i => [
    -0.8 + 1.6 / rowLength * (i % rowLength),
    -0.8 + 1.6 / rowLength * Math.floor(i / rowLength),
  ];
}

function genWave(n) {
  let xScale = 2 / (n - 1);
  return i => {
    let x = -1 + i * xScale;
    return [x, Math.sin(x * Math.PI * 3) * 0.3];
  };
}

function genSpiral(n) {
  return i => {
    let t = Math.sqrt(i / (n - 1)),
      phi = t * Math.PI * 10;
    return [t * Math.cos(phi), t * Math.sin(phi)];
  };
}

function scale(magnitude, vector) {
  return vector.map(p => p * magnitude);
}

function translate(translation, vector) {
  return vector.map((p, i) => p + translation[i]);
}

function project(vector) {
  const wh = window.innerHeight / 2;
  const ww = window.innerWidth / 2;
  return translate([ ww, wh ], scale(Math.min(wh, ww), vector));
}

document.body.appendChild(new Demo(1000).render());
