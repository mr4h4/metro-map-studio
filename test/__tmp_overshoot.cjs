const path = require('path');
const { execSync } = require('child_process');

execSync('npx esbuild src/engine/adapter.ts --bundle --platform=node --format=cjs --outfile=test/__tmp_adapter.cjs --log-level=error', { cwd: path.join(__dirname, '..') });
global.window = { jumpnum: 2.4, drawmap() {} };
const A = require('./__tmp_adapter.cjs');
const W = global.window;
let fail = 0;
const check = (name, cond, extra = '') => {
  console.log((cond ? 'PASS' : 'FAIL') + ' ' + name + (extra ? ' :: ' + extra : ''));
  if (!cond) fail++;
};
function bakedPoints() {
  A.bakeRiverStrands();
  const pts = [];
  for (let i = 1; i <= W.riverstrands; i++) {
    const c = W[`riverstrand${i}pts`];
    for (let j = 1; j <= c; j++) pts.push([W[`riverstrand${i}pt${j}x`], W[`riverstrand${i}pt${j}y`]]);
  }
  return pts;
}
const near = (pts, x, y, tol) => pts.some(p => Math.hypot(p[0] - x, p[1] - y) <= tol);

// ---- case A: horizontal main + diagonal branch arriving from NW ----
W.riverver = 0; W.rivertopleft = 0; W.rivertopright = 0;
W.riverhor = 2;
W.riverhor1y = 100; W.riverhor1x1 = -100; W.riverhor1x2 = 0;
W.riverhor2y = 100; W.riverhor2x1 = 0; W.riverhor2x2 = 200;
// branch (-60,40)->(0,100): tl x=-60 y=40 width=60
W.rivertopleft = 1; W.rivertopleft1x = -60; W.rivertopleft1y = 40; W.rivertopleft1width = 60;
W.riverwidth = 24; W.rivercurve = 9; W.parks = 0;
let pts = bakedPoints();
check('A: junction exact (0,100)', near(pts, 0, 100, 0.6), '');
const zoneA = pts.filter(p => p[0] > -3 && p[0] < 32);
const minYA = Math.min(...zoneA.map(p => p[1]));
const maxYA = Math.max(...zoneA.map(p => p[1]));
check('A: no overshoot north of ribbon (y>=86)', minYA >= 86, `minY=${minYA}`);
check('A: no overshoot south (y<=114)', maxYA <= 114, `maxY=${maxYA}`);

// ---- case B: vertical main + diagonal branch arriving from SE ----
W.riverhor = 0; W.rivertopleft = 0;
W.riverver = 2;
W.riverver1x = 0; W.riverver1y1 = 0; W.riverver1y2 = 100;
W.riverver2x = 0; W.riverver2y1 = 100; W.riverver2y2 = 200;
// branch (60,160)->(0,100): tr x=60 y=160 width=60
W.rivertopright = 1; W.rivertopright1x = 60; W.rivertopright1y = 160; W.rivertopright1width = 60;
pts = bakedPoints();
check('B: junction exact (0,100)', near(pts, 0, 100, 0.6), '');
const zoneB = pts.filter(p => p[1] > 69 && p[1] < 103);
const minXB = Math.min(...zoneB.map(p => p[0]));
const maxXB = Math.max(...zoneB.map(p => p[0]));
check('B: no bulge west of ribbon (x>=-14)', minXB >= -14, `minX=${minXB}`);
check('B: no bulge east (x<=14)', maxXB <= 14, `maxX=${maxXB}`);

// ---- sharp 90° V through an exact shared vertex (worst case for overshoot) ----
W.riverver = 2;
W.riverver1x = 0; W.riverver1y1 = 0; W.riverver1y2 = 100;
W.riverver2x = 0; W.riverver2y1 = 100; W.riverver2y2 = 200;
W.riverhor = 1; W.riverhor1y = 100; W.riverhor1x1 = 0; W.riverhor1x2 = 90;
W.rivertopleft = 0; W.rivertopright = 0;
pts = bakedPoints();
const inCorridor = pts.every(p =>
  (Math.abs(p[0]) <= 14 && p[1] >= -14 && p[1] <= 214) || // vertical ribbon
  (Math.abs(p[1] - 100) <= 14 && p[0] >= -14 && p[0] <= 104), // horizontal ribbon
);
check('sharp V stays inside ribbon corridors (no loops/spikes)', inCorridor, '');
process.exit(fail ? 1 : 0);
