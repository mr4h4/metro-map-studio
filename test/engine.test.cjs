/* Integration test: boots the REAL legacy kernel under jsdom with the same
 * hidden DOM that LegacyBridge renders, then drives it through src/engine/adapter.
 * Canvas 2D is stubbed (recording proxy) — we verify state, not pixels. */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = 'C:/Users/a.herederoantonio/Desktop/metro-map-studio';

const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
  url: 'http://localhost:8000/',
  pretendToBeVisual: true,
  runScripts: 'dangerously',
});

for (const k of ['window', 'document', 'navigator', 'localStorage', 'HTMLElement',
  'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLCanvasElement', 'HTMLFormElement',
  'RadioNodeList', 'URL', 'Blob', 'FileReader', 'Event', 'MouseEvent', 'KeyboardEvent']) {
  global[k] = dom.window[k];
}
global.window = dom.window;
// indirect eval in the adapter must land in the page realm (as in browsers),
// not in the Node realm: point the global eval at the jsdom intrinsic.
global.eval = dom.window.eval;

// 2d-context recording stub: absorbs every call, returns sane values
const ctxStub = new Proxy(
  {},
  {
    get(t, p) {
      if (p === 'canvas') return {};
      if (p === 'measureText') return () => ({ width: 10 });
      if (p === 'getImageData') return () => ({ data: [] });
      if (typeof p === 'string') return () => undefined;
      return undefined;
    },
    set() {
      return true;
    },
  },
);
dom.window.HTMLCanvasElement.prototype.getContext = function () {
  return ctxStub;
};
dom.window.HTMLCanvasElement.prototype.getBoundingClientRect = function () {
  return { left: 0, top: 0, right: this.width, bottom: this.height, width: this.width, height: this.height };
};

// hidden DOM mirroring LegacyBridge.tsx
function radio(name, value, checked) {
  return `<input type="radio" name="${name}" value="${value}"${checked ? ' checked' : ''}>`;
}
let qk = '';
for (let v = 1; v <= 8; v++) qk += radio('qk', v, v === 1);
let qkk = '';
for (let v = 1; v <= 6; v++) qkk += radio('qkk', v, v === 1);
document.body.innerHTML = `
<div aria-hidden="true" style="display:none">
  <div id="moocowwowyay"></div>
  <form id="myform" name="myform">
    <select name="List1" id="aaqq" size="6">
      <option id="option1" selected>ROUTE 1</option>
      <option id="option2">ROUTE 2</option>
    </select>
    <input id="nambox" name="nambox">
    <input id="colbox" name="colbox" class="color {pickerPosition:'right'}">
    <input id="widbox" name="widbox">
    <input id="blar1" type="radio" name="modeqq" value="draw" checked>
    <input id="blar2" type="radio" name="modeqq" value="draw" checked>
    <input id="blar3" type="radio" name="modeqq" value="draw" checked>
    <input id="blar4" type="radio" name="modeqq" value="draw" checked>
  </form>
  <form name="frm3">${qk}${qkk}</form>
  <form name="frm2"><textarea id="ttxt2" name="txt2" readonly></textarea></form>
  <div id="saver"></div>
</div>
<canvas id="canvas" width="1100" height="920"></canvas>`;

// jsdom lacks the form named-property getter browsers provide
// (form.widbox, frm3.qkk as a list). Emulate it so the harness matches browsers.
for (const form of document.forms) {
  const byName = new Map();
  for (const ctrl of form.elements) {
    const key = ctrl.getAttribute('name');
    if (!key) continue;
    if (!byName.has(key)) byName.set(key, []);
    byName.get(key).push(ctrl);
  }
  for (const [key, list] of byName) {
    if (key in form) continue;
    Object.defineProperty(form, key, {
      value: list.length > 1 ? list : list[0],
      configurable: true,
    });
  }
}

// load the kernel exactly like a classic <script> tag would (window scope)
const kernel = fs.readFileSync(path.join(root, 'public/engine/legacy.js'), 'utf8');
const tag = document.createElement('script');
tag.textContent = kernel;
document.head.appendChild(tag);

const A = require('./adapter.cjs');
const S = require('./store.cjs');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let pass = 0;
function ok(cond, label) {
  if (!cond) {
    console.error('FAIL:', label);
    process.exitCode = 1;
  } else {
    pass++;
    console.log('ok:', label);
  }
}

(async () => {
  // static drift guard: every id/field the kernel needs must exist in React sources
  const bridgeSrc = fs.readFileSync(path.join(root, 'src/engine/LegacyBridge.tsx'), 'utf8');
  const stageSrc = fs.readFileSync(path.join(root, 'src/components/CanvasStage.tsx'), 'utf8');
  for (const id of ['moocowwowyay', 'myform', 'aaqq', 'option1', 'option2', 'nambox', 'colbox',
    'widbox', 'blar1', 'blar2', 'blar3', 'blar4', 'frm3', 'frm2', 'ttxt2', 'saver',
    'name="qk"', 'name="qkk"', 'name="txt2"']) {
    ok(bridgeSrc.includes(id), `LegacyBridge renders ${id}`);
  }
  ok(stageSrc.includes('id="canvas"'), 'CanvasStage renders id="canvas"');

  A.initAdapter();
  A.bootEngine();
  await sleep(400);
  ok(A.engineReady(), 'engine boots and becomes ready');
  ok(document.getElementById('moocowwowyay').style.display === 'block', 'kernel shows legacy panel node');

  const routes = A.listRoutes();
  ok(routes.length === 2, `kernel boots with 2 routes (got ${routes.length})`);
  ok(routes[0].label === 'ROUTE 1', 'route labels readable');

  const codeA = A.captureCode();
  ok(codeA.includes('setroutes(2)'), 'capture produces legacy code');
  ok(document.getElementById('saver').style.display === 'none', 'capture hides saver again');

  A.createRoute();
  ok(A.numLines() === 3, 'createRoute adds a route');
  A.restoreCode(codeA);
  ok(A.numLines() === 2, 'snapshot round-trip restores route count');

  A.selectRoute(2);
  ok(A.currentRoute() === 2, 'selectRoute switches current route (routechange ran w/ colbox shim)');

  A.setTool(3);
  ok(dom.window.mousemoded === 3, 'setTool mirrors legacy mouse-mode globals');
  A.setStationOptions(5, 3);
  const frm3 = document.forms.namedItem('frm3');
  const qkChecked = [...frm3.elements.namedItem('qk')].find((r) => r.checked);
  const qkkChecked = [...frm3.elements.namedItem('qkk')].find((r) => r.checked);
  ok(qkChecked && qkChecked.value === '5' && qkkChecked && qkkChecked.value === '3', 'station options mirror to hidden radios');

  A.newBlankProject();
  ok(A.numLines() === 1, 'newBlankProject gives one empty route');

  A.setCanvasSize(2000, 1500);
  ok(document.getElementById('canvas').width === 2000, 'canvas resizes (redraws without throwing)');
  const fit = A.fitCanvasToContent();
  ok(fit.w >= 2000 && fit.h >= 1500, `fit grows to content (${fit.w}x${fit.h})`);

  // bounds clamp: gestures never leave the sheet, so everything drawn is exported
  A.newBlankProject();
  A.setTool(1);
  gesture(document.getElementById('canvas'), -50, 300, 500, 300);
  ok(dom.window.eval('line1hor1x1') === 0, 'negative coords clamped to the sheet');
  ok(dom.window.eval('line1hor1y') === 300, 'clamped gesture still draws');
  const bnds = A.contentBounds();
  ok(!bnds.empty && bnds.maxX >= 500 && bnds.minX <= 0, 'content bounds cover the clamped track');
  // css-box zoom: kernel maps pointer coords back by the factor
  A.setZoomK(2);
  A.newBlankProject();
  A.setTool(1);
  gesture(document.getElementById('canvas'), 600, 600, 1000, 600); // map (300,300)-(500,300) at 2x
  ok(dom.window.eval('line1hor') === 1, 'drawing works under box zoom');
  ok(dom.window.eval('line1hor1y') === 300, 'zoomed gesture lands on map coords');
  A.setZoomK(1);

  // real draw gesture through the kernel's own listeners (draw tool, horizontal)
  function gesture(canvas, x1, y1, x2, y2) {
    const opts = (x, y) => ({ bubbles: true, clientX: x, clientY: y });
    canvas.dispatchEvent(new dom.window.MouseEvent('mousedown', opts(x1, y1)));
    canvas.dispatchEvent(new dom.window.MouseEvent('mousemove', opts(x2, y2)));
    canvas.dispatchEvent(new dom.window.MouseEvent('mouseup', opts(x2, y2)));
  }
  A.newBlankProject();
  A.setTool(1);
  const horBefore = dom.window.eval('line1hor');
  gesture(document.getElementById('canvas'), 300, 300, 500, 300);
  ok(dom.window.eval('line1hor') === horBefore + 1, 'draw gesture commits a track segment');

  // StrictMode-style remount: node swapped, kernel must be re-pointed
  const dead = document.getElementById('canvas');
  const fresh = document.createElement('canvas');
  fresh.id = 'canvas';
  fresh.width = 1100;
  fresh.height = 920;
  dead.replaceWith(fresh);
  const horMid = dom.window.eval('line1hor');
  gesture(fresh, 300, 400, 500, 400);
  ok(dom.window.eval('line1hor') === horMid, 'stale binding draws nothing on the new node');
  A.ensureLiveCanvas();
  gesture(fresh, 300, 400, 500, 400);
  ok(dom.window.eval('line1hor') === horMid + 1, 'ensureLiveCanvas rebinds and drawing works again');

  // station placement stores the SELECTED type (panel-sync regression test)
  dom.window.prompt = () => 'Central';
  A.newBlankProject();
  A.setTool(1);
  gesture(document.getElementById('canvas'), 200, 200, 400, 200);
  A.setTool(3);
  A.setStationOptions(2, 3);
  const cvs = document.getElementById('canvas');
  const downAt = (x, y) => cvs.dispatchEvent(new dom.window.MouseEvent('mousedown', { bubbles: true, clientX: x, clientY: y }));
  const upAt = (x, y) => cvs.dispatchEvent(new dom.window.MouseEvent('mouseup', { bubbles: true, clientX: x, clientY: y }));
  const stBefore = dom.window.eval('line1stations');
  // NOTE: snap only counts when it moves the point: click slightly OFF the
  // track (within snap range) so the jumper adjusts the coordinate.
  downAt(303, 204);
  upAt(303, 204);
  ok(dom.window.eval('line1stations') === stBefore + 1, 'station placed on the track');
  ok(dom.window.eval('line1station1type') === 3, 'placed station keeps selected type (interchange)');
  ok(dom.window.eval('line1station1dir') === 2, 'placed station keeps selected direction');

  // pill (type 6): place, width, save round-trip, hit-test (eastward stretch)
  A.setStationOptions(5, 6);
  downAt(353, 204);
  upAt(353, 204);
  const pillIdx = dom.window.eval('line1stations');
  ok(dom.window.eval(`line1station${pillIdx}type`) === 6, 'pill station placed');
  ok(dom.window.eval(`line1station${pillIdx}dir`) === 5, 'pill keeps its direction');
  ok(JSON.stringify(A.pillDirVector(5)) === JSON.stringify([1, 0]), 'dir 5 points east');
  ok(JSON.stringify(A.pillDirVector(2)) === JSON.stringify([0, -1]), 'dir 2 points north');
  A.setStationW(1, pillIdx, 80);
  const codePill = A.captureCode();
  ok(codePill.includes(`line1station${pillIdx}w = 80`), 'pill width persisted in code');
  ok(!!A.findPillAt(353, 200), 'pill hit-test finds it');
  ok(A.findPillAt(393, 200) !== null, 'pill hit-test covers stretched half-width');
  ok(A.findPillAt(50, 50) === null, 'pill hit-test misses far points');
  A.newBlankProject();
  A.restoreCode(codePill);
  ok(A.getStation(1, pillIdx).w === 80, 'pill width survives save round-trip');

  // free texts: placed anywhere (no snap), quote round-trip, move, remove
  A.setTool(5);
  ok(A.textCount(1) === 0, 'no texts yet');
  downAt(500, 500);
  upAt(500, 500);
  ok(A.textCount(1) === 1, 'free text placed without snap');
  const t1 = A.getText(1, 1);
  ok(t1 && t1.text === 'Central' && t1.x === 500 && t1.y === 500, 'text content and position stored');
  dom.window.prompt = () => 'Say "hi"';
  downAt(600, 600);
  upAt(600, 600);
  const codeTx = A.captureCode();
  ok(codeTx.includes('line1text2text = "Say \\"hi\\""'), 'quotes escaped in code');
  A.newBlankProject();
  A.restoreCode(codeTx);
  ok(A.getText(1, 2) && A.getText(1, 2).text === 'Say "hi"', 'quoted text survives round-trip');
  ok(!!A.findTextAt(600, 600), 'text hit-test finds it');
  A.setTextPos(1, 2, 640, 620);
  ok(A.getText(1, 2).x === 640 && A.getText(1, 2).y === 620, 'text moved');
  ok(A.findTextAt(100, 100) === null, 'text hit-test misses far points');
  A.setTool(4);
  downAt(502, 502);
  upAt(502, 502);
  ok(A.getText(1, 1).text === '', 'remove tool clears nearby text');

  // studio style settings round-trip
  A.setTextColor('#e11d48');
  A.setTextFont('Georgia');
  A.setCanvasColor('#101014');
  const codeSt = A.captureCode();
  ok(codeSt.includes('mmsTextCol = "#e11d48"'), 'text color persisted in code');
  ok(codeSt.includes('mmsTextFont = "Georgia"'), 'text font persisted in code');
  ok(codeSt.includes('mmsCanvasCol = "#101014"'), 'canvas color persisted in code');
  A.newBlankProject();
  A.restoreCode(codeSt);
  ok(A.getTextColor() === '#e11d48', 'text color restored');
  ok(A.getTextFont() === 'Georgia', 'text font restored');
  ok(A.getCanvasColor() === '#101014', 'canvas color restored');

  // vector trace of the same live session
  const V = require('./vector.cjs');
  const liveCanvasBefore = dom.window.canvas;
  const art = V.renderVector();
  ok(typeof art.svg === 'string' && art.svg.startsWith('<svg'), 'vector render produces an SVG document');
  ok(art.svg.includes(`width="${art.w}"`) && art.svg.includes(`height="${art.h}"`), 'svg dims match the canvas');
  ok(art.svg.includes('<path'), 'svg contains the drawn track paths');
  ok(art.svg.includes('#FFFFFF'), 'svg contains white station interiors');
  ok(art.svg.includes('Say &quot;hi&quot;'), 'svg contains the free text label');
  const artSt = V.renderVector();
  ok(artSt.svg.includes('fill="#101014"'), 'svg background follows canvas color');
  ok(artSt.svg.includes('font-family="Georgia"'), 'svg labels follow the font');
  ok(artSt.svg.includes('font-size="10.67"'), 'pt font size converted to px in svg');
  A.setTextColor('#000000');
  A.setTextFont('Arial');
  A.setCanvasColor('#ffffff');
  ok(!art.svg.includes('undefined'), 'svg has no undefined leaks');
  ok(art.svg.endsWith('</svg>'), 'svg closes properly');
  ok(dom.window.canvas === liveCanvasBefore, 'kernel canvas global restored after trace');

  // store (same keys as shipped app)
  const p = S.createProject('  Test  ', codeA);
  ok(p.name === 'Test' && S.routeCount(p.code) === 2, 'store create + routeCount');
  ok(S.parseImport('setroutes(1);x=1').code.includes('setroutes(1)'), 'raw code import');
  ok(S.parseImport(JSON.stringify({ name: 'J', code: 'setroutes(3)' })).name === 'J', 'json envelope import');
  ok(
    S.parseImport(
      JSON.stringify({ app: 'metro-map-studio', version: 2, name: 'K', code: 'setroutes(1)', canvas: { w: 99, h: 99 } }),
    ).code === 'setroutes(1)',
    'editor json backup re-imports',
  );
  ok(S.parseImport('nope') === null, 'invalid import rejected');
  ok(S.pngFilename('My Red Line!') === 'my-red-line.png', 'png filename slug');
  ok(S.pngFilename('   ') === 'plan.png', 'png filename fallback');

  console.log(`\nintegration: ${pass} assertions passed`);
})().catch((e) => {
  console.error('FATAL:', e);
  process.exitCode = 1;
});
