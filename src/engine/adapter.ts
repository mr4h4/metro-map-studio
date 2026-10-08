/* Typed adapter over the legacy drawing kernel (public/engine/legacy.js).
 * The kernel itself is verbatim; this module only drives it through its
 * existing public surface (functions + globals + a few hidden form fields).
 */

type Legacy = Record<string, unknown>;

function W(): Legacy {
  return window as unknown as Legacy;
}

/** indirect eval => same global semantics as the legacy Load dialog */
export function geval(code: string): void {
  (0, eval)(code);
}

export type LineStyle = 'solid' | 'dashed';

export interface RouteInfo {
  index: number;
  label: string;
  color: string;
  width: number;
  style: LineStyle;
  borderColor: string;
  borderWidth: number;
}

export const LINE_STYLES: { value: LineStyle; label: string; desc: string }[] = [
  { value: 'solid', label: 'Solid', desc: 'New strokes draw solid' },
  { value: 'dashed', label: 'Under construction', desc: 'New strokes draw dashed' },
];

export const LINE_BORDER_DEFAULT_COLOR = '#ffffff';
export const LINE_BORDER_MAX_W = 10;

function lineStyleOf(v: unknown): LineStyle {
  return v === 'dashed' ? 'dashed' : 'solid';
}

export type ToolMode = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10; // draw | erase | stations | remove | text | pan | river | park | zone | sea

/* ---------- boot ---------- */

let booted = false;

export function bootEngine(): void {
  if (booted) return;
  booted = true;
  (W().moo as () => void)();
}

export function engineReady(): boolean {
  const w = W();
  if (typeof w.drawmap !== 'function' || w.mousemoded !== 1) return false;
  // drawmap eval()s line globals; they only exist after moo()/qwwe() (or a
  // restore) ran. The tool mirror writes mousemoded=1 on mount, so the mode
  // alone can't prove readiness — a redraw before this would throw.
  try {
    return typeof w.numlines === 'number' && w.numlines >= 1 && typeof w.line1ver !== 'undefined';
  } catch {
    return false;
  }
}

/** True once the kernel script has loaded (regardless of its idle mouse mode). */
export function engineBooted(): boolean {
  return typeof W().drawmap === 'function';
}

export function whenReady(cb: () => void, timeoutMs = 8000): void {
  const t0 = Date.now();
  const tick = () => {
    if (engineReady()) {
      cb();
      return;
    }
    if (Date.now() - t0 > timeoutMs) {
      cb();
      return;
    }
    setTimeout(tick, 50);
  };
  tick();
}

/* ---------- change notification (additive wrappers, kernel logic untouched) ---------- */

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeRoutes(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function notifyRoutes(): void {
  for (const fn of [...listeners]) {
    try {
      fn();
    } catch {
      /* a failing subscriber must not break the engine */
    }
  }
}

function wrapEngine(): void {
  const w = W();
  if (w.__mmsWrapped) return;
  w.__mmsWrapped = true;
  for (const name of ['routechange', 'addrouteyay', 'setroutes', 'thedel'] as const) {
    const orig = w[name] as (...a: never[]) => unknown;
    if (typeof orig !== 'function') continue;
    w[name] = (...args: never[]) => {
      const r = orig(...args);
      notifyRoutes();
      return r;
    };
  }
}

/* ---------- canvas ---------- */

export function canvasEl(): HTMLCanvasElement | null {
  return document.getElementById('canvas') as HTMLCanvasElement | null;
}

let boundCanvas: HTMLCanvasElement | null = null;

/**
 * The kernel captures `canvas`/`ctx` and attaches its mouse listeners once at
 * boot. If React ever swaps the <canvas> node (remount, HMR), re-point the
 * kernel at the live node. Idempotent per node; old listeners are removed first
 * so gestures can never be handled twice.
 */
export function ensureLiveCanvas(): void {
  const w = W();
  const live = canvasEl();
  if (!live) return;
  if (w.canvas === live && boundCanvas === live) return;
  const old = w.canvas as {
    removeEventListener?: (t: string, fn: EventListener) => void;
  } | null;
  const handlers = {
    mousemove: w.ev_mousemove as unknown as EventListener,
    mousedown: w.ev_mousedown as unknown as EventListener,
    mouseup: w.ev_mouseup as unknown as EventListener,
  };
  if (old && typeof old.removeEventListener === 'function') {
    for (const [type, fn] of Object.entries(handlers)) {
      if (typeof fn === 'function') {
        try {
          old.removeEventListener(type, fn);
        } catch {
          /* best effort */
        }
      }
    }
  }
  w.canvas = live;
  w.ctx = live.getContext('2d');
  applyDprTransform();
  for (const [type, fn] of Object.entries(handlers)) {
    if (typeof fn === 'function') live.addEventListener(type, fn);
  }
  live.oncontextmenu = () => false;
  boundCanvas = live;
}

export function redraw(): void {
  (W().drawmap as (n: number) => void)(1);
}

export function setCanvasSize(w: number, h: number): void {
  const c = canvasEl();
  if (!c) return;
  const cw = Math.min(4000, Math.max(200, Math.round(w)));
  const ch = Math.min(4000, Math.max(200, Math.round(h)));
  c.width = Math.round(cw * dprK);
  c.height = Math.round(ch * dprK);
  applyDprTransform();
  redraw();
}

export interface ContentBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  empty: boolean;
}

/** Map-space bounding box of all content (tracks, stations, texts). */
export function contentBounds(pad = 0): ContentBounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  try {
    const w = W();
    const n = Number(w.numlines) || 0;
    const consider = (x: unknown, y: unknown) => {
      if (typeof x === 'number' && typeof y === 'number' && Number.isFinite(x) && Number.isFinite(y)) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    };
    for (let i = 1; i <= n; i++) {
      const ver = Number(w[`line${i}ver`]) || 0;
      for (let j = 1; j <= ver; j++) {
        consider(w[`line${i}ver${j}x`], w[`line${i}ver${j}y1`]);
        consider(w[`line${i}ver${j}x`], w[`line${i}ver${j}y2`]);
      }
      const hor = Number(w[`line${i}hor`]) || 0;
      for (let j = 1; j <= hor; j++) {
        consider(w[`line${i}hor${j}x1`], w[`line${i}hor${j}y`]);
        consider(w[`line${i}hor${j}x2`], w[`line${i}hor${j}y`]);
      }
      const tl = Number(w[`line${i}topleft`]) || 0;
      for (let j = 1; j <= tl; j++) {
        const x = Number(w[`line${i}topleft${j}x`]);
        const y = Number(w[`line${i}topleft${j}y`]);
        const wd = Number(w[`line${i}topleft${j}width`]);
        consider(x, y);
        consider(x + wd, y + wd);
      }
      const tr = Number(w[`line${i}topright`]) || 0;
      for (let j = 1; j <= tr; j++) {
        const x = Number(w[`line${i}topright${j}x`]);
        const y = Number(w[`line${i}topright${j}y`]);
        const wd = Number(w[`line${i}topright${j}width`]);
        consider(x, y);
        consider(x - wd, y + wd);
      }
      const st = Number(w[`line${i}stations`]) || 0;
      for (let j = 1; j <= st; j++) {
        consider(w[`line${i}station${j}x`], w[`line${i}station${j}y`]);
      }
      const tx = finite(w[`line${i}texts`]) ?? 0;
      for (let j = 1; j <= tx; j++) {
        consider(w[`line${i}text${j}x`], w[`line${i}text${j}y`]);
      }
    }
    try {
      for (const s of listRiverSegs()) {
        consider(s.ax, s.ay);
        consider(s.bx, s.by);
      }
      for (const s of listZoneSegs()) {
        consider(s.ax, s.ay);
        consider(s.bx, s.by);
      }
      const pn = Number(w.parks) || 0;
      for (let i = 1; i <= pn; i++) {
        const x = Number(w[`park${i}x`]);
        const y = Number(w[`park${i}y`]);
        const pw = Number(w[`park${i}w`]);
        const ph = Number(w[`park${i}h`]);
        consider(x, y);
        consider(x + pw, y + ph);
      }
      const sn = Number(w.seas) || 0;
      for (let i = 1; i <= sn; i++) {
        const x = Number(w[`sea${i}x`]);
        const y = Number(w[`sea${i}y`]);
        const sw = Number(w[`sea${i}w`]);
        const sh = Number(w[`sea${i}h`]);
        consider(x, y);
        consider(x + sw, y + sh);
      }
    } catch {
      /* nature probing must never break the session */
    }
  } catch {
    /* read-only probing must never break the session */
  }
  if (!(maxX > -Infinity)) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, empty: true };
  }
  return { minX: minX - pad, minY: minY - pad, maxX: maxX + pad, maxY: maxY + pad, empty: false };
}

/** Grow the canvas (never shrink, never move content) so all content fits. */
export function fitCanvasToContent(pad = 120): { w: number; h: number } {
  const c = canvasEl();
  const startW = Math.round((c?.width ?? 1100) / dprK);
  const startH = Math.round((c?.height ?? 920) / dprK);
  const b = contentBounds();
  const wNext = Math.max(startW, Math.ceil(b.maxX + pad));
  const hNext = Math.max(startH, Math.ceil(b.maxY + pad));
  setCanvasSize(wNext, hNext);
  return { w: wNext, h: hNext };
}

/* ---------- css-box zoom (browser-style) ---------- */

export const ZOOM_MIN_K = 0.1;
export const ZOOM_MAX_K = 4;
export const ZOOM_STEP = 1.25;

let zoomK = 1;

/** Display-only zoom of the canvas box. Backing store (and export) untouched. */
export function setZoomK(k: number): number {
  zoomK = Math.min(ZOOM_MAX_K, Math.max(ZOOM_MIN_K, k));
  W().mmsZoomK = zoomK; // kernel maps pointer coords back to the map
  return zoomK;
}

export function getZoomK(): number {
  return zoomK;
}

/* ---------- device pixels (crisp canvas on retina screens) ----------
 * The kernel always works in map units. The backing store is map*dprK with a
 * matching ctx transform, so lines and labels stay sharp at any CSS zoom.
 * All sizes in this module's API remain map units. */

let dprK = 1;

export function deviceDpr(): number {
  try {
    const d = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    return Math.min(2, Math.max(1, d));
  } catch {
    return 1;
  }
}

/** Backing-store scale. Mirrored to the kernel as mmsDprK (pointer clamps). */
export function setDprK(k: number): number {
  dprK = Math.min(2, Math.max(1, k || 1));
  try {
    W().mmsDprK = dprK;
  } catch {
    /* kernel not loaded yet — module value still applies on next use */
  }
  applyDprTransform();
  return dprK;
}

export function getDprK(): number {
  return dprK;
}

/** Re-apply the backing-store transform (canvas.width resets it). */
export function applyDprTransform(): void {
  try {
    const ctx = W().ctx as CanvasRenderingContext2D | null | undefined;
    if (ctx && typeof ctx.setTransform === 'function') ctx.setTransform(dprK, 0, 0, dprK, 0, 0);
  } catch {
    /* stub contexts in tests may not implement transforms */
  }
}

/* ---------- tools & routes ---------- */

export function setTool(mode: ToolMode): void {
  const w = W();
  w.mousemodem = 0;
  w.mousemodeu = 0;
  w.mousemoded = mode;
}

/** Raw mouse-mode write (e.g. 0 = idle) for interactions that bypass tools. */
export function setMouseMode(mode: number): void {
  W().mousemoded = mode;
}

export function getMouseMode(): number {
  return Number(W().mousemoded) || 0;
}

/* ---------- stations ---------- */

export interface StationInfo {
  route: number;
  index: number;
  x: number;
  y: number;
  type: number;
  dir: number;
  w?: number;
}

export const PILL_MIN_W = 6;
export const PILL_MAX_W = 600;
export const PILL_DEFAULT_W = 40;

function finite(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}

export function stationCount(route: number): number {
  return finite(W()[`line${route}stations`]) ?? 0;
}

export function getStation(route: number, index: number): StationInfo | null {
  const w = W();
  const x = finite(w[`line${route}station${index}x`]);
  const y = finite(w[`line${route}station${index}y`]);
  const type = finite(w[`line${route}station${index}type`]);
  if (x === undefined || y === undefined || type === undefined) return null;
  return {
    route,
    index,
    x,
    y,
    type,
    dir: finite(w[`line${route}station${index}dir`]) ?? 0,
    w: finite(w[`line${route}station${index}w`]),
  };
}

export function setStationW(route: number, index: number, width: number): void {
  W()[`line${route}station${index}w`] = width;
}

function pillRadius(route: number): number {
  const lw = finite(W()[`line${route}width`]) ?? 4;
  const stat3q = finite(W().stat3q) ?? 1.85;
  return lw * stat3q;
}

function pillLength(route: number, s: StationInfo): number {
  if (s.w !== undefined && s.w > 0) return s.w;
  return pillRadius(route) * 2 + 24;
}

/** Station direction (1-8) as a unit vector. Same compass as dashes/labels. */
export function pillDirVector(dir: number): [number, number] {
  switch (dir) {
    case 1:
      return [-0.7071, -0.7071];
    case 2:
      return [0, -1];
    case 3:
      return [0.7071, -0.7071];
    case 4:
      return [-1, 0];
    case 5:
      return [1, 0];
    case 6:
      return [-0.7071, 0.7071];
    case 7:
      return [0, 1];
    case 8:
      return [0.7071, 0.7071];
    default:
      return [1, 0];
  }
}

export interface PillSpan {
  route: number;
  index: number;
  /** anchored end (on the line point) */
  ax: number;
  ay: number;
  /** stretched tip toward the station direction */
  bx: number;
  by: number;
  r: number;
  w: number;
}

export function pillSpan(route: number, s: StationInfo): PillSpan | null {
  if (s.type !== 6) return null;
  const r = pillRadius(route);
  const w = pillLength(route, s);
  const [ux, uy] = pillDirVector(s.dir);
  return { route, index: s.index, ax: s.x, ay: s.y, bx: s.x + w * ux, by: s.y + w * uy, r, w };
}

function distToSpan(span: PillSpan, px: number, py: number): number {
  const dx = span.bx - span.ax;
  const dy = span.by - span.ay;
  const len2 = dx * dx + dy * dy;
  const t = len2 > 0 ? Math.max(0, Math.min(1, ((px - span.ax) * dx + (py - span.ay) * dy) / len2)) : 0;
  return Math.hypot(px - (span.ax + t * dx), py - (span.ay + t * dy));
}

/** Hit-test type-6 pills across all routes (segment distance, not a box). */
export function findPillAt(
  px: number,
  py: number,
  pad = 8,
): { route: number; index: number; w: number; ux: number; uy: number } | null {
  const n = numLines();
  for (let i = 1; i <= n; i++) {
    const count = stationCount(i);
    for (let j = 1; j <= count; j++) {
      const s = getStation(i, j);
      if (!s || s.type !== 6) continue;
      const span = pillSpan(i, s);
      if (!span) continue;
      if (distToSpan(span, px, py) <= span.r + pad) {
        const [ux, uy] = pillDirVector(s.dir);
        return { route: i, index: j, w: span.w, ux, uy };
      }
    }
  }
  return null;
}

export function currentRoute(): number {
  return Number(W().currentroute) || 1;
}

export function numLines(): number {
  return Number(W().numlines) || 0;
}

export function listRoutes(): RouteInfo[] {
  const w = W();
  const n = numLines();
  const out: RouteInfo[] = [];
  for (let i = 1; i <= n; i++) {
    const opt = document.getElementById(`option${i}`);
    const styleRaw = w[`line${i}style`];
    const bwRaw = w[`line${i}bwid`];
    const bcRaw = w[`line${i}bcol`];
    out.push({
      index: i,
      label: (opt?.textContent || `ROUTE ${i}`).trim() || `ROUTE ${i}`,
      color: typeof w[`line${i}col`] === 'string' ? (w[`line${i}col`] as string) : '#000000',
      width: Number(w[`line${i}width`]) || 4,
      style: lineStyleOf(typeof styleRaw === 'string' ? styleRaw : undefined),
      borderColor:
        typeof bcRaw === 'string' && /^#[0-9a-fA-F]{6}$/.test(bcRaw) ? bcRaw : LINE_BORDER_DEFAULT_COLOR,
      borderWidth:
        typeof bwRaw === 'number' && Number.isFinite(bwRaw)
          ? Math.min(LINE_BORDER_MAX_W, Math.max(0, Math.floor(bwRaw)))
          : 0,
    });
  }
  return out;
}

export function selectRoute(i: number): void {
  const w = W();
  w.currentroute = i;
  (w.routechange as () => void)();
}

/** Drop every free text of a route (counts to zero) plus stale pill widths
 *  that would otherwise leak onto same-index stations/texts later. */
export function clearRouteTexts(route: number): void {
  const w = W();
  const tc = textCount(route);
  for (let j = 1; j <= tc; j++) {
    for (const k of ['x', 'y', 'text', 'size', 'col', 'bwid', 'bcol', 'rot'] as const) {
      delete w[`line${route}text${j}${k}`];
    }
  }
  w[`line${route}texts`] = 0;
  const sc = stationCount(route);
  for (let j = 1; j <= sc; j++) delete w[`line${route}station${j}w`];
}

export function createRoute(): void {
  const w = W();
  const next = (Number(w.numlines) || 0) + 1;
  clearRouteTexts(next); // drop stale texts/pill widths colliding with this index
  resetLineStyle(next); // drop stale style/border colliding with this index
  (w.addrouteyay as (s: string) => void)(`ROUTE ${next}`);
}

export function deleteCurrentRoute(): void {
  clearRouteTexts(currentRoute());
  (W().thedel as () => void)();
}

export function applyLineName(i: number, name: string): void {
  const opt = document.getElementById(`option${i}`);
  if (opt) opt.innerHTML = name;
}

export function applyLineColor(i: number, color: string): void {
  W()[`line${i}col`] = color;
  redraw();
}

export function applyLineWidth(i: number, width: number): void {
  W()[`line${i}width`] = width;
  redraw();
}

export function getLineStyle(i: number): LineStyle {
  return lineStyleOf(W()[`line${i}style`]);
}

/** Track segment kinds carrying their own stamped style. */
export const SEG_KINDS = ['ver', 'hor', 'topleft', 'topright'] as const;
export type SegKind = (typeof SEG_KINDS)[number];

/** Bounds for the stale-stamp sweep on load (slots are dense, so it exits early). */
const MAX_ROUTES = 24;
const MAX_SEG_STAMPS = 2000;

export function segCount(route: number, kind: SegKind): number {
  const n = W()[`line${route}${kind}`];
  return typeof n === 'number' && Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

/** Effective style of one track segment: stamped value, else route style. */
export function getSegmentStyle(route: number, kind: SegKind, index: number): LineStyle {
  const v = W()[`line${route}${kind}${index}style`];
  if (v === 'dashed' || v === 'solid') return v;
  return getLineStyle(route);
}

/**
 * Freeze the visible style of every existing segment into explicit stamps so
 * a later route-style switch only affects segments drawn afterwards.
 */
function materializeSegmentStyles(route: number): void {
  const w = W();
  const fb = getLineStyle(route);
  for (const kind of SEG_KINDS) {
    const n = segCount(route, kind);
    for (let j = 1; j <= n; j++) {
      const k = `line${route}${kind}${j}style`;
      if (w[k] !== 'solid' && w[k] !== 'dashed') w[k] = fb;
    }
  }
}

/**
 * Drop every per-segment style stamp. Loading code (old saves carry none,
 * new ones carry their own) must never inherit stamps from previous state,
 * or segments would render with another drawing's styles.
 */
function clearStaleSegStyles(): void {
  const w = W() as Record<string, unknown>;
  for (let i = 1; i <= MAX_ROUTES; i++) {
    for (const kind of SEG_KINDS) {
      for (let j = 1; j <= MAX_SEG_STAMPS; j++) {
        const k = `line${i}${kind}${j}style`;
        if (!(k in w)) break; // commits stamp sequentially, so slots are dense
        delete w[k];
      }
    }
  }
}

/**
 * Style for NEW segments of the route ('solid' normal, 'dashed' construction).
 * Existing segments keep their stamped style — switching type never redraws
 * what is already drawn, so a line can mix solid and dashed stretches.
 */
export function setLineStyle(i: number, style: LineStyle): void {
  const next: LineStyle = style === 'dashed' ? 'dashed' : 'solid';
  if (getLineStyle(i) === next) return;
  materializeSegmentStyles(i);
  W()[`line${i}style`] = next;
  redraw();
}

export function getLineBorder(i: number): { color: string; width: number } {
  const w = W();
  const c = w[`line${i}bcol`];
  const bw = w[`line${i}bwid`];
  return {
    color: typeof c === 'string' && /^#[0-9a-fA-F]{6}$/.test(c) ? c : LINE_BORDER_DEFAULT_COLOR,
    width:
      typeof bw === 'number' && Number.isFinite(bw)
        ? Math.min(LINE_BORDER_MAX_W, Math.max(0, Math.floor(bw)))
        : 0,
  };
}

export function setLineBorderColor(i: number, color: string): void {
  if (!/^#[0-9a-fA-F]{6}$/.test(color)) return;
  W()[`line${i}bcol`] = color;
  redraw();
}

export function setLineBorderWidth(i: number, width: number): void {
  if (!Number.isFinite(width)) return;
  W()[`line${i}bwid`] = Math.min(LINE_BORDER_MAX_W, Math.max(0, Math.floor(width)));
  redraw();
}

/** Reset a route slot to the default style (no stale dashed/border on reuse). */
export function resetLineStyle(i: number): void {
  const w = W();
  w[`line${i}style`] = 'solid';
  w[`line${i}bwid`] = 0;
  w[`line${i}bcol`] = LINE_BORDER_DEFAULT_COLOR;
}

export function setCurve(v: number): void {
  W().curvenum = v;
  redraw();
}

export function setFontSize(v: number): void {
  W().fontzsize = v;
  redraw();
}

export function getCurve(): number {
  return Number(W().curvenum) || 0;
}

export function getFontSize(): number {
  return Number(W().fontzsize) || 8;
}

/* ---------- snapshots (code strings, same format as the classic saver) ---------- */

export function captureCode(): string {
  const w = W();
  (w.thebigsave as () => void)();
  const ta = document.getElementById('ttxt2') as HTMLTextAreaElement | null;
  const code = ta?.value ?? '';
  const saver = document.getElementById('saver');
  if (saver) saver.style.display = 'none';
  return code;
}

export function restoreCode(code: string): void {
  clearStaleSegStyles();
  geval(code);
  (W().routechange as () => void)();
  bakeRiverStrands();
  bakeZonePaths();
  bakeSeaLines();
  redraw();
}

export function newBlankProject(): void {
  // identical statements to the legacy "New project" action, plus a sweep of
  // per-route texts: setroutes() never clears them, so without this the old
  // labels (and stale pill widths) would leak into the blank project
  for (let i = 1, n = numLines(); i <= n; i++) clearRouteTexts(i);
  clearStaleSegStyles();
  geval('curvenum = 2;fontzsize = 8;setroutes(1);riverver = 0;riverhor = 0;rivertopleft = 0;rivertopright = 0;parks = 0;zonever = 0;zonehor = 0;zonetopleft = 0;zonetopright = 0;seas = 0;drawmap(1)');
  bakeRiverStrands();
  bakeZonePaths();
  bakeSeaLines();
  redraw();
  notifyRoutes();
}

/* ---------- free texts (placed anywhere with the Text tool, draggable) ---------- */

export interface FreeText {
  route: number;
  index: number;
  x: number;
  y: number;
  text: string;
  size?: number;
  color?: string;
  borderWidth?: number;
  borderColor?: string;
  rot?: number;
}

/** Normalize any angle to a 0..315 step of 45°. */
export function normRot(v: unknown): number | undefined {
  if (typeof v !== 'number' || !Number.isFinite(v)) return undefined;
  return (((Math.round(v / 45) * 45) % 360) + 360) % 360;
}

export function textCount(route: number): number {
  const n = finite(W()[`line${route}texts`]);
  return n !== undefined && n > 0 ? Math.floor(n) : 0;
}

export function getText(route: number, index: number): FreeText | null {
  const w = W();
  const x = finite(w[`line${route}text${index}x`]);
  const y = finite(w[`line${route}text${index}y`]);
  const t = w[`line${route}text${index}text`];
  if (x === undefined || y === undefined || typeof t !== 'string') return null;
  const out: FreeText = { route, index, x, y, text: t };
  const size = finite(w[`line${route}text${index}size`]);
  if (size !== undefined && size > 0) out.size = size;
  const col = w[`line${route}text${index}col`];
  if (typeof col === 'string' && col !== '') out.color = col;
  const bwid = finite(w[`line${route}text${index}bwid`]);
  if (bwid !== undefined && bwid > 0) out.borderWidth = bwid;
  const bcol = w[`line${route}text${index}bcol`];
  if (typeof bcol === 'string' && bcol !== '') out.borderColor = bcol;
  const rot = normRot(w[`line${route}text${index}rot`]);
  if (rot !== undefined && rot !== 0) out.rot = rot;
  return out;
}

export function setTextPos(route: number, index: number, x: number, y: number): void {
  const w = W();
  w[`line${route}text${index}x`] = Math.round(x);
  w[`line${route}text${index}y`] = Math.round(y);
}

/** Create a free-text label directly (bypasses the legacy prompt dialog). */
export function createFreeText(route: number, x: number, y: number, text: string): number | null {
  const clean = String(text ?? '').trim();
  if (!clean) return null;
  const w = W();
  let n = finite(w[`line${route}texts`]);
  if (n === undefined || !(n >= 0)) n = 0;
  const next = Math.floor(n) + 1;
  w[`line${route}texts`] = next;
  w[`line${route}text${next}x`] = Math.round(x);
  w[`line${route}text${next}y`] = Math.round(y);
  w[`line${route}text${next}text`] = clean;
  redraw();
  return next;
}

export function setTextContent(route: number, index: number, text: string): void {
  W()[`line${route}text${index}text`] = String(text ?? '');
  redraw();
}

export interface TextStylePatch {
  size?: number;
  color?: string;
  borderWidth?: number;
  borderColor?: string;
  rot?: number;
}

function isHex6(c: unknown): c is string {
  return typeof c === 'string' && /^#[0-9a-fA-F]{6}$/.test(c);
}

/** Per-item style overrides (validated); redraws. Unset keys are untouched. */
export function setTextStyle(route: number, index: number, patch: TextStylePatch): void {
  const w = W();
  if (patch.size !== undefined) {
    const v = Math.round(patch.size);
    if (Number.isFinite(v) && v >= 4 && v <= 96) w[`line${route}text${index}size`] = v;
  }
  if (patch.color !== undefined && isHex6(patch.color)) {
    w[`line${route}text${index}col`] = patch.color;
  }
  if (patch.borderWidth !== undefined) {
    const v = Math.round(patch.borderWidth);
    if (Number.isFinite(v) && v >= 0 && v <= 20) w[`line${route}text${index}bwid`] = v;
  }
  if (patch.borderColor !== undefined && isHex6(patch.borderColor)) {
    w[`line${route}text${index}bcol`] = patch.borderColor;
  }
  if (patch.rot !== undefined) {
    const r = normRot(patch.rot);
    if (r !== undefined) w[`line${route}text${index}rot`] = r;
  }
  redraw();
}

/** Drop all per-item overrides so the studio globals apply again. */
export function clearTextStyle(route: number, index: number): void {
  const w = W();
  delete w[`line${route}text${index}size`];
  delete w[`line${route}text${index}col`];
  delete w[`line${route}text${index}bwid`];
  delete w[`line${route}text${index}bcol`];
  delete w[`line${route}text${index}rot`];
  redraw();
}

function writeTextAt(route: number, index: number, t: FreeText): void {
  const w = W();
  w[`line${route}text${index}x`] = Math.round(t.x);
  w[`line${route}text${index}y`] = Math.round(t.y);
  w[`line${route}text${index}text`] = t.text;
  for (const k of ['size', 'col', 'bwid', 'bcol', 'rot'] as const) delete w[`line${route}text${index}${k}`];
  if (t.size !== undefined) w[`line${route}text${index}size`] = t.size;
  if (t.color !== undefined) w[`line${route}text${index}col`] = t.color;
  if (t.borderWidth !== undefined) w[`line${route}text${index}bwid`] = t.borderWidth;
  if (t.borderColor !== undefined) w[`line${route}text${index}bcol`] = t.borderColor;
  if (t.rot !== undefined) w[`line${route}text${index}rot`] = t.rot;
}

/** Duplicate a label with a small offset; returns the new index. */
export function duplicateText(route: number, index: number, dx = 16, dy = 16): number | null {
  const t = getText(route, index);
  if (!t) return null;
  const n = textCount(route) + 1;
  W()[`line${route}texts`] = n;
  writeTextAt(route, n, { ...t, index: n, x: t.x + dx, y: t.y + dy });
  redraw();
  return n;
}

/** Delete a label and compact the numbering (also drops legacy "" ghosts). */
export function deleteText(route: number, index: number): boolean {
  const n = textCount(route);
  if (index < 1 || index > n) return false;
  const kept: FreeText[] = [];
  for (let j = 1; j <= n; j++) {
    const t = getText(route, j);
    if (t && j !== index && t.text !== '') kept.push(t);
  }
  const w = W();
  w[`line${route}texts`] = kept.length;
  kept.forEach((t, i) => writeTextAt(route, i + 1, { ...t, index: i + 1 }));
  redraw();
  return true;
}

/** Approx grab box for a free text (centered label, per-item size aware). */
export function findTextAt(
  px: number,
  py: number,
  pad = 6,
): { route: number; index: number; dx: number; dy: number } | null {
  const gs = finite(W().fontzsize) ?? 8;
  const n = numLines();
  for (let i = 1; i <= n; i++) {
    const count = textCount(i);
    for (let j = 1; j <= count; j++) {
      const t = getText(i, j);
      if (!t || t.text === '') continue;
      const fs = t.size ?? gs;
      const lines = t.text.split('%').length;
      const hw0 = Math.max(12, t.text.length * fs * 0.35) + pad;
      const hh0 = lines * fs * 0.75 + pad;
      // rotated labels: bounding circle so corners stay grabbable
      const rot = t.rot ?? 0;
      const hw = rot % 180 === 0 ? hw0 : Math.hypot(hw0, hh0);
      const hh = rot % 180 === 0 ? hh0 : Math.hypot(hw0, hh0);
      if (Math.abs(px - t.x) <= hw && Math.abs(py - t.y) <= hh) {
        return { route: i, index: j, dx: px - t.x, dy: py - t.y };
      }
    }
  }
  return null;
}

/* ---------- pan (move the whole drawing in block) ---------- */

/** Shift every track / station / free-text by (dx, dy) map units, clamped so
 *  content never leaves the sheet on the top/left. Redraws. Returns applied delta. */
export function shiftDrawing(dx: number, dy: number): { dx: number; dy: number } {
  dx = Math.round(dx);
  dy = Math.round(dy);
  if (!dx && !dy) return { dx: 0, dy: 0 };
  const b = contentBounds();
  if (b.empty) return { dx: 0, dy: 0 };
  if (b.minX + dx < 0) dx = -Math.floor(b.minX);
  if (b.minY + dy < 0) dy = -Math.floor(b.minY);
  if (!dx && !dy) return { dx: 0, dy: 0 };
  try {
    const w = W();
    const n = Number(w.numlines) || 0;
    const add = (key: string, d: number) => {
      const v = w[key];
      if (typeof v === 'number' && Number.isFinite(v)) w[key] = v + d;
    };
    for (let i = 1; i <= n; i++) {
      const ver = Number(w[`line${i}ver`]) || 0;
      for (let j = 1; j <= ver; j++) {
        add(`line${i}ver${j}x`, dx);
        add(`line${i}ver${j}y1`, dy);
        add(`line${i}ver${j}y2`, dy);
      }
      const hor = Number(w[`line${i}hor`]) || 0;
      for (let j = 1; j <= hor; j++) {
        add(`line${i}hor${j}x1`, dx);
        add(`line${i}hor${j}x2`, dx);
        add(`line${i}hor${j}y`, dy);
      }
      const tl = Number(w[`line${i}topleft`]) || 0;
      for (let j = 1; j <= tl; j++) {
        add(`line${i}topleft${j}x`, dx);
        add(`line${i}topleft${j}y`, dy);
      }
      const tr = Number(w[`line${i}topright`]) || 0;
      for (let j = 1; j <= tr; j++) {
        add(`line${i}topright${j}x`, dx);
        add(`line${i}topright${j}y`, dy);
      }
      const st = Number(w[`line${i}stations`]) || 0;
      for (let j = 1; j <= st; j++) {
        add(`line${i}station${j}x`, dx);
        add(`line${i}station${j}y`, dy);
      }
      const tx = finite(w[`line${i}texts`]) ?? 0;
      for (let j = 1; j <= tx; j++) {
        add(`line${i}text${j}x`, dx);
        add(`line${i}text${j}y`, dy);
      }
    }
    const rn = finite(w.riverver) ?? 0;
    for (let j = 1; j <= rn; j++) {
      add(`riverver${j}x`, dx);
      add(`riverver${j}y1`, dy);
      add(`riverver${j}y2`, dy);
    }
    const rh = finite(w.riverhor) ?? 0;
    for (let j = 1; j <= rh; j++) {
      add(`riverhor${j}x1`, dx);
      add(`riverhor${j}x2`, dx);
      add(`riverhor${j}y`, dy);
    }
    const rtl = finite(w.rivertopleft) ?? 0;
    for (let j = 1; j <= rtl; j++) {
      add(`rivertopleft${j}x`, dx);
      add(`rivertopleft${j}y`, dy);
    }
    const rtr = finite(w.rivertopright) ?? 0;
    for (let j = 1; j <= rtr; j++) {
      add(`rivertopright${j}x`, dx);
      add(`rivertopright${j}y`, dy);
    }
    const pn = finite(w.parks) ?? 0;
    for (let i = 1; i <= pn; i++) {
      add(`park${i}x`, dx);
      add(`park${i}y`, dy);
    }
    const zn = finite(w.zonever) ?? 0;
    for (let j = 1; j <= zn; j++) {
      add(`zonever${j}x`, dx);
      add(`zonever${j}y1`, dy);
      add(`zonever${j}y2`, dy);
    }
    const zh = finite(w.zonehor) ?? 0;
    for (let j = 1; j <= zh; j++) {
      add(`zonehor${j}x1`, dx);
      add(`zonehor${j}x2`, dx);
      add(`zonehor${j}y`, dy);
    }
    const ztl = finite(w.zonetopleft) ?? 0;
    for (let j = 1; j <= ztl; j++) {
      add(`zonetopleft${j}x`, dx);
      add(`zonetopleft${j}y`, dy);
    }
    const ztr = finite(w.zonetopright) ?? 0;
    for (let j = 1; j <= ztr; j++) {
      add(`zonetopright${j}x`, dx);
      add(`zonetopright${j}y`, dy);
    }
    const sn = finite(w.seas) ?? 0;
    for (let i = 1; i <= sn; i++) {
      add(`sea${i}x`, dx);
      add(`sea${i}y`, dy);
    }
  } catch {
    return { dx: 0, dy: 0 };
  }
  bakeRiverStrands();
  bakeZonePaths();
  bakeSeaLines();
  redraw();
  return { dx, dy };
}

/* ---------- nature: rivers (track-like segments) + parks (rects), under tracks ---------- */

export const PARK_MIN_SIZE = 8;

/** Parallel strands per river ribbon (evenly spanning the river width). */
const RIVER_STRANDS = 5;

export interface RiverPoint {
  x: number;
  y: number;
}

export type RiverSegKind = 'ver' | 'hor' | 'tl' | 'tr';

export interface RiverSeg {
  kind: RiverSegKind;
  index: number;
  ax: number;
  ay: number;
  bx: number;
  by: number;
}

export interface ParkRect {
  index: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

function riverJumpTol(): number {
  const jn = finite(W().jumpnum) ?? 2.4;
  return getRiverWidth() * (jn > 0 ? jn : 2.4);
}

/** All river segment endpoints (used for snap + hit-test + bounds). */
export function listRiverSegs(): RiverSeg[] {
  const w = W();
  const out: RiverSeg[] = [];
  const push = (kind: RiverSegKind, index: number, ax: unknown, ay: unknown, bx: unknown, by: unknown) => {
    if (
      typeof ax === 'number' &&
      typeof ay === 'number' &&
      typeof bx === 'number' &&
      typeof by === 'number' &&
      Number.isFinite(ax) &&
      Number.isFinite(ay) &&
      Number.isFinite(bx) &&
      Number.isFinite(by)
    ) {
      out.push({ kind, index, ax, ay, bx, by });
    }
  };
  const ver = finite(w.riverver) ?? 0;
  for (let j = 1; j <= ver; j++) {
    push('ver', j, w[`riverver${j}x`], w[`riverver${j}y1`], w[`riverver${j}x`], w[`riverver${j}y2`]);
  }
  const hor = finite(w.riverhor) ?? 0;
  for (let j = 1; j <= hor; j++) {
    push('hor', j, w[`riverhor${j}x1`], w[`riverhor${j}y`], w[`riverhor${j}x2`], w[`riverhor${j}y`]);
  }
  const tl = finite(w.rivertopleft) ?? 0;
  for (let j = 1; j <= tl; j++) {
    const x = w[`rivertopleft${j}x`];
    const y = w[`rivertopleft${j}y`];
    const wd = w[`rivertopleft${j}width`];
    if (typeof x === 'number' && typeof y === 'number' && typeof wd === 'number') {
      push('tl', j, x, y, x + wd, y + wd);
    }
  }
  const tr = finite(w.rivertopright) ?? 0;
  for (let j = 1; j <= tr; j++) {
    const x = w[`rivertopright${j}x`];
    const y = w[`rivertopright${j}y`];
    const wd = w[`rivertopright${j}width`];
    if (typeof x === 'number' && typeof y === 'number' && typeof wd === 'number') {
      push('tr', j, x, y, x - wd, y + wd);
    }
  }
  return out;
}

/** Snap a point to the nearest river vertex within jump tolerance (like tracks). */
export function riverSnapPoint(x: number, y: number): RiverPoint {
  const tol = riverJumpTol();
  let sx = x;
  let sy = y;
  let bestX = Infinity;
  let bestY = Infinity;
  for (const s of listRiverSegs()) {
    for (const [vx, vy] of [
      [s.ax, s.ay],
      [s.bx, s.by],
    ] as const) {
      const dx = Math.abs(vx - x);
      const dy = Math.abs(vy - y);
      if (dx <= tol && dy <= tol) {
        if (dx < bestX) {
          bestX = dx;
          sx = vx;
        }
        if (dy < bestY) {
          bestY = dy;
          sy = vy;
        }
      }
    }
  }
  return { x: sx, y: sy };
}

export interface RiverDrag {
  angle: number; // 0 = no segment yet, else 1-8 like the Draw tool
  eendx: number;
  eendy: number;
  mooaaa: number;
  endSnapped: boolean; // end was pulled onto the river network (will fuse)
}

/**
 * Same 8-direction snap as the Draw tool: raw pointer -> axis/diagonal end.
 * Returns null when start and pointer coincide (nothing to draw yet).
 */
export interface SegSnapOpts {
  snap: (x: number, y: number) => RiverPoint;
  onNet: (x: number, y: number) => boolean;
  ok: (angle: number, x: number, y: number) => boolean;
}

/** Generic Draw-style 8-direction drag; rivers/zones plug in their networks. */
export function segDragUpdate(
  sx: number,
  sy: number,
  rx: number,
  ry: number,
  o: SegSnapOpts,
): RiverDrag | null {
  if (sx === rx && sy === ry) return { angle: 0, eendx: sx, eendy: sy, mooaaa: 0, endSnapped: false };
  const asdasd = (Math.atan2(rx - sx, ry - sy) * (180 / Math.PI) + 180) % 360;
  const norm = asdasd < 0 ? asdasd + 360 : asdasd;
  let angle = 0;
  let aex = rx;
  let aey = ry;
  const m0 = rx - sx;
  if (norm < 30 || norm > 329) {
    aex = sx;
    aey = ry;
    angle = 1;
  } else if (norm < 60) {
    aex = sx + m0;
    aey = sy + m0;
    angle = 2;
  } else if (norm < 120) {
    aex = rx;
    aey = sy;
    angle = 3;
  } else if (norm < 150) {
    aex = sx + m0;
    aey = sy - m0;
    angle = 4;
  } else if (norm < 210) {
    aex = sx;
    aey = ry;
    angle = 5;
  } else if (norm < 240) {
    aex = sx + m0;
    aey = sy + m0;
    angle = 6;
  } else if (norm < 300) {
    aex = rx;
    aey = sy;
    angle = 7;
  } else {
    aex = sx + m0;
    aey = sy - m0;
    angle = 8;
  }
  // chain onto the network (vertices and mid-stream points)
  const sn = o.snap(aex, aey);
  const ex = sn.x;
  const ey = sn.y;
  const mooaaa = ex - sx;
  let eendx = ex;
  let eendy = ey;
  if (angle === 1 || angle === 5) {
    eendx = sx;
    eendy = ey;
  } else if (angle === 3 || angle === 7) {
    eendx = ex;
    eendy = sy;
  } else {
    eendx = sx + mooaaa;
    eendy = angle === 4 || angle === 8 ? sy - mooaaa : sy + mooaaa;
  }
  // fused only when the committed end truly lands on the network at a
  // valid junction — decided by geometry, so releasing exactly onto the
  // network fuses too
  const endSnapped = o.onNet(eendx, eendy) && o.ok(angle, eendx, eendy);
  return { angle, eendx, eendy, mooaaa, endSnapped };
}

/** River-flavored drag (45°/collinear junctions only). */
export function riverDragUpdate(sx: number, sy: number, rx: number, ry: number): RiverDrag | null {
  return segDragUpdate(sx, sy, rx, ry, {
    snap: riverSnapNetwork,
    onNet: riverPointOnNetwork,
    ok: riverJunctionOk,
  });
}

/** Commit one river segment; same shapes the Draw tool writes for tracks. */
export function commitRiverSeg(sx: number, sy: number, d: RiverDrag): boolean {
  if (d.angle < 1 || d.angle > 8) return false;
  if (sx === d.eendx && sy === d.eendy) return false;
  const w = W();
  const ri = (v: number) => Math.round(v);
  if (d.angle === 1) {
    const n = (finite(w.riverver) ?? 0) + 1;
    w.riverver = n;
    w[`riverver${n}x`] = ri(sx);
    w[`riverver${n}y1`] = ri(d.eendy);
    w[`riverver${n}y2`] = ri(sy);
  } else if (d.angle === 5) {
    const n = (finite(w.riverver) ?? 0) + 1;
    w.riverver = n;
    w[`riverver${n}x`] = ri(sx);
    w[`riverver${n}y2`] = ri(d.eendy);
    w[`riverver${n}y1`] = ri(sy);
  } else if (d.angle === 3) {
    const n = (finite(w.riverhor) ?? 0) + 1;
    w.riverhor = n;
    w[`riverhor${n}y`] = ri(sy);
    w[`riverhor${n}x1`] = ri(d.eendx);
    w[`riverhor${n}x2`] = ri(sx);
  } else if (d.angle === 7) {
    const n = (finite(w.riverhor) ?? 0) + 1;
    w.riverhor = n;
    w[`riverhor${n}y`] = ri(sy);
    w[`riverhor${n}x2`] = ri(d.eendx);
    w[`riverhor${n}x1`] = ri(sx);
  } else if (d.angle === 6) {
    const n = (finite(w.rivertopleft) ?? 0) + 1;
    w.rivertopleft = n;
    w[`rivertopleft${n}x`] = ri(sx);
    w[`rivertopleft${n}y`] = ri(sy);
    w[`rivertopleft${n}width`] = ri(d.mooaaa);
  } else if (d.angle === 4) {
    const n = (finite(w.rivertopright) ?? 0) + 1;
    w.rivertopright = n;
    w[`rivertopright${n}x`] = ri(sx);
    w[`rivertopright${n}y`] = ri(sy);
    w[`rivertopright${n}width`] = ri(0 - d.mooaaa);
  } else if (d.angle === 2) {
    const n = (finite(w.rivertopleft) ?? 0) + 1;
    w.rivertopleft = n;
    w[`rivertopleft${n}x`] = ri(sx + d.mooaaa);
    w[`rivertopleft${n}y`] = ri(sy + d.mooaaa);
    w[`rivertopleft${n}width`] = ri(0 - d.mooaaa);
  } else {
    const n = (finite(w.rivertopright) ?? 0) + 1;
    w.rivertopright = n;
    w[`rivertopright${n}x`] = ri(sx + d.mooaaa);
    w[`rivertopright${n}y`] = ri(sy - d.mooaaa);
    w[`rivertopright${n}width`] = ri(d.mooaaa);
  }
  bakeRiverStrands();
  redraw();
  return true;
}

export function deleteRiver(kind: RiverSegKind, index: number): boolean {
  const kept = listRiverSegs().filter((s) => !(s.kind === kind && s.index === index));
  if (kept.length === listRiverSegs().length) return false;
  const w = W();
  const byKind: Record<RiverSegKind, RiverSeg[]> = { ver: [], hor: [], tl: [], tr: [] };
  for (const s of kept) byKind[s.kind].push(s);
  w.riverver = byKind.ver.length;
  byKind.ver.forEach((s, i) => {
    const n = i + 1;
    w[`riverver${n}x`] = s.ax;
    w[`riverver${n}y1`] = s.ay;
    w[`riverver${n}y2`] = s.by;
  });
  w.riverhor = byKind.hor.length;
  byKind.hor.forEach((s, i) => {
    const n = i + 1;
    w[`riverhor${n}y`] = s.ay;
    w[`riverhor${n}x1`] = s.ax;
    w[`riverhor${n}x2`] = s.bx;
  });
  w.rivertopleft = byKind.tl.length;
  byKind.tl.forEach((s, i) => {
    const n = i + 1;
    w[`rivertopleft${n}x`] = s.ax;
    w[`rivertopleft${n}y`] = s.ay;
    w[`rivertopleft${n}width`] = s.bx - s.ax;
  });
  w.rivertopright = byKind.tr.length;
  byKind.tr.forEach((s, i) => {
    const n = i + 1;
    w[`rivertopright${n}x`] = s.ax;
    w[`rivertopright${n}y`] = s.ay;
    w[`rivertopright${n}width`] = s.ax - s.bx;
  });
  bakeRiverStrands();
  redraw();
  return true;
}

/* ---------- river ribbons: segments -> chained paths -> smooth parallel strands ----------
 * The kernel only strokes the baked strands; all geometry lives here (testable). */

export function getRiverWidth(): number {
  const v = finite(W().riverwidth);
  return v !== undefined && v >= 4 && v <= 160 ? Math.round(v) : STYLE_DEFAULTS.riverWidth;
}

export function setRiverWidth(v: number): void {
  W().riverwidth = Math.min(160, Math.max(4, Math.round(v) || STYLE_DEFAULTS.riverWidth));
  bakeRiverStrands();
  redraw();
}

export function getRiverCurve(): number {
  const v = finite(W().rivercurve);
  return v !== undefined && v >= 0 && v <= 9 ? Math.round(v) : STYLE_DEFAULTS.riverCurve;
}

export function setRiverCurve(v: number): void {
  W().rivercurve = Math.min(9, Math.max(0, Math.round(v)));
  bakeRiverStrands();
  redraw();
}

/** Stroke width of a single strand for the current river width. */
export function riverStrandW(): number {
  return Math.max(1.5, getRiverWidth() / 12);
}

function riverBlendFactor(): number {
  return Math.min(1, Math.max(0, getRiverCurve() / 9));
}

function lerpPt(a: RiverPoint, b: RiverPoint, t: number): RiverPoint {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/**
 * Centripetal Catmull-Rom: unlike the uniform variant it never overshoots
 * sharp corners (no loops or spikes outside the ribbon), while still passing
 * through every control point so junctions stay exactly fused.
 */
function catmullRom(p0: RiverPoint, p1: RiverPoint, p2: RiverPoint, p3: RiverPoint, u: number): RiverPoint {
  const dist = (a: RiverPoint, b: RiverPoint) => Math.pow(Math.hypot(b.x - a.x, b.y - a.y), 0.5);
  const t0 = 0;
  const t1 = t0 + Math.max(dist(p0, p1), 1e-4);
  const t2 = t1 + Math.max(dist(p1, p2), 1e-4);
  const t3 = t2 + Math.max(dist(p2, p3), 1e-4);
  const t = t1 + (t2 - t1) * u;
  const mix = (a: number, b: number, ta: number, tb: number) => a + ((b - a) * (t - ta)) / (tb - ta);
  const a1x = mix(p0.x, p1.x, t0, t1);
  const a1y = mix(p0.y, p1.y, t0, t1);
  const a2x = mix(p1.x, p2.x, t1, t2);
  const a2y = mix(p1.y, p2.y, t1, t2);
  const a3x = mix(p2.x, p3.x, t2, t3);
  const a3y = mix(p2.y, p3.y, t2, t3);
  const b1x = mix(a1x, a2x, t0, t2);
  const b1y = mix(a1y, a2y, t0, t2);
  const b2x = mix(a2x, a3x, t1, t3);
  const b2y = mix(a2y, a3y, t1, t3);
  return { x: mix(b1x, b2x, t1, t2), y: mix(b1y, b2y, t1, t2) };
}

const CR_SUBDIV = 10;

/**
 * Smooth a control polyline with Catmull-Rom blended toward the raw polyline
 * by the curve setting. The curve always passes through the control points,
 * so junctions stay exactly fused; f = 0 keeps sharp corners.
 */
function smoothPath(pts: RiverPoint[], f: number, closed: boolean): RiverPoint[] {
  if (pts.length < 2 || f <= 0) return pts.slice();
  const out: RiverPoint[] = [];
  if (closed) {
    const n = pts.length - 1; // last duplicates first
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % n];
      const p3 = pts[(i + 2) % n];
      for (let j = 0; j < CR_SUBDIV; j++) {
        const t = j / CR_SUBDIV;
        out.push(lerpPt(lerpPt(p1, p2, t), catmullRom(p0, p1, p2, p3, t), f));
      }
    }
    return out;
  }
  const ext = [pts[0], ...pts, pts[pts.length - 1]];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = ext[i];
    const p1 = ext[i + 1];
    const p2 = ext[i + 2];
    const p3 = ext[i + 3];
    for (let j = 0; j < CR_SUBDIV; j++) {
      const t = j / CR_SUBDIV;
      out.push(lerpPt(lerpPt(p1, p2, t), catmullRom(p0, p1, p2, p3, t), f));
    }
  }
  out.push({ ...pts[pts.length - 1] });
  return out;
}

function offsetPath(path: RiverPoint[], off: number): RiverPoint[] {
  return path.map((p, i) => {
    const a = path[Math.max(0, i - 1)];
    const b = path[Math.min(path.length - 1, i + 1)];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: p.x + (-dy / len) * off, y: p.y + (dx / len) * off };
  });
}

function strandPair(path: RiverPoint[], width: number, f: number): RiverPoint[][] {
  const out: RiverPoint[][] = [];
  if (path.length < 2) return out;
  const closed = path.length > 2 && path[0].x === path[path.length - 1].x && path[0].y === path[path.length - 1].y;
  // smooth the centerline first, then offset it: every strand shares the exact
  // same shape, so ribbons stay uniformly parallel through bends and junctions
  // (offsetting sharp corners first fans the strands apart)
  const center = smoothPath(path, f, closed);
  for (let k = 0; k < RIVER_STRANDS; k++) {
    const off = (k / (RIVER_STRANDS - 1) - 0.5) * width;
    out.push(offsetPath(center, off));
  }
  return out;
}

/** Chain river segments sharing endpoints into ordered paths (greedy). */
export function chainRiverPaths(): RiverPoint[][] {
  const edges = listRiverSegs().map((s) => ({ ax: s.ax, ay: s.ay, bx: s.bx, by: s.by, used: false }));
  const key = (x: number, y: number) => `${x},${y}`;
  const deg = new Map<string, number>();
  for (const e of edges) {
    deg.set(key(e.ax, e.ay), (deg.get(key(e.ax, e.ay)) ?? 0) + 1);
    deg.set(key(e.bx, e.by), (deg.get(key(e.bx, e.by)) ?? 0) + 1);
  }
  const touches = (x: number, y: number) =>
    edges.find((c) => !c.used && ((c.ax === x && c.ay === y) || (c.bx === x && c.by === y)));
  const paths: RiverPoint[][] = [];
  for (const s of edges) {
    if (s.used) continue;
    s.used = true;
    const pts: RiverPoint[] = [
      { x: s.ax, y: s.ay },
      { x: s.bx, y: s.by },
    ];
    // forward from B: stop at dead ends and junctions (degree != 2) so those
    // vertices stay pinned during smoothing and every branch blends into them
    let end = pts[pts.length - 1];
    while ((deg.get(key(end.x, end.y)) ?? 0) === 2) {
      const nx = touches(end.x, end.y);
      if (!nx) break;
      nx.used = true;
      end = nx.ax === end.x && nx.ay === end.y ? { x: nx.bx, y: nx.by } : { x: nx.ax, y: nx.ay };
      pts.push(end);
    }
    let front = pts[0];
    while ((deg.get(key(front.x, front.y)) ?? 0) === 2) {
      const nx = touches(front.x, front.y);
      if (!nx) break;
      nx.used = true;
      front = nx.ax === front.x && nx.ay === front.y ? { x: nx.bx, y: nx.by } : { x: nx.ax, y: nx.ay };
      pts.unshift(front);
    }
    paths.push(pts);
  }
  return paths;
}

/** Line axis (degrees, undirected) of a Draw-style segment angle. */
export function riverAxisOfAngle(angle: number): number {
  if (angle === 1 || angle === 5) return 90; // vertical
  if (angle === 3 || angle === 7) return 0; // horizontal
  if (angle === 2 || angle === 6) return 45; // diagonal down-right
  if (angle === 4 || angle === 8) return 135; // diagonal down-left
  return -1;
}

/** Axes of the river segments running through (x, y): exact vertices or overlap. */
export function riverAxesAt(x: number, y: number, eps = 1.5): number[] {
  const axes = new Set<number>();
  for (const s of listRiverSegs()) {
    let touches =
      (s.ax === x && s.ay === y) || (s.bx === x && s.by === y);
    if (!touches) {
      const dx = s.bx - s.ax;
      const dy = s.by - s.ay;
      const len2 = dx * dx + dy * dy;
      if (len2 > 0) {
        const t = ((x - s.ax) * dx + (y - s.ay) * dy) / len2;
        if (t >= 0 && t <= 1 && Math.hypot(x - (s.ax + t * dx), y - (s.ay + t * dy)) <= eps) {
          touches = true;
        }
      }
    }
    if (!touches) continue;
    if (s.kind === 'ver') axes.add(90);
    else if (s.kind === 'hor') axes.add(0);
    else if (s.kind === 'tl') axes.add(45);
    else axes.add(135);
  }
  return [...axes];
}

/**
 * Junction rule: a new segment may fuse at (x, y) only when it runs collinear
 * with (0°) or at 45° to some river already there. 90° crossings never fuse.
 */
export function riverJunctionOk(angle: number, x: number, y: number): boolean {
  const a = riverAxisOfAngle(angle);
  if (a < 0) return false;
  const axes = riverAxesAt(x, y);
  if (axes.length === 0) return false;
  return axes.some((b) => {
    const d = Math.abs(a - b) % 180;
    const diff = Math.min(d, 180 - d);
    return diff === 0 || diff === 45;
  });
}

/** True when (x, y) sits on the river network (vertex or overlap). */
export function riverPointOnNetwork(x: number, y: number, eps = 1.5): boolean {
  for (const s of listRiverSegs()) {
    if ((s.ax === x && s.ay === y) || (s.bx === x && s.by === y)) return true;
    const dx = s.bx - s.ax;
    const dy = s.by - s.ay;
    const len2 = dx * dx + dy * dy;
    if (len2 <= 0) continue;
    const t = ((x - s.ax) * dx + (y - s.ay) * dy) / len2;
    if (t >= 0 && t <= 1 && Math.hypot(x - (s.ax + t * dx), y - (s.ay + t * dy)) <= eps) {
      return true;
    }
  }
  return false;
}
export function riverSnapNetwork(x: number, y: number): RiverPoint {
  const tol = riverJumpTol();
  let best: RiverPoint = { x, y };
  let bestD = tol;
  const seen = new Set<string>();
  for (const s of listRiverSegs()) {
    for (const [vx, vy] of [
      [s.ax, s.ay],
      [s.bx, s.by],
    ] as const) {
      const k = `${vx},${vy}`;
      if (seen.has(k)) continue;
      seen.add(k);
      const d = Math.hypot(vx - x, vy - y);
      if (d <= tol && d < bestD) {
        bestD = d;
        best = { x: vx, y: vy };
      }
    }
  }
  if (bestD < tol) return best;
  for (const s of listRiverSegs()) {
    const dx = s.bx - s.ax;
    const dy = s.by - s.ay;
    const len2 = dx * dx + dy * dy;
    if (len2 <= 0) continue;
    const t = Math.max(0, Math.min(1, ((x - s.ax) * dx + (y - s.ay) * dy) / len2));
    const vx = s.ax + t * dx;
    const vy = s.ay + t * dy;
    const d = Math.hypot(vx - x, vy - y);
    if (d <= tol && d < bestD) {
      bestD = d;
      best = { x: Math.round(vx), y: Math.round(vy) };
    }
  }
  return best;
}

interface RiverEndpoints {
  ax: number;
  ay: number;
  bx: number;
  by: number;
}

function writeRiverKind(kind: RiverSegKind, pairs: RiverEndpoints[]): void {
  const w = W();
  if (kind === 'ver') {
    w.riverver = pairs.length;
    pairs.forEach((s, i) => {
      const n = i + 1;
      w[`riverver${n}x`] = s.ax;
      w[`riverver${n}y1`] = s.ay;
      w[`riverver${n}y2`] = s.by;
    });
  } else if (kind === 'hor') {
    w.riverhor = pairs.length;
    pairs.forEach((s, i) => {
      const n = i + 1;
      w[`riverhor${n}y`] = s.ay;
      w[`riverhor${n}x1`] = s.ax;
      w[`riverhor${n}x2`] = s.bx;
    });
  } else if (kind === 'tl') {
    w.rivertopleft = pairs.length;
    pairs.forEach((s, i) => {
      const n = i + 1;
      w[`rivertopleft${n}x`] = s.ax;
      w[`rivertopleft${n}y`] = s.ay;
      w[`rivertopleft${n}width`] = s.bx - s.ax;
    });
  } else {
    w.rivertopright = pairs.length;
    pairs.forEach((s, i) => {
      const n = i + 1;
      w[`rivertopright${n}x`] = s.ax;
      w[`rivertopright${n}y`] = s.ay;
      w[`rivertopright${n}width`] = s.ax - s.bx;
    });
  }
}

/**
 * Resolve the drag start: follow the network snap, unless it would join at
 * 90° — then stay at the raw press point (crossings never fuse). Fusion is
 * decided by geometry, so pressing exactly onto the river fuses as well.
 */
export function riverStartFuse(
  sx: number,
  sy: number,
  s0x: number,
  s0y: number,
  angle: number,
): { x: number; y: number; fused: boolean } {
  const moved = sx !== s0x || sy !== s0y;
  if (angle >= 1 && moved && !riverJunctionOk(angle, sx, sy)) {
    return {
      x: s0x,
      y: s0y,
      fused: riverPointOnNetwork(s0x, s0y) && riverJunctionOk(angle, s0x, s0y),
    };
  }
  return {
    x: sx,
    y: sy,
    fused: riverPointOnNetwork(sx, sy) && (angle < 1 || riverJunctionOk(angle, sx, sy)),
  };
}
/**
 * Split the river segment running under (x, y) into two at that point so a
 * branch starting/ending mid-stream becomes a true junction. Only fires when
 * the point sits essentially ON a segment (callers fuse first); no-op near
 * vertices (already connected) and elsewhere.
 */
export function splitRiverAtPoint(x: number, y: number): boolean {
  const tol = 2.5;
  const MARGIN = 2;
  let hit: { seg: RiverSeg; t: number; d: number } | null = null;
  for (const s of listRiverSegs()) {
    const dx = s.bx - s.ax;
    const dy = s.by - s.ay;
    const len = Math.hypot(dx, dy);
    if (len <= MARGIN * 2) continue;
    const t = ((x - s.ax) * dx + (y - s.ay) * dy) / (len * len);
    if (t * len <= MARGIN || (1 - t) * len <= MARGIN) continue;
    const d = Math.hypot(x - (s.ax + t * dx), y - (s.ay + t * dy));
    if (d <= tol && (!hit || d < hit.d)) hit = { seg: s, t, d };
  }
  if (!hit) return false;
  const { seg } = hit;
  const px = Math.round(x);
  const py = Math.round(y);
  const pairs = listRiverSegs()
    .filter((s) => s.kind === seg.kind)
    .map((s) => ({ index: s.index, ax: s.ax, ay: s.ay, bx: s.bx, by: s.by }));
  const at = pairs.findIndex((p) => p.index === seg.index);
  if (at === -1) return false;
  pairs.splice(
    at,
    1,
    { index: -1, ax: pairs[at].ax, ay: pairs[at].ay, bx: px, by: py },
    { index: -1, ax: px, ay: py, bx: pairs[at].bx, by: pairs[at].by },
  );
  writeRiverKind(seg.kind, pairs);
  bakeRiverStrands();
  redraw();
  return true;
}

/** Recompute every strand polyline from the segments. Caller redraws. */
export function bakeRiverStrands(): void {
  const w = W();
  const width = getRiverWidth();
  const f = riverBlendFactor();
  const strands: RiverPoint[][] = [];
  for (const path of chainRiverPaths()) {
    for (const s of strandPair(flareRiverPath(path, width), width, f)) strands.push(s);
  }
  w.riverstrands = strands.length;
  w.riverstrandw = riverStrandW();
  strands.forEach((pts, i) => {
    const idx = i + 1;
    w[`riverstrand${idx}pts`] = pts.length;
    pts.forEach((p, j) => {
      w[`riverstrand${idx}pt${j + 1}x`] = Math.round(p.x * 100) / 100;
      w[`riverstrand${idx}pt${j + 1}y`] = Math.round(p.y * 100) / 100;
    });
  });
}

/** Live-preview strands for the segment currently being dragged. */
export function previewRiverStrands(sx: number, sy: number, ex: number, ey: number): RiverPoint[][] {
  return strandPair(
    [
      { x: sx, y: sy },
      { x: ex, y: ey },
    ],
    getRiverWidth(),
    riverBlendFactor(),
  );
}

/**
 * Flare a path into its junctions: at path ends sitting on a junction
 * (degree ≥ 3), extend the control polyline a short run-up back along the
 * main flow so the smoothed ribbon bends into the junction from the correct
 * direction instead of kinking at it. Straight continuations are untouched.
 */
export function flareRiverPath(path: RiverPoint[], width: number): RiverPoint[] {
  if (path.length < 2) return path;
  const closed = path.length > 2 && path[0].x === path[path.length - 1].x && path[0].y === path[path.length - 1].y;
  if (closed) return path;
  const segs = listRiverSegs();
  const key = (x: number, y: number) => `${x},${y}`;
  const deg = new Map<string, number>();
  for (const s of segs) {
    deg.set(key(s.ax, s.ay), (deg.get(key(s.ax, s.ay)) ?? 0) + 1);
    deg.set(key(s.bx, s.by), (deg.get(key(s.bx, s.by)) ?? 0) + 1);
  }
  // best outward unit from J along another incident edge (skipping the path's
  // own edge toward `other`), scored against reference direction (tx, ty)
  const bestRun = (
    J: RiverPoint,
    other: RiverPoint,
    tx: number,
    ty: number,
  ): { wx: number; wy: number; dot: number; len: number } | null => {
    const tl = Math.hypot(tx, ty) || 1;
    tx /= tl;
    ty /= tl;
    let best: { wx: number; wy: number; dot: number; len: number } | null = null;
    for (const s of segs) {
      const aAt = s.ax === J.x && s.ay === J.y;
      const bAt = s.bx === J.x && s.by === J.y;
      if (!aAt && !bAt) continue;
      const ox = aAt ? s.bx : s.ax;
      const oy = aAt ? s.by : s.ay;
      if (ox === other.x && oy === other.y) continue; // own edge
      const ex = ox - J.x;
      const ey = oy - J.y;
      const el = Math.hypot(ex, ey) || 1;
      const dot = tx * (ex / el) + ty * (ey / el);
      if (!best || dot > best.dot) best = { wx: ex / el, wy: ey / el, dot, len: el };
    }
    return best;
  };
  const runLen = (edgeLen: number) => {
    const L = Math.min(Math.max(12, width * 1.2), edgeLen - 1);
    return L >= 6 ? L : 0;
  };
  let out = path;
  // path start [J, B1, ...]: run up behind J along the arriving flow
  const first = out[0];
  const second = out[1];
  if ((deg.get(key(first.x, first.y)) ?? 0) >= 3) {
    const back = bestRun(first, second, first.x - second.x, first.y - second.y);
    if (back && back.dot > 0.5 && back.dot < 0.99) {
      const L = runLen(back.len);
      if (L > 0) out = [{ x: first.x + back.wx * L, y: first.y + back.wy * L }, ...out];
    }
  }
  // path end [..., P, J]: run past J along the best continuation of travel
  const last = out[out.length - 1];
  const prev = out[out.length - 2];
  if ((deg.get(key(last.x, last.y)) ?? 0) >= 3) {
    const fwd = bestRun(last, prev, last.x - prev.x, last.y - prev.y);
    if (fwd && fwd.dot > 0.5 && fwd.dot < 0.99) {
      const L = runLen(fwd.len);
      if (L > 0) out = [...out, { x: last.x + fwd.wx * L, y: last.y + fwd.wy * L }];
    }
  }
  return out;
}

function distToSeg(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  const t = len2 > 0 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2)) : 0;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** Nearest river segment within its ribbon width + pad. */
export function findRiverAt(px: number, py: number, pad = 6): RiverSeg | null {
  const tol = getRiverWidth() / 2 + pad;
  let best: RiverSeg | null = null;
  let bestD = Infinity;
  for (const s of listRiverSegs()) {
    const d = distToSeg(px, py, s.ax, s.ay, s.bx, s.by);
    if (d <= tol && d < bestD) {
      bestD = d;
      best = s;
    }
  }
  return best;
}

/* ---------- zones: dotted boundaries drawn like metro tracks ---------- */

export function listZoneSegs(): RiverSeg[] {
  const w = W();
  const out: RiverSeg[] = [];
  const push = (kind: RiverSegKind, index: number, ax: unknown, ay: unknown, bx: unknown, by: unknown) => {
    if (
      typeof ax === 'number' &&
      typeof ay === 'number' &&
      typeof bx === 'number' &&
      typeof by === 'number' &&
      Number.isFinite(ax) &&
      Number.isFinite(ay) &&
      Number.isFinite(bx) &&
      Number.isFinite(by)
    ) {
      out.push({ kind, index, ax, ay, bx, by });
    }
  };
  const ver = finite(w.zonever) ?? 0;
  for (let j = 1; j <= ver; j++) {
    push('ver', j, w[`zonever${j}x`], w[`zonever${j}y1`], w[`zonever${j}x`], w[`zonever${j}y2`]);
  }
  const hor = finite(w.zonehor) ?? 0;
  for (let j = 1; j <= hor; j++) {
    push('hor', j, w[`zonehor${j}x1`], w[`zonehor${j}y`], w[`zonehor${j}x2`], w[`zonehor${j}y`]);
  }
  const tl = finite(w.zonetopleft) ?? 0;
  for (let j = 1; j <= tl; j++) {
    const x = w[`zonetopleft${j}x`];
    const y = w[`zonetopleft${j}y`];
    const wd = w[`zonetopleft${j}width`];
    if (typeof x === 'number' && typeof y === 'number' && typeof wd === 'number') {
      push('tl', j, x, y, x + wd, y + wd);
    }
  }
  const tr = finite(w.zonetopright) ?? 0;
  for (let j = 1; j <= tr; j++) {
    const x = w[`zonetopright${j}x`];
    const y = w[`zonetopright${j}y`];
    const wd = w[`zonetopright${j}width`];
    if (typeof x === 'number' && typeof y === 'number' && typeof wd === 'number') {
      push('tr', j, x, y, x - wd, y + wd);
    }
  }
  return out;
}

function zoneJumpTol(): number {
  const jn = finite(W().jumpnum) ?? 2.4;
  return getZoneWidth() * (jn > 0 ? jn : 2.4);
}

/** Snap to the zone network (vertices win, else mid-segment projection). */
export function zoneSnapNetwork(x: number, y: number): RiverPoint {
  const tol = zoneJumpTol();
  let best: RiverPoint = { x, y };
  let bestD = tol;
  const seen = new Set<string>();
  for (const s of listZoneSegs()) {
    for (const [vx, vy] of [
      [s.ax, s.ay],
      [s.bx, s.by],
    ] as const) {
      const k = `${vx},${vy}`;
      if (seen.has(k)) continue;
      seen.add(k);
      const d = Math.hypot(vx - x, vy - y);
      if (d <= tol && d < bestD) {
        bestD = d;
        best = { x: vx, y: vy };
      }
    }
  }
  if (bestD < tol) return best;
  for (const s of listZoneSegs()) {
    const dx = s.bx - s.ax;
    const dy = s.by - s.ay;
    const len2 = dx * dx + dy * dy;
    if (len2 <= 0) continue;
    const t = Math.max(0, Math.min(1, ((x - s.ax) * dx + (y - s.ay) * dy) / len2));
    const vx = s.ax + t * dx;
    const vy = s.ay + t * dy;
    const d = Math.hypot(vx - x, vy - y);
    if (d <= tol && d < bestD) {
      bestD = d;
      best = { x: Math.round(vx), y: Math.round(vy) };
    }
  }
  return best;
}

/** True when (x, y) sits on the zone network. Zones fuse at any angle. */
export function zoneOnNetwork(x: number, y: number, eps = 1.5): boolean {
  for (const s of listZoneSegs()) {
    if ((s.ax === x && s.ay === y) || (s.bx === x && s.by === y)) return true;
    if (distToSeg(x, y, s.ax, s.ay, s.bx, s.by) <= eps) return true;
  }
  return false;
}

/** Zone-flavored drag: same 8-direction snap, no angle restriction. */
export function zoneDragUpdate(sx: number, sy: number, rx: number, ry: number): RiverDrag | null {
  return segDragUpdate(sx, sy, rx, ry, {
    snap: zoneSnapNetwork,
    onNet: zoneOnNetwork,
    ok: () => true,
  });
}

/** Resolve the zone drag start (fuse whenever on the network). */
export function zoneStartFuse(sx: number, sy: number): { x: number; y: number; fused: boolean } {
  return { x: sx, y: sy, fused: zoneOnNetwork(sx, sy) };
}

/** Commit one zone segment; same shapes the Draw tool writes for tracks. */
export function commitZoneSeg(sx: number, sy: number, d: RiverDrag): boolean {
  if (d.angle < 1 || d.angle > 8) return false;
  if (sx === d.eendx && sy === d.eendy) return false;
  const w = W();
  const ri = (v: number) => Math.round(v);
  if (d.angle === 1) {
    const n = (finite(w.zonever) ?? 0) + 1;
    w.zonever = n;
    w[`zonever${n}x`] = ri(sx);
    w[`zonever${n}y1`] = ri(d.eendy);
    w[`zonever${n}y2`] = ri(sy);
  } else if (d.angle === 5) {
    const n = (finite(w.zonever) ?? 0) + 1;
    w.zonever = n;
    w[`zonever${n}x`] = ri(sx);
    w[`zonever${n}y2`] = ri(d.eendy);
    w[`zonever${n}y1`] = ri(sy);
  } else if (d.angle === 3) {
    const n = (finite(w.zonehor) ?? 0) + 1;
    w.zonehor = n;
    w[`zonehor${n}y`] = ri(sy);
    w[`zonehor${n}x1`] = ri(d.eendx);
    w[`zonehor${n}x2`] = ri(sx);
  } else if (d.angle === 7) {
    const n = (finite(w.zonehor) ?? 0) + 1;
    w.zonehor = n;
    w[`zonehor${n}y`] = ri(sy);
    w[`zonehor${n}x2`] = ri(d.eendx);
    w[`zonehor${n}x1`] = ri(sx);
  } else if (d.angle === 6) {
    const n = (finite(w.zonetopleft) ?? 0) + 1;
    w.zonetopleft = n;
    w[`zonetopleft${n}x`] = ri(sx);
    w[`zonetopleft${n}y`] = ri(sy);
    w[`zonetopleft${n}width`] = ri(d.mooaaa);
  } else if (d.angle === 4) {
    const n = (finite(w.zonetopright) ?? 0) + 1;
    w.zonetopright = n;
    w[`zonetopright${n}x`] = ri(sx);
    w[`zonetopright${n}y`] = ri(sy);
    w[`zonetopright${n}width`] = ri(0 - d.mooaaa);
  } else if (d.angle === 2) {
    const n = (finite(w.zonetopleft) ?? 0) + 1;
    w.zonetopleft = n;
    w[`zonetopleft${n}x`] = ri(sx + d.mooaaa);
    w[`zonetopleft${n}y`] = ri(sy + d.mooaaa);
    w[`zonetopleft${n}width`] = ri(0 - d.mooaaa);
  } else {
    const n = (finite(w.zonetopright) ?? 0) + 1;
    w.zonetopright = n;
    w[`zonetopright${n}x`] = ri(sx + d.mooaaa);
    w[`zonetopright${n}y`] = ri(sy - d.mooaaa);
    w[`zonetopright${n}width`] = ri(d.mooaaa);
  }
  bakeZonePaths();
  redraw();
  return true;
}

function writeZoneKind(kind: RiverSegKind, pairs: { ax: number; ay: number; bx: number; by: number }[]): void {
  const w = W();
  if (kind === 'ver') {
    w.zonever = pairs.length;
    pairs.forEach((s, i) => {
      const n = i + 1;
      w[`zonever${n}x`] = s.ax;
      w[`zonever${n}y1`] = s.ay;
      w[`zonever${n}y2`] = s.by;
    });
  } else if (kind === 'hor') {
    w.zonehor = pairs.length;
    pairs.forEach((s, i) => {
      const n = i + 1;
      w[`zonehor${n}y`] = s.ay;
      w[`zonehor${n}x1`] = s.ax;
      w[`zonehor${n}x2`] = s.bx;
    });
  } else if (kind === 'tl') {
    w.zonetopleft = pairs.length;
    pairs.forEach((s, i) => {
      const n = i + 1;
      w[`zonetopleft${n}x`] = s.ax;
      w[`zonetopleft${n}y`] = s.ay;
      w[`zonetopleft${n}width`] = s.bx - s.ax;
    });
  } else {
    w.zonetopright = pairs.length;
    pairs.forEach((s, i) => {
      const n = i + 1;
      w[`zonetopright${n}x`] = s.ax;
      w[`zonetopright${n}y`] = s.ay;
      w[`zonetopright${n}width`] = s.ax - s.bx;
    });
  }
}

export function deleteZone(kind: RiverSegKind, index: number): boolean {
  const kept = listZoneSegs().filter((s) => !(s.kind === kind && s.index === index));
  if (kept.length === listZoneSegs().length) return false;
  const byKind: Record<RiverSegKind, { ax: number; ay: number; bx: number; by: number }[]> = {
    ver: [],
    hor: [],
    tl: [],
    tr: [],
  };
  for (const s of kept) byKind[s.kind].push(s);
  (Object.keys(byKind) as RiverSegKind[]).forEach((k) => writeZoneKind(k, byKind[k]));
  bakeZonePaths();
  redraw();
  return true;
}

/** Nearest zone segment within its width + pad. */
export function findZoneAt(px: number, py: number, pad = 6): RiverSeg | null {
  const tol = getZoneWidth() / 2 + pad;
  let best: RiverSeg | null = null;
  let bestD = Infinity;
  for (const s of listZoneSegs()) {
    const d = distToSeg(px, py, s.ax, s.ay, s.bx, s.by);
    if (d <= tol && d < bestD) {
      bestD = d;
      best = s;
    }
  }
  return best;
}

/** Split the zone segment under (x, y) so touches become exact junctions. */
export function splitZoneAtPoint(x: number, y: number): boolean {
  const tol = 2.5;
  const MARGIN = 2;
  let hit: { seg: RiverSeg; d: number } | null = null;
  for (const s of listZoneSegs()) {
    const dx = s.bx - s.ax;
    const dy = s.by - s.ay;
    const len = Math.hypot(dx, dy);
    if (len <= MARGIN * 2) continue;
    const t = ((x - s.ax) * dx + (y - s.ay) * dy) / (len * len);
    if (t * len <= MARGIN || (1 - t) * len <= MARGIN) continue;
    const d = Math.hypot(x - (s.ax + t * dx), y - (s.ay + t * dy));
    if (d <= tol && (!hit || d < hit.d)) hit = { seg: s, d };
  }
  if (!hit) return false;
  const { seg } = hit;
  const px = Math.round(x);
  const py = Math.round(y);
  const pairs = listZoneSegs()
    .filter((s) => s.kind === seg.kind)
    .map((s) => ({ index: s.index, ax: s.ax, ay: s.ay, bx: s.bx, by: s.by }));
  const at = pairs.findIndex((p) => p.index === seg.index);
  if (at === -1) return false;
  pairs.splice(
    at,
    1,
    { index: -1, ax: pairs[at].ax, ay: pairs[at].ay, bx: px, by: py },
    { index: -1, ax: px, ay: py, bx: pairs[at].bx, by: pairs[at].by },
  );
  writeZoneKind(seg.kind, pairs);
  bakeZonePaths();
  redraw();
  return true;
}

/** Chain zone segments into paths so dots run continuously around corners. */
export function chainZonePaths(): RiverPoint[][] {
  const edges = listZoneSegs().map((s) => ({ ax: s.ax, ay: s.ay, bx: s.bx, by: s.by, used: false }));
  const paths: RiverPoint[][] = [];
  const takeAt = (x: number, y: number): { nx: number; ny: number } | null => {
    const e = edges.find((c) => !c.used && ((c.ax === x && c.ay === y) || (c.bx === x && c.by === y)));
    if (!e) return null;
    e.used = true;
    return e.ax === x && e.ay === y ? { nx: e.bx, ny: e.by } : { nx: e.ax, ny: e.ay };
  };
  for (const s of edges) {
    if (s.used) continue;
    s.used = true;
    const pts: RiverPoint[] = [
      { x: s.ax, y: s.ay },
      { x: s.bx, y: s.by },
    ];
    let nxt = takeAt(pts[pts.length - 1].x, pts[pts.length - 1].y);
    while (nxt) {
      pts.push({ x: nxt.nx, y: nxt.ny });
      nxt = takeAt(nxt.nx, nxt.ny);
    }
    nxt = takeAt(pts[0].x, pts[0].y);
    while (nxt) {
      pts.unshift({ x: nxt.nx, y: nxt.ny });
      nxt = takeAt(nxt.nx, nxt.ny);
    }
    paths.push(pts);
  }
  return paths;
}

/** Bake chained dotted paths. Caller redraws. */
export function bakeZonePaths(): void {
  const w = W();
  const paths = chainZonePaths();
  w.zonepaths = paths.length;
  paths.forEach((pts, i) => {
    const idx = i + 1;
    w[`zonepath${idx}pts`] = pts.length;
    pts.forEach((p, j) => {
      w[`zonepath${idx}pt${j + 1}x`] = Math.round(p.x);
      w[`zonepath${idx}pt${j + 1}y`] = Math.round(p.y);
    });
  });
}

/* ---------- sea: hatched rectangles ---------- */

export const SEA_GAP = 10;
export const SEA_LINE_W = 2;

export interface SeaRect {
  index: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export function seaCount(): number {
  const n = finite(W().seas);
  return n !== undefined && n > 0 ? Math.floor(n) : 0;
}

export function getSea(index: number): SeaRect | null {
  const w = W();
  const x = finite(w[`sea${index}x`]);
  const y = finite(w[`sea${index}y`]);
  const sw = finite(w[`sea${index}w`]);
  const sh = finite(w[`sea${index}h`]);
  if (x === undefined || y === undefined || sw === undefined || sh === undefined) return null;
  return { index, x, y, w: sw, h: sh };
}

export function addSea(x0: number, y0: number, x1: number, y1: number): number | null {
  const px = Math.round(Math.min(x0, x1));
  const py = Math.round(Math.min(y0, y1));
  const pw = Math.round(Math.abs(x1 - x0));
  const ph = Math.round(Math.abs(y1 - y0));
  if (pw < PARK_MIN_SIZE || ph < PARK_MIN_SIZE) return null;
  const k = W();
  const next = seaCount() + 1;
  k.seas = next;
  k[`sea${next}x`] = px;
  k[`sea${next}y`] = py;
  k[`sea${next}w`] = pw;
  k[`sea${next}h`] = ph;
  bakeSeaLines();
  redraw();
  return next;
}

export function deleteSea(index: number): boolean {
  const all: SeaRect[] = [];
  for (let i = 1; i <= seaCount(); i++) {
    const p = getSea(i);
    if (p && i !== index) all.push(p);
  }
  if (all.length === seaCount()) return false;
  const k = W();
  k.seas = all.length;
  all.forEach((p, i) => {
    const idx = i + 1;
    k[`sea${idx}x`] = p.x;
    k[`sea${idx}y`] = p.y;
    k[`sea${idx}w`] = p.w;
    k[`sea${idx}h`] = p.h;
  });
  bakeSeaLines();
  redraw();
  return true;
}

/** Topmost sea containing the point (+pad). */
export function findSeaAt(px: number, py: number, pad = 4): { index: number } | null {
  for (let i = seaCount(); i >= 1; i--) {
    const p = getSea(i);
    if (!p) continue;
    if (px >= p.x - pad && px <= p.x + p.w + pad && py >= p.y - pad && py <= p.y + p.h + pad) {
      return { index: i };
    }
  }
  return null;
}

export interface SeaLine {
  ax: number;
  ay: number;
  bx: number;
  by: number;
}

/** 45° hatch lines (constant x - y) clipped to the rect. */
export function seaHatch(x: number, y: number, w: number, h: number): SeaLine[] {
  const rx = Math.min(x, x + w);
  const ry = Math.min(y, y + h);
  const rw = Math.abs(w);
  const rh = Math.abs(h);
  const out: SeaLine[] = [];
  if (rw <= 0 || rh <= 0) return out;
  const c0 = rx - (ry + rh);
  const c1 = rx + rw - ry;
  const startK = Math.ceil(c0 / SEA_GAP);
  const endK = Math.floor(c1 / SEA_GAP);
  for (let k = startK; k <= endK && out.length < 800; k++) {
    const c = k * SEA_GAP;
    const t0 = Math.max(rx, ry + c);
    const t1 = Math.min(rx + rw, ry + rh + c);
    if (t1 > t0 + 1) out.push({ ax: t0, ay: t0 - c, bx: t1, by: t1 - c });
  }
  return out;
}

/** Bake hatch lines for every sea rect. Caller redraws. */
export function bakeSeaLines(): void {
  const w = W();
  const lines: SeaLine[] = [];
  for (let i = 1; i <= seaCount(); i++) {
    const p = getSea(i);
    if (!p) continue;
    for (const l of seaHatch(p.x, p.y, p.w, p.h)) {
      lines.push(l);
      if (lines.length >= 2000) break;
    }
    if (lines.length >= 2000) break;
  }
  w.sealines = lines.length;
  lines.forEach((l, i) => {
    const idx = i + 1;
    w[`sealine${idx}x1`] = Math.round(l.ax * 100) / 100;
    w[`sealine${idx}y1`] = Math.round(l.ay * 100) / 100;
    w[`sealine${idx}x2`] = Math.round(l.bx * 100) / 100;
    w[`sealine${idx}y2`] = Math.round(l.by * 100) / 100;
  });
}

/** Live-preview hatch for the rect currently being dragged. */
export function previewSeaLines(x0: number, y0: number, x1: number, y1: number): SeaLine[] {
  return seaHatch(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
}

export function parkCount(): number {
  const n = finite(W().parks);
  return n !== undefined && n > 0 ? Math.floor(n) : 0;
}

export function getPark(index: number): ParkRect | null {
  const w = W();
  const x = finite(w[`park${index}x`]);
  const y = finite(w[`park${index}y`]);
  const pw = finite(w[`park${index}w`]);
  const ph = finite(w[`park${index}h`]);
  if (x === undefined || y === undefined || pw === undefined || ph === undefined) return null;
  return { index, x, y, w: pw, h: ph };
}

export function addPark(x: number, y: number, w: number, h: number): number | null {
  const px = Math.round(Math.min(x, x + w));
  const py = Math.round(Math.min(y, y + h));
  const pw = Math.round(Math.abs(w));
  const ph = Math.round(Math.abs(h));
  if (pw < PARK_MIN_SIZE || ph < PARK_MIN_SIZE) return null;
  const k = W();
  const next = parkCount() + 1;
  k.parks = next;
  k[`park${next}x`] = px;
  k[`park${next}y`] = py;
  k[`park${next}w`] = pw;
  k[`park${next}h`] = ph;
  redraw();
  return next;
}

export function deletePark(index: number): boolean {
  const all: ParkRect[] = [];
  for (let i = 1; i <= parkCount(); i++) {
    const p = getPark(i);
    if (p && i !== index) all.push(p);
  }
  if (all.length === parkCount()) return false;
  const k = W();
  k.parks = all.length;
  all.forEach((p, i) => {
    const idx = i + 1;
    k[`park${idx}x`] = p.x;
    k[`park${idx}y`] = p.y;
    k[`park${idx}w`] = p.w;
    k[`park${idx}h`] = p.h;
  });
  redraw();
  return true;
}

/** Topmost park containing the point (+pad). */
export function findParkAt(px: number, py: number, pad = 4): { index: number } | null {
  for (let i = parkCount(); i >= 1; i--) {
    const p = getPark(i);
    if (!p) continue;
    if (px >= p.x - pad && px <= p.x + p.w + pad && py >= p.y - pad && py <= p.y + p.h + pad) {
      return { index: i };
    }
  }
  return null;
}

/* ---------- studio style settings ---------- */

export const TEXT_FONTS = ['Arial', 'Verdana', 'Trebuchet MS', 'Georgia', 'Courier New', 'Impact'];

export const STYLE_DEFAULTS = {
  textSize: 8,
  textColor: '#000000',
  textFont: 'Arial',
  canvasColor: '#ffffff',
  riverColor: '#2f80ed',
  riverWidth: 24,
  riverCurve: 6,
  parkColor: '#66bb6a',
  parkRadius: 0,
  parkBorderWidth: 0,
  parkBorderColor: '#000000',
  zoneColor: '#9333ea',
  zoneWidth: 4,
  seaColor: '#38bdf8',
  curve: 2,
};

function str(v: unknown, fallback: string): string {
  return typeof v === 'string' && v !== '' ? v : fallback;
}

export function getTextColor(): string {
  return str(W().mmsTextCol, STYLE_DEFAULTS.textColor);
}
export function getTextFont(): string {
  const f = str(W().mmsTextFont, STYLE_DEFAULTS.textFont);
  return TEXT_FONTS.includes(f) ? f : STYLE_DEFAULTS.textFont;
}
export function getCanvasColor(): string {
  return str(W().mmsCanvasCol, STYLE_DEFAULTS.canvasColor);
}
export function setTextColor(c: string): void {
  W().mmsTextCol = c;
  redraw();
}
export function setTextFont(f: string): void {
  W().mmsTextFont = f;
  redraw();
}
export function setCanvasColor(c: string): void {
  W().mmsCanvasCol = c;
  redraw();
}
export function getRiverColor(): string {
  return str(W().rivercol, STYLE_DEFAULTS.riverColor);
}
export function setRiverColor(c: string): void {
  W().rivercol = c;
  redraw();
}
export function getParkColor(): string {
  return str(W().parkcol, STYLE_DEFAULTS.parkColor);
}
export function setParkColor(c: string): void {
  W().parkcol = c;
  redraw();
}
export function getParkRadius(): number {
  const v = finite(W().parkradius);
  return v !== undefined && v >= 0 && v <= 200 ? Math.round(v) : STYLE_DEFAULTS.parkRadius;
}
export function setParkRadius(v: number): void {
  W().parkradius = Math.min(200, Math.max(0, Math.round(v) || 0));
  redraw();
}
export function getParkBorderWidth(): number {
  const v = finite(W().parkbwid);
  return v !== undefined && v >= 0 && v <= 20 ? Math.round(v) : STYLE_DEFAULTS.parkBorderWidth;
}
export function setParkBorderWidth(v: number): void {
  W().parkbwid = Math.min(20, Math.max(0, Math.round(v) || 0));
  redraw();
}
export function getParkBorderColor(): string {
  return str(W().parkbcol, STYLE_DEFAULTS.parkBorderColor);
}
export function setParkBorderColor(c: string): void {
  W().parkbcol = c;
  redraw();
}
export function getZoneColor(): string {
  return str(W().zonecol, STYLE_DEFAULTS.zoneColor);
}
export function setZoneColor(c: string): void {
  W().zonecol = c;
  redraw();
}
export function getZoneWidth(): number {
  const v = finite(W().zonewidth);
  return v !== undefined && v >= 1 && v <= 20 ? Math.round(v) : STYLE_DEFAULTS.zoneWidth;
}
export function setZoneWidth(v: number): void {
  W().zonewidth = Math.min(20, Math.max(1, Math.round(v) || STYLE_DEFAULTS.zoneWidth));
  redraw();
}
export function getSeaColor(): string {
  return str(W().seacol, STYLE_DEFAULTS.seaColor);
}
export function setSeaColor(c: string): void {
  W().seacol = c;
  redraw();
}

/* ---------- hidden-form mirrors ---------- */

function radioGroup(formName: string, group: string): HTMLInputElement[] {
  const form = document.forms.namedItem(formName) as HTMLFormElement | null;
  if (!form) return [];
  const el = form.elements.namedItem(group);
  if (!el) return [];
  if (el instanceof RadioNodeList) return [...el].filter((n): n is HTMLInputElement => n instanceof HTMLInputElement);
  return el instanceof HTMLInputElement ? [el] : [];
}

export function setStationOptions(dir: number, type: number): void {
  for (const r of radioGroup('frm3', 'qk')) r.checked = Number(r.value) === dir;
  for (const r of radioGroup('frm3', 'qkk')) r.checked = Number(r.value) === type;
}

/** Fallback so routechange() never throws if jscolor hasn't bound the hidden input. */
export function ensureColboxShim(): void {
  const input = document.getElementById('colbox') as (HTMLInputElement & { color?: unknown }) | null;
  if (!input || input.color) return;
  input.color = {
    fromString(hex: string) {
      const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
      if (m) input.value = `#${m[1]}`;
    },
  };
}

export function initAdapter(): void {
  wrapEngine();
  ensureColboxShim();
}
