import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import TopBar, { Brand } from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import CanvasStage from '../components/CanvasStage';
import { Button } from '../components/ui';
import {
  FiArrowLeft,
  FiMoon,
  FiRotateCcw,
  FiRotateCw,
  FiSettings,
  FiSun,
} from 'react-icons/fi';
import { ExportModal, LoadModal } from '../components/Modals';
import {
  applyLineColor,
  applyLineName,
  applyLineWidth,
  applyDprTransform,
  addPark,
  addSea,
  bootEngine,
  canvasEl,
  captureCode,
  commitRiverSeg,
  commitZoneSeg,
  createFreeText,
  createRoute,
  currentRoute,
  deleteCurrentRoute,
  deletePark,
  deleteRiver,
  deleteSea,
  deleteText,
  deleteZone,
  deviceDpr,
  duplicateText,
  engineBooted,
  engineReady,
  ensureLiveCanvas,
  findPillAt,
  findParkAt,
  findRiverAt,
  findSeaAt,
  findTextAt,
  findZoneAt,
  fitCanvasToContent,
  getCanvasColor,
  getCurve,
  getDprK,
  getFontSize,
  getLineBorder,
  getLineStyle,
  getMouseMode,
  getParkBorderColor,
  getParkBorderWidth,
  getParkColor,
  getParkRadius,
  getRiverColor,
  getRiverCurve,
  getRiverWidth,
  getSeaColor,
  getStation,
  getTextColor,
  getTextFont,
  getZoneColor,
  getZoneWidth,
  initAdapter,
  listRoutes,
  newBlankProject,
  notifyRoutes,
  numLines,
  previewSeaLines,
  redraw,
  restoreCode,
  riverDragUpdate,
  riverJunctionOk,
  riverSnapNetwork,
  riverStartFuse,
  riverStrandW,
  previewRiverStrands,
  selectRoute,
  setCanvasColor,
  setCanvasSize,
  setCurve,
  setDprK,
  setFontSize,
  setLineBorderColor,
  setLineBorderWidth,
  setLineStyle,
  setMouseMode,
  setParkBorderColor,
  setParkBorderWidth,
  setParkColor,
  setParkRadius,
  setSeaColor,
  setZoneColor,
  setZoneWidth,
  setRiverColor,
  setRiverCurve,
  setRiverWidth,
  setStationOptions,
  setStationW,
  setTextColor,
  setTextFont,
  setTextPos,
  setTool,
  setZoomK,
  shiftDrawing,
  splitRiverAtPoint,
  splitZoneAtPoint,
  stationCount,
  subscribeRoutes,
  whenReady,
  zoneDragUpdate,
  zoneSnapNetwork,
  zoneStartFuse,
  PILL_DEFAULT_W,
  PILL_MAX_W,
  PILL_MIN_W,
  LINE_BORDER_DEFAULT_COLOR,
  LINE_BORDER_MAX_W,
  SEA_LINE_W,
  STYLE_DEFAULTS,
  type LineStyle,
  type RiverDrag,
  type RouteInfo,
  type ToolMode,
} from '../engine/adapter';
import {
  DEFAULT_CANVAS,
  createProject,
  download,
  downloadBlob,
  exportFilename,
  getProject,
  pngFilename,
  updateProject,
  type CanvasSize,
} from '../app/store';
import { downloadPDF, downloadSVG } from '../engine/vector';
import SettingsModal from '../components/SettingsModal';
import TextInspector, { type TextSelection } from '../components/TextInspector';

interface EditorProps {
  projectId: string | null;
  sessionKey: string;
  onHome: () => void;
  onBound: (id: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

function fmtTime(ts: number): string {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function Editor({ projectId, sessionKey, onHome, onBound, theme, onToggleTheme }: EditorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [id, setId] = useState<string | null>(projectId);
  const [name, setName] = useState('Untitled');
  const [editingName, setEditingName] = useState(false);
  const [size, setSize] = useState<CanvasSize>({ ...DEFAULT_CANVAS });
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [current, setCurrent] = useState(1);
  const [lineName, setLineName] = useState('');
  const [lineColor, setLineColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(4);
  const [lineStyle, setLineStyleState] = useState<LineStyle>('solid');
  const [lineBorderColor, setLineBorderColorState] = useState(LINE_BORDER_DEFAULT_COLOR);
  const [lineBorderWidth, setLineBorderWidthState] = useState(0);
  const [curve, setCurveState] = useState(2);
  const [fontSize, setFontSizeState] = useState(8);
  const [textColor, setTextColorState] = useState(STYLE_DEFAULTS.textColor);
  const [textFont, setTextFontState] = useState(STYLE_DEFAULTS.textFont);
  const [canvasColor, setCanvasColorState] = useState(STYLE_DEFAULTS.canvasColor);
  const [riverColor, setRiverColorState] = useState(STYLE_DEFAULTS.riverColor);
  const [riverWidth, setRiverWidthState] = useState(STYLE_DEFAULTS.riverWidth);
  const [riverCurve, setRiverCurveState] = useState(STYLE_DEFAULTS.riverCurve);
  const [parkColor, setParkColorState] = useState(STYLE_DEFAULTS.parkColor);
  const [parkRadius, setParkRadiusState] = useState(STYLE_DEFAULTS.parkRadius);
  const [parkBorderWidth, setParkBorderWidthState] = useState(STYLE_DEFAULTS.parkBorderWidth);
  const [parkBorderColor, setParkBorderColorState] = useState(STYLE_DEFAULTS.parkBorderColor);
  const [zoneColor, setZoneColorState] = useState(STYLE_DEFAULTS.zoneColor);
  const [zoneWidth, setZoneWidthState] = useState(STYLE_DEFAULTS.zoneWidth);
  const [seaColor, setSeaColorState] = useState(STYLE_DEFAULTS.seaColor);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tool, setToolState] = useState<ToolMode>(1);
  const [stationDir, setStationDir] = useState(1);
  const [stationType, setStationType] = useState(1);
  const [pillWidth, setPillWidth] = useState(PILL_DEFAULT_W);
  const [zoomK, setZoomKState] = useState(1);
  const [dpr] = useState(() => deviceDpr());
  const [dirty, setDirty] = useState(false);
  const [saveLabel, setSaveLabel] = useState('Starting…');
  const [exportOpen, setExportOpen] = useState(false);
  const [exportCode, setExportCode] = useState('');
  const [loadOpen, setLoadOpen] = useState(false);
  const [textDraft, setTextDraft] = useState<{ x: number; y: number } | null>(null);
  const [textValue, setTextValue] = useState('');
  const [selText, setSelText] = useState<TextSelection | null>(null);
  const [, setVer] = useState(0);
  // mirrors so canvas listeners (attached once) never read stale state,
  // and so Enter + blur can never commit the same label twice
  const draftRef = useRef<{ x: number; y: number } | null>(null);
  draftRef.current = textDraft;
  const valueRef = useRef('');
  valueRef.current = textValue;
  const committingRef = useRef(false);
  const selRef = useRef<TextSelection | null>(null);
  selRef.current = selText;

  const pastRef = useRef<string[]>([]);
  const futureRef = useRef<string[]>([]);
  const appliedKey = useRef('');
  // live mirrors for canvas gesture handlers (attached once, never stale)
  const toolRef = useRef<ToolMode>(1);
  const stTypeRef = useRef(1);
  const pillWRef = useRef(PILL_DEFAULT_W);
  toolRef.current = tool;
  stTypeRef.current = stationType;
  pillWRef.current = pillWidth;
  const zoomRef = useRef(1);
  zoomRef.current = zoomK;
  const applyZoom = (k: number) => {
    const clamped = setZoomK(k);
    setZoomKState(clamped);
  };
  const sessionRef = useRef({ id, sessionKey });
  sessionRef.current = { id, sessionKey };

  const bump = () => setVer((v) => v + 1);

  const refresh = useCallback(() => {
    const list = listRoutes();
    const cur = currentRoute();
    setRoutes(list);
    setCurrent(cur);
    const info = list.find((r) => r.index === cur);
    if (document.activeElement?.id !== 'line-name') {
      setLineName(info?.label ?? `ROUTE ${cur}`);
    }
    setLineColor(info?.color ?? '#000000');
    setLineWidth(info?.width ?? 4);
    setLineStyleState(info?.style ?? getLineStyle(cur));
    const border = getLineBorder(cur);
    setLineBorderColorState(info?.borderColor ?? border.color);
    setLineBorderWidthState(info?.borderWidth ?? border.width);
    setCurveState(getCurve());
    setFontSizeState(getFontSize());
  }, []);

  const pushSnapshot = useCallback(() => {
    if (!engineBooted()) return;
    const code = captureCode();
    const past = pastRef.current;
    if (past.length > 0 && past[past.length - 1] === code) return;
    past.push(code);
    if (past.length > 100) past.shift();
    futureRef.current = [];
    setDirty(true);
    setSaveLabel('Unsaved changes');
    bump();
  }, []);

  const restoreSnapshot = useCallback(
    (code: string) => {
      restoreCode(code);
      refresh();
      notifyRoutes();
    },
    [refresh],
  );

  const undo = useCallback(() => {
    const past = pastRef.current;
    if (past.length <= 1) return;
    const cur = past.pop()!;
    futureRef.current.push(cur);
    restoreSnapshot(past[past.length - 1]);
    setDirty(true);
    setSaveLabel('Unsaved changes');
    bump();
  }, [restoreSnapshot]);

  const redo = useCallback(() => {
    const fut = futureRef.current;
    if (fut.length === 0) return;
    const nxt = fut.pop()!;
    pastRef.current.push(nxt);
    restoreSnapshot(nxt);
    setDirty(true);
    setSaveLabel('Unsaved changes');
    bump();
  }, [restoreSnapshot]);

  /* session bootstrap (runs once per sessionKey, engine boots once per app) */
  useEffect(() => {
    initAdapter();
    bootEngine();
    ensureLiveCanvas();
    setDprK(dpr);
    const key = sessionKey;
    whenReady(() => {
      if (appliedKey.current === key) return;
      appliedKey.current = key;
      ensureLiveCanvas();
      const s = sessionRef.current;
      const p = s.id ? getProject(s.id) : null;
      let needsSave = false;
      if (p) {
        setId(p.id);
        setName(p.name);
        setCanvasSize(p.canvas.w, p.canvas.h);
        setSize({ ...p.canvas });
        if (p.code) {
          restoreCode(p.code);
          setSaveLabel(`Saved ${fmtTime(p.updatedAt)}`);
        } else {
          newBlankProject();
          setSaveLabel('Blank canvas — press Save');
          needsSave = true;
        }
      } else {
        setId(null);
        newBlankProject();
        setName('Untitled');
        setCanvasSize(DEFAULT_CANVAS.w, DEFAULT_CANVAS.h);
        setSize({ ...DEFAULT_CANVAS });
        setSaveLabel('Scratch — press Save to keep it');
        needsSave = true;
        setTextColor(STYLE_DEFAULTS.textColor);
        setTextFont(STYLE_DEFAULTS.textFont);
        setCanvasColor(STYLE_DEFAULTS.canvasColor);
        setRiverColor(STYLE_DEFAULTS.riverColor);
        setRiverWidth(STYLE_DEFAULTS.riverWidth);
        setRiverCurve(STYLE_DEFAULTS.riverCurve);
        setParkColor(STYLE_DEFAULTS.parkColor);
        setParkRadius(STYLE_DEFAULTS.parkRadius);
        setParkBorderWidth(STYLE_DEFAULTS.parkBorderWidth);
        setParkBorderColor(STYLE_DEFAULTS.parkBorderColor);
        setZoneColor(STYLE_DEFAULTS.zoneColor);
        setZoneWidth(STYLE_DEFAULTS.zoneWidth);
        setSeaColor(STYLE_DEFAULTS.seaColor);
        setCurve(STYLE_DEFAULTS.curve);
        setFontSize(STYLE_DEFAULTS.textSize);
      }
      setTextColorState(getTextColor());
      setTextFontState(getTextFont());
      setCanvasColorState(getCanvasColor());
      setRiverColorState(getRiverColor());
      setRiverWidthState(getRiverWidth());
      setRiverCurveState(getRiverCurve());
      setParkColorState(getParkColor());
      setParkRadiusState(getParkRadius());
      setParkBorderWidthState(getParkBorderWidth());
      setParkBorderColorState(getParkBorderColor());
      setZoneColorState(getZoneColor());
      setZoneWidthState(getZoneWidth());
      setSeaColorState(getSeaColor());
      setTool(1);
      setToolState(1);
      setStationOptions(1, 1);
      setStationDir(1);
      setStationType(1);
      setPillWidth(PILL_DEFAULT_W);
      setExportOpen(false);
      setLoadOpen(false);
      setEditingName(false);
      pastRef.current = [captureCode()];
      futureRef.current = [];
      setDirty(needsSave);
      refresh();
      bump();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey]);

  /* live route sync from the engine */
  useEffect(() => subscribeRoutes(refresh), [refresh]);

  /* snapshots after each gesture (deferred: the engine handles the event first).
     Pill fixup: freshly placed pills get the panel width before the snapshot.
     Pill stretch: pointerdown precedes the engine's mousedown, so a grab on a
     pill can swallow the engine gesture and drive the width instead. */
  useEffect(() => {
    const canvas = canvasEl();
    if (!canvas) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const afterGesture = () => {
      if (toolRef.current === 3 && stTypeRef.current === 6 && engineBooted()) {
        const cur = currentRoute();
        const idx = stationCount(cur);
        if (idx > 0) {
          const s = getStation(cur, idx);
          if (s && s.type === 6 && s.w === undefined) {
            setStationW(cur, idx, pillWRef.current);
            redraw();
          }
        }
      }
      pushSnapshot();
    };
    const onUp = () => {
      // Pan/text/river/park/zone/sea manage their own snapshots (pushing only
      // when something actually changed). Running the generic captureCode here
      // would serialize the whole drawing on clicks that changed nothing.
      if (
        toolRef.current === 5 ||
        toolRef.current === 6 ||
        toolRef.current === 7 ||
        toolRef.current === 8 ||
        toolRef.current === 9 ||
        toolRef.current === 10
      )
        return;
      clearTimeout(timer);
      timer = setTimeout(afterGesture, 0);
    };
    const onPointerDown = (ev: PointerEvent) => {
      if (!engineBooted()) return;
      if (ev.button === 1) {
        // middle button = comfortable scroll: move the viewport, touch no data.
        // Runs before the engine's mousedown, which is swallowed via idle mode.
        ev.preventDefault();
        const vp = viewportRef.current;
        const prevMode = getMouseMode();
        setMouseMode(0);
        const startX = ev.clientX;
        const startY = ev.clientY;
        const startLeft = vp?.scrollLeft ?? 0;
        const startTop = vp?.scrollTop ?? 0;
        const onMove = (m: PointerEvent) => {
          if (!vp) return;
          vp.scrollLeft = startLeft - (m.clientX - startX);
          vp.scrollTop = startTop - (m.clientY - startY);
        };
        const onPointerUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onPointerUp);
          setMouseMode(prevMode);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onPointerUp);
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const zk0 = zoomRef.current;
      const px = (ev.clientX - rect.left) / zk0;
      const py = (ev.clientY - rect.top) / zk0;
      if (toolRef.current === 2) {
        // Erase parks/seas/zones/rivers first (the engine only knows tracks);
        // tracks fall through to the legacy gesture untouched.
        const parkHit = findParkAt(px, py);
        if (parkHit) {
          setMouseMode(0);
          if (deletePark(parkHit.index)) {
            refresh();
            pushSnapshot();
          }
          setTimeout(() => setTool(2), 0);
          return;
        }
        const seaHit = findSeaAt(px, py);
        if (seaHit) {
          setMouseMode(0);
          if (deleteSea(seaHit.index)) {
            refresh();
            pushSnapshot();
          }
          setTimeout(() => setTool(2), 0);
          return;
        }
        const zoneHit = findZoneAt(px, py);
        if (zoneHit) {
          setMouseMode(0);
          if (deleteZone(zoneHit.kind, zoneHit.index)) {
            refresh();
            pushSnapshot();
          }
          setTimeout(() => setTool(2), 0);
          return;
        }
        const riverHit = findRiverAt(px, py);
        if (riverHit) {
          setMouseMode(0);
          if (deleteRiver(riverHit.kind, riverHit.index)) {
            refresh();
            pushSnapshot();
          }
          setTimeout(() => setTool(2), 0);
          return;
        }
        return;
      }
      if (toolRef.current === 3) {
        const hit = findPillAt(px, py);
        if (!hit) return;
        setMouseMode(0); // swallow the engine gesture that follows
        const startX = ev.clientX;
        const startY = ev.clientY;
        const startW = hit.w;
        const zk = zoomRef.current;
        const onMove = (m: PointerEvent) => {
          const along = ((m.clientX - startX) * hit.ux + (m.clientY - startY) * hit.uy) / zk;
          const w = Math.min(PILL_MAX_W, Math.max(PILL_MIN_W, startW + along));
          setStationW(hit.route, hit.index, Math.round(w));
          redraw();
        };
        const onPointerUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onPointerUp);
          setTool(3);
          pushSnapshot();
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onPointerUp);
        return;
      }
      if (toolRef.current === 6) {
        // Pan: drag with left button to move the whole drawing in block.
        // The legacy kernel has no mode 6, so swallowing via idle mode is enough.
        setMouseMode(0);
        ev.preventDefault();
        try {
          canvas.setPointerCapture(ev.pointerId);
        } catch {
          /* older browsers: window listeners below still track the drag */
        }
        canvas.style.cursor = 'grabbing';
        const zk = zoomRef.current;
        let lastX = ev.clientX;
        let lastY = ev.clientY;
        let moved = false;
        const onMove = (m: PointerEvent) => {
          const dx = (m.clientX - lastX) / zk;
          const dy = (m.clientY - lastY) / zk;
          lastX = m.clientX;
          lastY = m.clientY;
          if (!dx && !dy) return;
          const applied = shiftDrawing(dx, dy);
          if (applied.dx || applied.dy) moved = true;
        };
        const onPointerUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onPointerUp);
          canvas.style.cursor = toolRef.current === 6 ? 'grab' : '';
          setTool(6);
          if (moved) pushSnapshot();
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onPointerUp);
        return;
      }
      if (toolRef.current === 7) {
        // River: same gesture as Draw — press, drag for an axis/diagonal
        // segment with live preview, release to commit. Chains onto river ends.
        setMouseMode(0);
        ev.preventDefault();
        const zk = zoomRef.current;
        const c0 = canvasEl();
        const dpr0 = getDprK();
        const mapW = (c0?.width ?? 1600) / dpr0;
        const mapH = (c0?.height ?? 1200) / dpr0;
        const clampPt = (x: number, y: number) => ({
          x: Math.min(mapW, Math.max(0, x)),
          y: Math.min(mapH, Math.max(0, y)),
        });
        const s0 = clampPt(px, py);
        const snapStart = riverSnapNetwork(s0.x, s0.y);
        // effective start follows the snap, unless it would join at 90°:
        // then the segment stays free (crossings never fuse)
        let base = { x: snapStart.x, y: snapStart.y };
        let cur: RiverDrag = { angle: 0, eendx: base.x, eendy: base.y, mooaaa: 0, endSnapped: false };
        let startFused = riverStartFuse(base.x, base.y, s0.x, s0.y, 0).fused;
        const paint = () => {
          redraw();
          const ctx = canvasEl()?.getContext('2d');
          if (!ctx) return;
          const ring = (x: number, y: number, fused: boolean) => {
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.lineWidth = 5;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.lineWidth = 2;
            ctx.strokeStyle = fused ? '#4f46e5' : '#a1a1aa';
            ctx.stroke();
          };
          // anchor: indigo = will fuse at 45°/collinear, grey = free point
          ring(base.x, base.y, startFused);
          if (cur.angle < 1) return;
          ctx.strokeStyle = getRiverColor();
          ctx.lineWidth = riverStrandW();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          for (const strand of previewRiverStrands(base.x, base.y, cur.eendx, cur.eendy)) {
            if (strand.length < 2) continue;
            ctx.beginPath();
            ctx.moveTo(strand[0].x, strand[0].y);
            for (let k = 1; k < strand.length; k++) ctx.lineTo(strand[k].x, strand[k].y);
            ctx.stroke();
          }
          if (cur.endSnapped) ring(cur.eendx, cur.eendy, true);
        };
        paint();
        const onMove = (m: PointerEvent) => {
          const r = canvas.getBoundingClientRect();
          const c = clampPt((m.clientX - r.left) / zk, (m.clientY - r.top) / zk);
          const res = riverStartFuse(snapStart.x, snapStart.y, s0.x, s0.y, -1);
          // resolve the angle first from the snapped geometry, then validate
          let next = riverDragUpdate(res.x, res.y, c.x, c.y);
          if (!next) return;
          const fin = riverStartFuse(res.x, res.y, s0.x, s0.y, next.angle);
          if (fin.x !== res.x || fin.y !== res.y) {
            next = riverDragUpdate(fin.x, fin.y, c.x, c.y);
            if (!next) return;
          }
          base = { x: fin.x, y: fin.y };
          cur = next;
          startFused = fin.fused;
          paint();
        };
        const onPointerUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onPointerUp);
          setTool(7);
          if (commitRiverSeg(base.x, base.y, cur)) {
            // fuse only validated 45°/collinear joints
            if (startFused && riverJunctionOk(cur.angle, base.x, base.y)) {
              splitRiverAtPoint(base.x, base.y);
            }
            if (cur.endSnapped) {
              splitRiverAtPoint(cur.eendx, cur.eendy);
            }
            refresh();
            pushSnapshot();
          } else {
            redraw();
          }
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onPointerUp);
        return;
      }
      if (toolRef.current === 8) {
        // Park: drag a rectangle; preview fills live, commit on release.
        setMouseMode(0);
        ev.preventDefault();
        const zk = zoomRef.current;
        const x0 = px;
        const y0 = py;
        let cur = { x: px, y: py };
        const paint = () => {
          redraw();
          const ctx = canvasEl()?.getContext('2d');
          if (!ctx) return;
          const rx = Math.min(x0, cur.x);
          const ry = Math.min(y0, cur.y);
          const rw = Math.abs(cur.x - x0);
          const rh = Math.abs(cur.y - y0);
          const rr = Math.min(getParkRadius(), rw / 2, rh / 2);
          const bw = getParkBorderWidth();
          const trace = () => {
            const c = ctx as CanvasRenderingContext2D & { roundRect?: (...a: number[]) => void };
            if (rr > 0 && typeof c.roundRect === 'function') {
              ctx.beginPath();
              c.roundRect(rx, ry, rw, rh, rr);
            } else {
              ctx.beginPath();
              ctx.rect(rx, ry, rw, rh);
            }
          };
          ctx.fillStyle = getParkColor();
          try {
            ctx.globalAlpha = 0.55;
          } catch {
            /* stub contexts in tests */
          }
          trace();
          ctx.fill();
          try {
            ctx.globalAlpha = 1;
          } catch {
            /* stub contexts in tests */
          }
          ctx.lineWidth = bw > 0 ? bw : 2;
          ctx.strokeStyle = bw > 0 ? getParkBorderColor() : getParkColor();
          trace();
          ctx.stroke();
        };
        paint();
        const onMove = (m: PointerEvent) => {
          const r = canvas.getBoundingClientRect();
          cur = { x: (m.clientX - r.left) / zk, y: (m.clientY - r.top) / zk };
          paint();
        };
        const onPointerUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onPointerUp);
          setTool(8);
          if (addPark(x0, y0, cur.x - x0, cur.y - y0)) {
            refresh();
            pushSnapshot();
          } else {
            redraw();
          }
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onPointerUp);
        return;
      }
      if (toolRef.current === 9) {
        // Zone: same Draw-style gesture as rivers/tracks, dotted preview.
        // No angle restriction: zones fuse with their network at any angle.
        setMouseMode(0);
        ev.preventDefault();
        const zk = zoomRef.current;
        const c0 = canvasEl();
        const dpr0 = getDprK();
        const mapW = (c0?.width ?? 1600) / dpr0;
        const mapH = (c0?.height ?? 1200) / dpr0;
        const clampPt = (x: number, y: number) => ({
          x: Math.min(mapW, Math.max(0, x)),
          y: Math.min(mapH, Math.max(0, y)),
        });
        const s0 = clampPt(px, py);
        const snapStart = zoneSnapNetwork(s0.x, s0.y);
        let base = { x: snapStart.x, y: snapStart.y };
        let cur: RiverDrag = { angle: 0, eendx: base.x, eendy: base.y, mooaaa: 0, endSnapped: false };
        let startFused = zoneStartFuse(base.x, base.y).fused;
        const paint = () => {
          redraw();
          const ctx = canvasEl()?.getContext('2d');
          if (!ctx) return;
          const ring = (x: number, y: number, fused: boolean) => {
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.lineWidth = 5;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.lineWidth = 2;
            ctx.strokeStyle = fused ? '#4f46e5' : '#a1a1aa';
            ctx.stroke();
          };
          ring(base.x, base.y, startFused);
          if (cur.angle < 1) return;
          ctx.strokeStyle = getZoneColor();
          ctx.lineWidth = getZoneWidth();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          try {
            ctx.setLineDash([0.1, getZoneWidth() * 2.2]);
          } catch {
            /* stub contexts in tests */
          }
          ctx.beginPath();
          ctx.moveTo(base.x, base.y);
          ctx.lineTo(cur.eendx, cur.eendy);
          ctx.stroke();
          try {
            ctx.setLineDash([]);
          } catch {
            /* stub contexts in tests */
          }
          if (cur.endSnapped) ring(cur.eendx, cur.eendy, true);
        };
        paint();
        const onMove = (m: PointerEvent) => {
          const r = canvas.getBoundingClientRect();
          const c = clampPt((m.clientX - r.left) / zk, (m.clientY - r.top) / zk);
          const next = zoneDragUpdate(base.x, base.y, c.x, c.y);
          if (!next) return;
          cur = next;
          startFused = zoneStartFuse(base.x, base.y).fused;
          paint();
        };
        const onPointerUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onPointerUp);
          setTool(9);
          if (commitZoneSeg(base.x, base.y, cur)) {
            if (startFused) splitZoneAtPoint(base.x, base.y);
            if (cur.endSnapped) splitZoneAtPoint(cur.eendx, cur.eendy);
            refresh();
            pushSnapshot();
          } else {
            redraw();
          }
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onPointerUp);
        return;
      }
      if (toolRef.current === 10) {
        // Sea: drag a rectangle; preview hatches live, commit on release.
        setMouseMode(0);
        ev.preventDefault();
        const zk = zoomRef.current;
        const x0 = px;
        const y0 = py;
        let cur = { x: px, y: py };
        const paint = () => {
          redraw();
          const ctx = canvasEl()?.getContext('2d');
          if (!ctx) return;
          ctx.strokeStyle = getSeaColor();
          ctx.lineWidth = SEA_LINE_W;
          ctx.lineCap = 'round';
          for (const l of previewSeaLines(x0, y0, cur.x, cur.y)) {
            ctx.beginPath();
            ctx.moveTo(l.ax, l.ay);
            ctx.lineTo(l.bx, l.by);
            ctx.stroke();
          }
          ctx.lineWidth = 1;
          try {
            ctx.setLineDash([6, 4]);
          } catch {
            /* stub contexts in tests */
          }
          ctx.strokeRect(Math.min(x0, cur.x), Math.min(y0, cur.y), Math.abs(cur.x - x0), Math.abs(cur.y - y0));
          try {
            ctx.setLineDash([]);
          } catch {
            /* stub contexts in tests */
          }
        };
        paint();
        const onMove = (m: PointerEvent) => {
          const r = canvas.getBoundingClientRect();
          cur = { x: (m.clientX - r.left) / zk, y: (m.clientY - r.top) / zk };
          paint();
        };
        const onPointerUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onPointerUp);
          setTool(10);
          if (addSea(x0, y0, cur.x, cur.y)) {
            refresh();
            pushSnapshot();
          } else {
            redraw();
          }
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onPointerUp);
        return;
      }
      if (toolRef.current === 5) {
        // Inline label flow (no prompt): drag existing labels, click empty
        // space to open an inline editor anchored to the click point.
        // Always swallow the legacy mousedown so its prompt() never fires.
        setMouseMode(0);
        // If an editor is already open, let blur commit it; ignore this click
        // so the pending text is never lost.
        if (draftRef.current) return;
        const hit = findTextAt(px, py);
        if (!hit) {
          const c = canvasEl();
          const cw = c?.width ?? 1600;
          const ch = c?.height ?? 1200;
          const cx = Math.min(cw, Math.max(0, Math.round(px)));
          const cy = Math.min(ch, Math.max(0, Math.round(py)));
          committingRef.current = false;
          // Paint synchronously so the input is visible in this same frame,
          // before mouseup / any deferred work runs.
          flushSync(() => {
            setTextValue('');
            setTextDraft({ x: cx, y: cy });
          });
          setTool(5);
          return;
        }
        const zk = zoomRef.current;
        const startCX = ev.clientX;
        const startCY = ev.clientY;
        let dragging = false;
        const onMove = (m: PointerEvent) => {
          if (!dragging && Math.hypot(m.clientX - startCX, m.clientY - startCY) < 4) return;
          dragging = true;
          const r = canvas.getBoundingClientRect();
          setTextPos(
            hit.route,
            hit.index,
            (m.clientX - r.left - hit.dx * zk) / zk,
            (m.clientY - r.top - hit.dy * zk) / zk,
          );
          redraw();
        };
        const onPointerUp = (u: PointerEvent) => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onPointerUp);
          setTool(5);
          if (!dragging) {
            // plain left-click on a label: open its inspector instead of moving
            const sx = Math.min(window.innerWidth - 280, Math.max(8, u.clientX - 130));
            const sy = Math.max(8, u.clientY + 10);
            setSelText({ route: hit.route, index: hit.index, sx, sy });
            return;
          }
          pushSnapshot();
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onPointerUp);
        return;
      }
      };
    canvas.addEventListener('mouseup', onUp);
    canvas.addEventListener('pointerdown', onPointerDown);
    // middle-click autoscroll starts on mousedown default: block it (capture)
    const onMouseDownCapture = (e: MouseEvent) => {
      if (e.button === 1) e.preventDefault();
    };
    canvas.addEventListener('mousedown', onMouseDownCapture, true);
    return () => {
      clearTimeout(timer);
      canvas.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('mousedown', onMouseDownCapture, true);
    };
  }, [pushSnapshot]);

  /* tool + station mirrors (booted, not idle: modes change constantly) */
  useEffect(() => {
    if (engineBooted()) setTool(tool);
    const c = canvasEl();
    if (c) c.style.cursor = tool === 6 ? 'grab' : '';
  }, [tool]);
  /* React re-asserts the canvas width/height attrs when `size` commits, and
     any width write resets the bitmap + transform — repaint right after so
     opening a project (different canvas size) never lands on a blank sheet.
     engineReady (not just booted): drawmap exists before moo() finishes and
     would throw on missing globals. */
  useEffect(() => {
    applyDprTransform();
    if (engineReady()) redraw();
  }, [size.w, size.h, dpr]);
  useEffect(() => {
    if (engineBooted()) setStationOptions(stationDir, stationType);
  }, [stationDir, stationType]);

  const commitName = () => {
    pushSnapshot();
  };

  const save = useCallback(() => {
    if (!engineBooted()) return;
    const code = captureCode();
    if (id) {
      const p = updateProject(id, { code, canvas: size });
      if (p) {
        setName(p.name);
        setSaveLabel(`Saved ${fmtTime(p.updatedAt)}`);
      }
    } else {
      const p = createProject(name === 'Untitled' ? 'Untitled plan' : name, code, size);
      setId(p.id);
      setName(p.name);
      setSaveLabel(`Saved ${fmtTime(p.updatedAt)}`);
      onBound(p.id);
    }
    pastRef.current = [code];
    futureRef.current = [];
    setDirty(false);
    bump();
  }, [id, name, size, onBound]);

  /* shortcuts */
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (!(ev.ctrlKey || ev.metaKey)) return;
      const k = (ev.key || '').toLowerCase();
      if (k === 's') {
        // direct save, even while typing in a field
        ev.preventDefault();
        save();
        return;
      }
      const wantUndo = !ev.shiftKey && k === 'z';
      const wantRedo = k === 'y' || (ev.shiftKey && k === 'z');
      if (!wantUndo && !wantRedo) return;
      const t = ev.target as HTMLElement | null;
      const tag = t?.tagName?.toUpperCase();
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t?.isContentEditable) return;
      ev.preventDefault();
      if (wantUndo) undo();
      else redo();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [undo, redo, save]);

  /** PNG export at any scale: the kernel redraws into an offscreen canvas with a
   *  matching transform, so 2x/4x are true vector-sharp renders, not upscales. */
  const exportPNG = (scale: number) => {
    const src = canvasRef.current ?? canvasEl();
    if (!src || !engineBooted()) return;
    const k = scale === 4 ? 4 : scale === 2 ? 2 : 1;
    const dpr = getDprK();
    const mapW = Math.max(1, Math.round(src.width / dpr));
    const mapH = Math.max(1, Math.round(src.height / dpr));
    if (k === 1) {
      const file = pngFilename(name);
      const save = (blob: Blob | null) => {
        if (blob) downloadBlob(file, blob);
        else {
          const a = document.createElement('a');
          a.href = src.toDataURL('image/png');
          a.download = file;
          a.click();
        }
      };
      if (typeof src.toBlob === 'function') src.toBlob(save, 'image/png');
      else save(null);
      return;
    }
    const out = document.createElement('canvas');
    out.width = mapW * k;
    out.height = mapH * k;
    const octx = out.getContext('2d');
    if (!octx) return;
    const w = window as unknown as Record<string, unknown>;
    const prevCanvas = w.canvas;
    const prevCtx = w.ctx;
    try {
      w.canvas = out;
      w.ctx = octx;
      octx.setTransform(k, 0, 0, k, 0, 0);
      redraw();
    } finally {
      w.canvas = prevCanvas;
      w.ctx = prevCtx;
      applyDprTransform();
    }
    const file = pngFilename(name).replace(/\.png$/, `@${k}x.png`);
    out.toBlob(
      (blob) => {
        if (blob) downloadBlob(file, blob);
      },
      'image/png',
    );
  };

  const rename = (v: string) => {
    const label = v.trim() || 'Untitled';
    setName(label);
    if (id) updateProject(id, { name: label });
  };

  const resize = (w: number, h: number) => {
    // map units throughout: canvasEl().width is backing store (×dpr)
    const next = {
      w: Math.min(4000, Math.max(200, Math.round(w))),
      h: Math.min(4000, Math.max(200, Math.round(h))),
    };
    setCanvasSize(next.w, next.h);
    setSize(next);
    setDirty(true);
    setSaveLabel('Unsaved changes');
  };

  const fit = () => {
    const next = fitCanvasToContent();
    setSize(next);
    setDirty(true);
    setSaveLabel('Unsaved changes');
  };

  const commitTextDraft = useCallback(() => {
    if (committingRef.current) return;
    const d = draftRef.current;
    if (!d) return;
    committingRef.current = true;
    const v = valueRef.current.trim();
    // 1) paint first: close the editor and draw the label synchronously so
    // the next frame already shows it.
    flushSync(() => {
      setTextDraft(null);
      setTextValue('');
    });
    setTool(5);
    let placed = false;
    if (v && engineBooted()) {
      placed = createFreeText(currentRoute(), d.x, d.y, v) != null;
    }
    // 2) heavy work (route list + full-code snapshot for undo) deferred so it
    // never blocks the paint of the new label.
    setTimeout(() => {
      if (placed) {
        refresh();
        pushSnapshot();
      }
      committingRef.current = false;
    }, 0);
  }, [refresh, pushSnapshot]);

  const cancelTextDraft = useCallback(() => {
    if (!draftRef.current) return;
    setTextDraft(null);
    setTextValue('');
    setTool(5);
  }, []);

  const closeInspector = useCallback(
    (changed: boolean) => {
      if (!selRef.current) return;
      setSelText(null);
      setTool(5);
      if (changed) {
        refresh();
        pushSnapshot();
      }
    },
    [refresh, pushSnapshot],
  );

  const duplicateInspector = useCallback(() => {
    const s = selRef.current;
    if (!s) return;
    const n = duplicateText(s.route, s.index);
    if (n) {
      refresh();
      pushSnapshot();
      setSelText({
        route: s.route,
        index: n,
        sx: Math.min(window.innerWidth - 280, Math.max(8, s.sx + 24)),
        sy: s.sy + 24,
      });
    }
  }, [refresh, pushSnapshot]);

  const deleteInspector = useCallback(() => {
    const s = selRef.current;
    if (!s) return;
    setSelText(null);
    setTool(5);
    if (deleteText(s.route, s.index)) {
      refresh();
      pushSnapshot();
    }
  }, [refresh, pushSnapshot]);

  const activeRoute = routes.find((r) => r.index === current);

  const handleTool = useCallback(
    (t: ToolMode) => {
      // An open text inspector holds live-applied edits: snapshot once, close.
      if (selRef.current) {
        setSelText(null);
        refresh();
        pushSnapshot();
      }
      // Switching away from Text with a pending editor: keep what was typed.
      // Same instant-place pattern: draw now, snapshot after paint.
      if (toolRef.current === 5 && t !== 5 && draftRef.current) {
        const d = draftRef.current;
        const v = valueRef.current.trim();
        flushSync(() => {
          setTextDraft(null);
          setTextValue('');
        });
        let placed = false;
        if (v && engineBooted()) {
          placed = createFreeText(currentRoute(), d.x, d.y, v) != null;
        }
        setToolState(t);
        if (placed) {
          setTimeout(() => {
            refresh();
            pushSnapshot();
          }, 0);
        }
        return;
      }
      setToolState(t);
    },
    [refresh, pushSnapshot],
  );

  /* single-key tool shortcuts (ignored while typing anywhere) */
  useEffect(() => {
    const KEYS: Record<string, ToolMode> = { d: 1, e: 2, s: 3, r: 4, t: 5, h: 6, v: 7, p: 8, z: 9, m: 10 };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const t = ev.target as HTMLElement | null;
      const tag = t?.tagName?.toUpperCase();
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t?.isContentEditable;
      if (selRef.current && ev.key === 'Escape' && !typing) {
        ev.preventDefault();
        closeInspector(true);
        return;
      }
      if (typing) return;
      if (draftRef.current || selRef.current) return;
      const k = (ev.key || '').toLowerCase();
      const mode = KEYS[k];
      if (!mode) return;
      ev.preventDefault();
      handleTool(mode);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [handleTool, closeInspector]);

  return (
    <div className="flex h-full flex-col">
      <TopBar
        left={
          <>
            <Brand sub="Editor" />
            <button
              type="button"
              onClick={onHome}
              className="ml-1 flex items-center gap-1 rounded-md px-2 py-1 text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <FiArrowLeft size={14} /> Library
            </button>
            {editingName ? (
              <input
                autoFocus
                defaultValue={name}
                onBlur={(e) => {
                  rename(e.target.value);
                  setEditingName(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                  if (e.key === 'Escape') setEditingName(false);
                }}
                className="h-7 w-44 rounded-md border border-indigo-500 bg-white px-2 text-[13px] outline-none dark:bg-zinc-950"
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditingName(true)}
                title="Rename project"
                className="flex max-w-52 items-center gap-1.5 truncate rounded-md px-2 py-1 text-[13px] font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <span className="truncate">{name}</span>
                {dirty && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" title="Unsaved changes" />}
              </button>
            )}
          </>
        }
        right={
          <>
            <Button size="sm" onClick={undo} disabled={pastRef.current.length <= 1} title="Undo (Ctrl+Z)">
              <FiRotateCcw size={14} />
            </Button>
            <Button size="sm" onClick={redo} disabled={futureRef.current.length === 0} title="Redo (Ctrl+Y)">
              <FiRotateCw size={14} />
            </Button>
            <Button size="sm" onClick={() => setLoadOpen(true)}>
              Load
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setExportCode(captureCode());
                setExportOpen(true);
              }}
            >
              Export
            </Button>
            <Button size="sm" variant="primary" onClick={save}>
              Save
            </Button>
            <Button size="sm" onClick={() => setSettingsOpen(true)} title="Settings">
              <FiSettings size={14} />
            </Button>
            <Button size="sm" onClick={onToggleTheme} title="Toggle dark / light mode">
              {theme === 'dark' ? <FiSun size={14} /> : <FiMoon size={14} />}
            </Button>
          </>
        }
      />
      <div className="flex min-h-0 flex-1">
        <Sidebar
          routes={routes}
          current={current}
          onSelectRoute={(i) => {
            selectRoute(i);
            refresh();
          }}
          onCreateRoute={() => {
            createRoute();
            refresh();
            pushSnapshot();
          }}
          onDeleteRoute={() => {
            if (numLines() <= 0) return;
            deleteCurrentRoute();
            refresh();
            pushSnapshot();
          }}
          lineName={lineName}
          onLineName={(v) => {
            setLineName(v);
            applyLineName(current, v.trim() || `ROUTE ${current}`);
            notifyRoutes();
          }}
          onLineNameCommit={commitName}
          lineColor={lineColor}
          onLineColor={(v) => {
            setLineColor(v);
            applyLineColor(current, v);
            notifyRoutes();
            pushSnapshot();
          }}
          lineWidth={lineWidth}
          onLineWidth={(v) => {
            setLineWidth(v);
            applyLineWidth(current, v);
            notifyRoutes();
            pushSnapshot();
          }}
          lineStyle={lineStyle}
          onLineStyle={(v) => {
            setLineStyleState(v);
            setLineStyle(current, v);
            notifyRoutes();
            pushSnapshot();
          }}
          lineBorderColor={lineBorderColor}
          onLineBorderColor={(v) => {
            setLineBorderColorState(v);
            setLineBorderColor(current, v);
            notifyRoutes();
            pushSnapshot();
          }}
          lineBorderWidth={lineBorderWidth}
          onLineBorderWidth={(v) => {
            const clamped = Math.min(LINE_BORDER_MAX_W, Math.max(0, Math.floor(v) || 0));
            setLineBorderWidthState(clamped);
            setLineBorderWidth(current, clamped);
            notifyRoutes();
            pushSnapshot();
          }}
          tool={tool}
          onTool={handleTool}
          stationDir={stationDir}
          onStationDir={setStationDir}
          stationType={stationType}
          onStationType={setStationType}
          pillWidth={pillWidth}
          onPillWidth={setPillWidth}
        />
        <CanvasStage
          canvasRef={canvasRef}
          viewportRef={viewportRef}
          size={size}
          canvasBg={canvasColor}
          zoomK={zoomK}
          onZoomIn={() => applyZoom(zoomK * 1.25)}
          onZoomOut={() => applyZoom(zoomK / 1.25)}
          onZoomReset={() => applyZoom(1)}
          onResize={resize}
          onFitGrow={fit}
          cursorColor={activeRoute?.color ?? '#4f46e5'}
          dpr={dpr}
          textDraft={textDraft}
          textValue={textValue}
          onTextValue={setTextValue}
          onTextCommit={commitTextDraft}
          onTextCancel={cancelTextDraft}
          textFont={textFont}
          textColor={textColor}
          textSizePt={fontSize}
        />
      </div>
      <footer className="flex h-7 shrink-0 items-center gap-3 border-t border-zinc-200 bg-white px-3 text-[11px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <span>{saveLabel}</span>
        <span className="ml-auto tabular-nums">
          {Math.round(zoomK * 100)}% · {size.w} × {size.h} ·{' '}
          {routes.length === 1 ? '1 route' : `${routes.length} routes`}
        </span>
        <span className="hidden sm:inline">Tools D E S R T H V P Z M · Ctrl+S guardar · Ctrl+Z undo</span>
      </footer>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        textSize={fontSize}
        onTextSize={(v) => {
          setFontSizeState(v);
          setFontSize(v);
          pushSnapshot();
        }}
        textColor={textColor}
        onTextColor={(v) => {
          setTextColorState(v);
          setTextColor(v);
          pushSnapshot();
        }}
        textFont={textFont}
        onTextFont={(v) => {
          setTextFontState(v);
          setTextFont(v);
          pushSnapshot();
        }}
        canvasColor={canvasColor}
        onCanvasColor={(v) => {
          setCanvasColorState(v);
          setCanvasColor(v);
          pushSnapshot();
        }}
        riverColor={riverColor}
        onRiverColor={(v) => {
          setRiverColorState(v);
          setRiverColor(v);
          pushSnapshot();
        }}
        riverWidth={riverWidth}
        onRiverWidth={(v) => {
          setRiverWidthState(v);
          setRiverWidth(v);
          pushSnapshot();
        }}
        riverCurve={riverCurve}
        onRiverCurve={(v) => {
          setRiverCurveState(v);
          setRiverCurve(v);
          pushSnapshot();
        }}
        parkColor={parkColor}
        onParkColor={(v) => {
          setParkColorState(v);
          setParkColor(v);
          pushSnapshot();
        }}
        parkRadius={parkRadius}
        onParkRadius={(v) => {
          setParkRadiusState(v);
          setParkRadius(v);
          pushSnapshot();
        }}
        parkBorderWidth={parkBorderWidth}
        onParkBorderWidth={(v) => {
          setParkBorderWidthState(v);
          setParkBorderWidth(v);
          pushSnapshot();
        }}
        parkBorderColor={parkBorderColor}
        onParkBorderColor={(v) => {
          setParkBorderColorState(v);
          setParkBorderColor(v);
          pushSnapshot();
        }}
        zoneColor={zoneColor}
        onZoneColor={(v) => {
          setZoneColorState(v);
          setZoneColor(v);
          pushSnapshot();
        }}
        zoneWidth={zoneWidth}
        onZoneWidth={(v) => {
          setZoneWidthState(v);
          setZoneWidth(v);
          pushSnapshot();
        }}
        seaColor={seaColor}
        onSeaColor={(v) => {
          setSeaColorState(v);
          setSeaColor(v);
          pushSnapshot();
        }}
        curve={curve}
        onCurve={(v) => {
          setCurveState(v);
          setCurve(v);
          pushSnapshot();
        }}
      />
      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        code={exportCode}
        onCopy={() => navigator.clipboard?.writeText(exportCode).catch(() => {})}
        onDownloadJSON={() =>
          download(
            exportFilename(name),
            JSON.stringify(
              { app: 'metro-map-studio', version: 2, name, code: exportCode, canvas: size },
              null,
              2,
            ),
          )
        }
        onDownloadPNG={(scale) => exportPNG(scale)}
        onDownloadSVG={() => downloadSVG(name)}
        onDownloadPDF={() => downloadPDF(name)}
      />
      <LoadModal
        open={loadOpen}
        onClose={() => setLoadOpen(false)}
        onLoad={(code) => {
          restoreSnapshot(code);
          pushSnapshot();
        }}
      />
      {selText && (
        <TextInspector
          key={`${selText.route}:${selText.index}`}
          sel={selText}
          onClose={closeInspector}
          onDuplicate={duplicateInspector}
          onDelete={deleteInspector}
        />
      )}
    </div>
  );
}
