const path = require('path');
const { execSync } = require('child_process');

execSync('npx esbuild src/engine/adapter.ts --bundle --platform=node --format=cjs --outfile=test/__tmp_adapter.cjs --log-level=error', { cwd: path.join(__dirname, '..') });
global.window = { jumpnum: 2.4, drawmap() {} };
const A = require('./__tmp_adapter.cjs');
const W = global.window;

// main horizontal river, single segment
W.riverver = 0; W.rivertopleft = 0; W.rivertopright = 0;
W.riverhor = 1; W.riverhor1y = 100; W.riverhor1x1 = -200; W.riverhor1x2 = 200;
W.riverwidth = 24; W.rivercurve = 9; W.parks = 0;

// user drags from SW (-60,160) up to the main at (0,100)
const start = A.riverSnapNetwork(-60, 160);
console.log('start snap:', JSON.stringify(start));
const d = A.riverDragUpdate(start.x, start.y, 0, 100);
console.log('drag:', JSON.stringify(d));
console.log('committed:', A.commitRiverSeg(start.x, start.y, d));
console.log('split start:', A.splitRiverAtPoint(start.x, start.y));
console.log('split end:', A.splitRiverAtPoint(d.eendx, d.eendy));
console.log('segs:', JSON.stringify(A.listRiverSegs()));
A.bakeRiverStrands();
const pts = [];
for (let i = 1; i <= W.riverstrands; i++) {
  const c = W[`riverstrand${i}pts`];
  for (let j = 1; j <= c; j++) pts.push([W[`riverstrand${i}pt${j}x`], W[`riverstrand${i}pt${j}y`]]);
}
// stub zone: north of main (y<88), near junction x in [-30, 60]
const stubs = pts.filter(p => p[1] < 88 && p[0] > -30 && p[0] < 60);
console.log('points in stub zone (should be none):', JSON.stringify(stubs.slice(0, 20)), 'count=', stubs.length);
// branch zone sample: points with x in [-70,-10], y in [90,170]
const branch = pts.filter(p => p[0] > -70 && p[0] < -10 && p[1] > 90 && p[1] < 170);
console.log('branch sample:', JSON.stringify(branch.slice(0, 10)));
