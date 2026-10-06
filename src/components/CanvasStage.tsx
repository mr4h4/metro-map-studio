import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import {
  FiMinus,
  FiPlus,
} from 'react-icons/fi';
import { Button } from './ui';

interface CanvasStageProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  viewportRef: RefObject<HTMLDivElement | null>;
  size: { w: number; h: number };
  canvasBg: string;
  zoomK: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onResize: (w: number, h: number) => void;
  onFitGrow: () => void;
  cursorColor: string;
  textDraft?: { x: number; y: number } | null;
  textValue?: string;
  onTextValue?: (v: string) => void;
  onTextCommit?: () => void;
  onTextCancel?: () => void;
  textFont?: string;
  textColor?: string;
  textSizePt?: number;
  dpr?: number;
}

const PRESETS = [
  { label: 'S', w: 1100, h: 920 },
  { label: 'M', w: 1600, h: 1200 },
  { label: 'L', w: 2400, h: 1800 },
  { label: 'XL', w: 3200, h: 2400 },
];

const iconBtn =
  'grid h-7 w-7 place-items-center rounded-md border border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400';

export default function CanvasStage(props: CanvasStageProps) {
  const { canvasRef, viewportRef, size, canvasBg, zoomK } = props;
  const [wText, setWText] = useState(String(size.w));
  const [hText, setHText] = useState(String(size.h));
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setWText(String(size.w));
    setHText(String(size.h));
  }, [size.w, size.h]);

  // precision cursor overlay (independent of the engine's own listeners)
  useEffect(() => {
    const canvas = canvasRef.current;
    const cur = cursorRef.current;
    const ring = ringRef.current;
    if (!canvas || !cur) return;
    document.body.classList.add('has-cursor');
    const move = (ev: MouseEvent) => {
      cur.style.transform = `translate(${ev.clientX}px,${ev.clientY}px)`;
    };
    const enter = () => {
      cur.style.opacity = '1';
    };
    const leave = () => {
      cur.style.opacity = '0';
      if (ring) ring.style.transform = '';
    };
    const down = () => {
      if (ring) ring.style.transform = 'scale(.72)';
    };
    const up = () => {
      if (ring) ring.style.transform = '';
    };
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseenter', enter);
    canvas.addEventListener('mouseleave', leave);
    canvas.addEventListener('mousedown', down);
    document.addEventListener('mouseup', up);
    return () => {
      document.body.classList.remove('has-cursor');
      canvas.removeEventListener('mousemove', move);
      canvas.removeEventListener('mouseenter', enter);
      canvas.removeEventListener('mouseleave', leave);
      canvas.removeEventListener('mousedown', down);
      document.removeEventListener('mouseup', up);
    };
  }, [canvasRef]);

  const apply = () => {
    const w = Math.min(4000, Math.max(200, Math.round(Number(wText) || size.w)));
    const h = Math.min(4000, Math.max(200, Math.round(Number(hText) || size.h)));
    props.onResize(w, h);
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="flex items-center gap-1">
          <button type="button" title="Zoom out" onClick={props.onZoomOut} className={iconBtn}>
            <FiMinus size={13} />
          </button>
          <button
            type="button"
            title="Reset zoom to 100%"
            onClick={props.onZoomReset}
            className="h-7 min-w-12 rounded-md border border-zinc-300 px-1.5 text-xs font-semibold tabular-nums dark:border-zinc-700"
          >
            {Math.round(zoomK * 100)}%
          </button>
          <button type="button" title="Zoom in" onClick={props.onZoomIn} className={iconBtn}>
            <FiPlus size={13} />
          </button>
        </span>
        <span className="h-5 w-px bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Canvas
        </span>
        <div className="flex items-center gap-1">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              title={`${p.w} × ${p.h}`}
              onClick={() => props.onResize(p.w, p.h)}
              className={`h-7 rounded-md border px-2 text-xs font-semibold ${
                size.w === p.w && size.h === p.h
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-200'
                  : 'border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <input
          aria-label="Canvas width"
          className="h-7 w-20 rounded-md border border-zinc-300 bg-white px-2 text-xs dark:border-zinc-700 dark:bg-zinc-950"
          value={wText}
          inputMode="numeric"
          onChange={(e) => setWText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && apply()}
        />
        <span className="text-xs text-zinc-400">×</span>
        <input
          aria-label="Canvas height"
          className="h-7 w-20 rounded-md border border-zinc-300 bg-white px-2 text-xs dark:border-zinc-700 dark:bg-zinc-950"
          value={hText}
          inputMode="numeric"
          onChange={(e) => setHText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && apply()}
        />
        <Button size="sm" onClick={apply}>
          Apply
        </Button>
        <Button size="sm" onClick={props.onFitGrow} title="Grow the canvas so all content fits">
          Grow
        </Button>
      </div>
      <div ref={viewportRef} className="min-h-0 flex-1 overflow-auto bg-zinc-200 p-6 dark:bg-zinc-950">
        <div className="mx-auto w-max">
          <div className="relative">
            <canvas
              ref={canvasRef}
              id="canvas"
              data-plan
              width={Math.round(size.w * (props.dpr ?? 1))}
              height={Math.round(size.h * (props.dpr ?? 1))}
              style={{
                background: canvasBg,
                width: Math.round(size.w * zoomK),
                height: Math.round(size.h * zoomK),
              }}
              className="rounded-md shadow-xl ring-1 ring-zinc-900/10"
            />
            {props.textDraft && (
              <div
                className="absolute z-[120]"
                style={{ left: props.textDraft.x * zoomK, top: props.textDraft.y * zoomK }}
              >
                <div className="-translate-x-1/2 translate-y-3">
                  <div className="flex items-center gap-1 rounded-md border border-indigo-500 bg-white p-1 shadow-xl dark:bg-zinc-950">
                    <input
                      autoFocus
                      value={props.textValue ?? ''}
                      onChange={(e) => props.onTextValue?.(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') props.onTextCommit?.();
                        if (e.key === 'Escape') props.onTextCancel?.();
                      }}
                      onBlur={() => props.onTextCommit?.()}
                      placeholder="Texto…"
                      className="h-7 w-44 rounded bg-transparent px-2 text-[13px] outline-none"
                      style={{
                        color: props.textColor ?? '#000',
                        fontFamily: props.textFont ?? 'Arial',
                        fontSize: 13,
                      }}
                    />
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => props.onTextCommit?.()}
                      className="h-7 shrink-0 rounded-md bg-indigo-600 px-2.5 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                      Colocar
                    </button>
                  </div>
                  <p className="mt-1 text-center text-[10px] text-zinc-500">Enter o Colocar · Esc cancela</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200] opacity-0 transition-opacity duration-100"
        id="mms-cursor"
      >
        <span
          ref={ringRef}
          className="absolute -left-[11px] -top-[11px] block h-[22px] w-[22px] rounded-full border-2 border-white mix-blend-difference transition-transform"
        />
        <span
          className="absolute -left-[3px] -top-[3px] block h-[6px] w-[6px] rounded-full shadow"
          style={{ background: props.cursorColor, boxShadow: '0 0 0 1.5px #fff, 0 1px 4px rgba(0,0,0,.5)' }}
        />
      </div>
    </div>
  );
}
