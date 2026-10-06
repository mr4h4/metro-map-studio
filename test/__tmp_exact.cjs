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

// main horizontal river, single segment
W.riverver = 0; W.rivertopleft = 0; W.rivertopright = 0;
W.riverhor = 1; W.riverhor1y = 100; W.riverhor1x1 = -200; W.riverhor1x2 = 200;
W.riverwidth = 24; W.rivercurve = 9; W.parks = 0;

// exact aim: press EXACTLY on the river, release EXACTLY on it (diagonal)
const s0 = { x: -40, y: 100 };
const snap = A.riverSnapNetwork(s0.x, s0.y);
const st = A.riverStartFuse(snap.x, snap.y, s0.x, s0.y, 0);
check('exact press shows fused anchor', st.fused === true, JSON.stringify(st));
const d = A.riverDragUpdate(st.x, st.y, -0, 60);
const st2 = A.riverStartFuse(st.x, st.y, s0.x, s0.y, d.angle);
check('45° start stays fused', st2.fused === true, JSON.stringify({ a: d.angle, st2 }));
// release exactly onto the river at (60,100)? branch from (-40,100) NE to (20,40): end free.
// instead: branch arriving exactly at main: start free (-60,40), end exactly (0,100)
const d2 = A.riverDragUpdate(-60, 40, 0, 100);
check('exact release fuses end', d2 && d2.endSnapped === true, JSON.stringify(d2));
check('commit + split fuse the junction', (() => {
  if (!d2 || !A.commitRiverSeg(-60, 40, d2)) return false;
  return A.splitRiverAtPoint(0, 100) === true && W.riverhor === 2;
})(), `hor=${W.riverhor}`);
const pts = [];
A.bakeRiverStrands();
for (let i = 1; i <= W.riverstrands; i++) {
  const c = W[`riverstrand${i}pts`];
  for (let j = 1; j <= c; j++) pts.push([W[`riverstrand${i}pt${j}x`], W[`riverstrand${i}pt${j}y`]]);
}
check('junction shared in bake', pts.some(p => Math.hypot(p[0], p[1] - 100) <= 0.6), '');
const stubs = pts.filter(p => {
  const dSeg = (ax, ay, bx, by) => {
    const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
    const t = l2 > 0 ? Math.max(0, Math.min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / l2)) : 0;
    return Math.hypot(p[0] - (ax + t * dx), p[1] - (ay + t * dy));
  };
  // branch (-60,40)-(0,100), main halves, flare run-up (0,100)-(28.8,100)
  const d = Math.min(dSeg(-60, 40, 0, 100), dSeg(-200, 100, 0, 100), dSeg(0, 100, 200, 100));
  return d > 13;
});
check('no stubs outside ribbon envelope (13px)', stubs.length === 0, JSON.stringify(stubs.slice(0, 8)));

// 90° exact press must NOT fuse
const t90 = A.riverDragUpdate(-40, 100, -40, 40);
const f90 = A.riverStartFuse(-40, 100, -40, 100, t90.angle);
check('90° exact press stays free', f90.fused === false, JSON.stringify({ a: t90.angle, f90 }));
process.exit(fail ? 1 : 0);
