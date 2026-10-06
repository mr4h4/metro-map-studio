import type { RouteInfo, ToolMode } from '../engine/adapter';
import { Button, FieldLabel, SectionTitle, inputCls } from './ui';
import {
  FiArrowDown,
  FiArrowDownLeft,
  FiArrowDownRight,
  FiArrowLeft,
  FiArrowRight,
  FiArrowUp,
  FiArrowUpLeft,
  FiArrowUpRight,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi';

export interface SidebarProps {
  routes: RouteInfo[];
  current: number;
  onSelectRoute: (i: number) => void;
  onCreateRoute: () => void;
  onDeleteRoute: () => void;
  lineName: string;
  onLineName: (v: string) => void;
  onLineNameCommit: () => void;
  lineColor: string;
  onLineColor: (v: string) => void;
  lineWidth: number;
  onLineWidth: (v: number) => void;
  tool: ToolMode;
  onTool: (t: ToolMode) => void;
  stationDir: number;
  onStationDir: (v: number) => void;
  stationType: number;
  onStationType: (v: number) => void;
  pillWidth: number;
  onPillWidth: (v: number) => void;
}

const TOOLS: { mode: ToolMode; label: string; hint: string; key: string }[] = [
  { mode: 1, label: 'Draw', hint: 'Drag on the canvas', key: 'D' },
  { mode: 2, label: 'Erase', hint: 'Remove tracks', key: 'E' },
  { mode: 3, label: 'Stations', hint: 'Click a track to add', key: 'S' },
  { mode: 4, label: 'Remove', hint: 'Delete stations', key: 'R' },
  { mode: 5, label: 'Text', hint: 'Add · click label to edit', key: 'T' },
  { mode: 6, label: 'Pan', hint: 'Drag drawing to move', key: 'H' },
  { mode: 7, label: 'River', hint: '45° junctions, like tracks', key: 'V' },
  { mode: 8, label: 'Park', hint: 'Drag a park rectangle', key: 'P' },
  { mode: 9, label: 'Zone', hint: 'Dotted boundaries, like tracks', key: 'Z' },
  { mode: 10, label: 'Sea', hint: 'Hatched sea rectangle', key: 'M' },
];

const DIRS = [
  { v: 1, Icon: FiArrowUpLeft, label: 'NW' },
  { v: 2, Icon: FiArrowUp, label: 'N' },
  { v: 3, Icon: FiArrowUpRight, label: 'NE' },
  { v: 4, Icon: FiArrowLeft, label: 'W' },
  { v: 5, Icon: FiArrowRight, label: 'E' },
  { v: 6, Icon: FiArrowDownLeft, label: 'SW' },
  { v: 7, Icon: FiArrowDown, label: 'S' },
  { v: 8, Icon: FiArrowDownRight, label: 'SE' },
];

const TYPES = [
  { v: 1, label: 'Dot', desc: 'Standard stop' },
  { v: 2, label: 'Dash', desc: 'Minor stop' },
  { v: 3, label: 'Interchange', desc: 'Connection' },
  { v: 4, label: 'Limited', desc: 'Part-time stop' },
  { v: 5, label: 'Mega', desc: 'Major terminus' },
  { v: 6, label: 'Pill', desc: 'Directional stretchable interchange' },
];

function toHex6(c: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(c) ? c : '#000000';
}

export default function Sidebar(p: SidebarProps) {
  const active =
    'border-indigo-500 bg-indigo-50 text-indigo-800 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-200';
  const idle =
    'border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600';

  return (
    <aside className="w-60 shrink-0 overflow-y-auto border-r border-zinc-200 bg-white px-3 py-4 dark:border-zinc-800 dark:bg-zinc-900">
      <section className="mb-5">
        <SectionTitle>Routes</SectionTitle>
        <ul className="mb-2 space-y-1">
          {p.routes.map((r) => (
            <li key={r.index}>
              <button
                type="button"
                onClick={() => p.onSelectRoute(r.index)}
                className={`flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-[13px] ${
                  r.index === p.current ? active : idle
                }`}
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full ring-1 ring-inset ring-black/20"
                  style={{ background: r.color }}
                />
                <span className="truncate font-medium">{r.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-1.5">
          <Button size="sm" className="flex-1" onClick={p.onCreateRoute}>
            <FiPlus size={13} /> Route
          </Button>
          <Button size="sm" variant="danger" onClick={p.onDeleteRoute} title="Delete current route">
            <FiTrash2 size={13} />
          </Button>
        </div>
      </section>

      <section className="mb-5">
        <SectionTitle>Line style</SectionTitle>
        <div className="mb-2">
          <FieldLabel htmlFor="line-name">Name</FieldLabel>
          <input
            id="line-name"
            className={inputCls}
            value={p.lineName}
            onChange={(e) => p.onLineName(e.target.value)}
            onBlur={() => p.onLineNameCommit()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <FieldLabel htmlFor="line-color">Color</FieldLabel>
            <input
              id="line-color"
              type="color"
              className="h-8 w-full cursor-pointer rounded-md border border-zinc-300 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-950"
              value={toHex6(p.lineColor)}
              onChange={(e) => p.onLineColor(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="line-width">Width</FieldLabel>
            <input
              id="line-width"
              type="number"
              min={1}
              max={20}
              className={inputCls}
              value={p.lineWidth}
              onChange={(e) => p.onLineWidth(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
            />
          </div>
        </div>
      </section>

      <section className="mb-5">
        <SectionTitle>Tools</SectionTitle>
        <div className="grid grid-cols-2 gap-1.5">
          {TOOLS.map((t) => (
            <button
              key={t.mode}
              type="button"
              title={`${t.hint} (${t.key})`}
              onClick={() => p.onTool(t.mode)}
              className={`relative rounded-md border px-2 py-1.5 text-left ${t.mode === p.tool ? active : idle}`}
            >
              <span
                aria-hidden="true"
                className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded border border-zinc-300 bg-white font-mono text-[9px] font-bold leading-none text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400"
              >
                {t.key}
              </span>
              <span className="block text-[13px] font-semibold leading-tight">{t.label}</span>
              <span className="block text-[10px] opacity-70">{t.hint}</span>
            </button>
          ))}
        </div>
      </section>

      {p.tool === 3 && (
        <section className="mb-5">
          <SectionTitle>Station</SectionTitle>
          <p className="mb-2 text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
            Stations are silent — name them with the Text tool.
          </p>
          {(p.stationType === 2 || p.stationType === 6) ? (
            <div className="mb-3 grid grid-cols-4 gap-1">
              {DIRS.map((d) => (
                <button
                  key={d.v}
                  type="button"
                  title={`Direction ${d.label}`}
                  onClick={() => p.onStationDir(d.v)}
                  className={`flex flex-col items-center rounded-md border py-1 leading-none ${
                    d.v === p.stationDir ? active : idle
                  }`}
                >
                  <d.Icon size={15} />
                  <span className="mt-0.5 text-[8px] opacity-60">{d.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="mb-3 text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
              Direction only matters for Dash and Pill stations.
            </p>
          )}
          <div className="space-y-1">
            {TYPES.map((t) => (
              <button
                key={t.v}
                type="button"
                onClick={() => p.onStationType(t.v)}
                className={`block w-full rounded-md border px-2 py-1.5 text-left ${
                  t.v === p.stationType ? active : idle
                }`}
              >
                <span className="block text-xs font-semibold">{t.label}</span>
                <span className="block text-[10px] opacity-60">{t.desc}</span>
              </button>
            ))}
          </div>
          {p.stationType === 6 && (
            <div className="mt-2">
              <FieldLabel htmlFor="pill-width">Pill width (next pill)</FieldLabel>
              <input
                id="pill-width"
                type="number"
                min={6}
                max={600}
                className={inputCls}
                value={p.pillWidth}
                onChange={(e) => p.onPillWidth(Math.min(600, Math.max(6, Number(e.target.value) || 40)))}
              />
              <p className="mt-1 text-[10px] leading-snug text-zinc-400">
                Anchored on the line, stretches toward the station direction. Drag pills
                on the canvas to resize by hand.
              </p>
            </div>
          )}
        </section>
      )}

      <section>
        <SectionTitle>Canvas</SectionTitle>
        <p className="text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
          Line rendering, text style and canvas color live under the gear button, top right.
        </p>
      </section>
    </aside>
  );
}
