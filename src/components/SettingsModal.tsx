import { Modal } from './Modals';
import { SectionTitle, FieldLabel, inputCls } from './ui';
import { TEXT_FONTS, STYLE_DEFAULTS } from '../engine/adapter';

const SWATCHES = ['#000000', '#ffffff', '#e11d48', '#2563eb', '#059669', '#f59e0b'];

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  textSize: number;
  onTextSize: (v: number) => void;
  textColor: string;
  onTextColor: (v: string) => void;
  textFont: string;
  onTextFont: (v: string) => void;
  canvasColor: string;
  onCanvasColor: (v: string) => void;
  riverColor: string;
  onRiverColor: (v: string) => void;
  riverWidth: number;
  onRiverWidth: (v: number) => void;
  riverCurve: number;
  onRiverCurve: (v: number) => void;
  parkColor: string;
  onParkColor: (v: string) => void;
  parkRadius: number;
  onParkRadius: (v: number) => void;
  parkBorderWidth: number;
  onParkBorderWidth: (v: number) => void;
  parkBorderColor: string;
  onParkBorderColor: (v: string) => void;
  zoneColor: string;
  onZoneColor: (v: string) => void;
  zoneWidth: number;
  onZoneWidth: (v: number) => void;
  seaColor: string;
  onSeaColor: (v: string) => void;
  curve: number;
  onCurve: (v: number) => void;
}

function Swatches({ value, onPick }: { value: string; onPick: (c: string) => void }) {
  const norm = value.toLowerCase();
  return (
    <div className="flex items-center gap-1.5">
      {SWATCHES.map((c) => (
        <button
          key={c}
          type="button"
          title={c}
          onClick={() => onPick(c)}
          className={`h-6 w-6 rounded-full ring-1 ring-inset ring-black/20 ${
            norm === c ? 'outline outline-2 outline-offset-2 outline-indigo-500' : ''
          }`}
          style={{ background: c }}
        />
      ))}
      <input
        type="color"
        title="Custom color"
        value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000'}
        onChange={(e) => onPick(e.target.value)}
        className="h-6 w-8 cursor-pointer rounded border border-zinc-300 bg-white p-0.5 dark:border-zinc-700 dark:bg-zinc-950"
      />
    </div>
  );
}

export default function SettingsModal(p: SettingsModalProps) {
  return (
    <Modal open={p.open} onClose={p.onClose} title="Settings">
      <section className="mb-4">
        <SectionTitle>Text</SectionTitle>
        <div className="mb-3">
          <FieldLabel htmlFor="set-text-size">Size · {p.textSize} pt</FieldLabel>
          <input
            id="set-text-size"
            type="range"
            min={4}
            max={48}
            value={p.textSize}
            onChange={(e) => p.onTextSize(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
        <div className="mb-3">
          <FieldLabel>Color</FieldLabel>
          <Swatches value={p.textColor} onPick={p.onTextColor} />
        </div>
        <div>
          <FieldLabel htmlFor="set-text-font">Font</FieldLabel>
          <select
            id="set-text-font"
            className={inputCls}
            value={p.textFont}
            onChange={(e) => p.onTextFont(e.target.value)}
            style={{ fontFamily: p.textFont }}
          >
            {TEXT_FONTS.map((f) => (
              <option key={f} value={f} style={{ fontFamily: f }}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="mb-4">
        <SectionTitle>Canvas</SectionTitle>
        <div className="mb-2 flex gap-1.5">
          {[
            { label: 'Light', value: '#ffffff' },
            { label: 'Dark', value: '#101014' },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              onClick={() => p.onCanvasColor(o.value)}
              className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-semibold ${
                p.canvasColor.toLowerCase() === o.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-200'
                  : 'border-zinc-300 dark:border-zinc-700'
              }`}
            >
              {o.label}
            </button>
          ))}
          <input
            type="color"
            title="Custom canvas color"
            value={/^#[0-9a-fA-F]{6}$/.test(p.canvasColor) ? p.canvasColor : '#ffffff'}
            onChange={(e) => p.onCanvasColor(e.target.value)}
            className="h-[34px] w-12 cursor-pointer rounded-md border border-zinc-300 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>
      </section>

      <section className="mb-4">
        <SectionTitle>Rivers &amp; parks</SectionTitle>
        <div className="mb-3">
          <FieldLabel>River color</FieldLabel>
          <Swatches value={p.riverColor} onPick={p.onRiverColor} />
        </div>
        <div className="mb-3 grid grid-cols-2 gap-2">
          <div>
            <FieldLabel htmlFor="set-river-width">Width · {p.riverWidth}</FieldLabel>
            <input
              id="set-river-width"
              type="number"
              min={4}
              max={160}
              className={inputCls}
              value={p.riverWidth}
              onChange={(e) =>
                p.onRiverWidth(Math.min(160, Math.max(4, Number(e.target.value) || STYLE_DEFAULTS.riverWidth)))
              }
            />
          </div>
          <div>
            <FieldLabel htmlFor="set-river-curve">Curvature · {p.riverCurve}</FieldLabel>
            <input
              id="set-river-curve"
              type="range"
              min={0}
              max={9}
              value={p.riverCurve}
              onChange={(e) => p.onRiverCurve(Number(e.target.value))}
              className="mt-2 w-full accent-indigo-600"
            />
          </div>
        </div>
        <div className="mb-3">
          <FieldLabel>Park color</FieldLabel>
          <Swatches value={p.parkColor} onPick={p.onParkColor} />
        </div>
        <div className="mb-3">
          <FieldLabel htmlFor="set-park-radius">Corner roundness · {p.parkRadius}</FieldLabel>
          <input
            id="set-park-radius"
            type="range"
            min={0}
            max={200}
            value={p.parkRadius}
            onChange={(e) => p.onParkRadius(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <FieldLabel htmlFor="set-park-border">Border · {p.parkBorderWidth}</FieldLabel>
            <input
              id="set-park-border"
              type="number"
              min={0}
              max={20}
              className={inputCls}
              value={p.parkBorderWidth}
              onChange={(e) =>
                p.onParkBorderWidth(Math.min(20, Math.max(0, Math.round(Number(e.target.value) || 0))))
              }
            />
          </div>
          <div>
            <FieldLabel>Border color</FieldLabel>
            <Swatches value={p.parkBorderColor} onPick={p.onParkBorderColor} />
          </div>
        </div>
      </section>

      <section>
        <SectionTitle>Zones &amp; sea</SectionTitle>
        <div className="mb-3">
          <FieldLabel>Zone color</FieldLabel>
          <Swatches value={p.zoneColor} onPick={p.onZoneColor} />
        </div>
        <div className="mb-3">
          <FieldLabel htmlFor="set-zone-width">Zone width · {p.zoneWidth}</FieldLabel>
          <input
            id="set-zone-width"
            type="number"
            min={1}
            max={20}
            className={inputCls}
            value={p.zoneWidth}
            onChange={(e) =>
              p.onZoneWidth(Math.min(20, Math.max(1, Math.round(Number(e.target.value) || STYLE_DEFAULTS.zoneWidth))))
            }
          />
        </div>
        <div>
          <FieldLabel>Sea color</FieldLabel>
          <Swatches value={p.seaColor} onPick={p.onSeaColor} />
        </div>
      </section>

      <section>
        <SectionTitle>Lines</SectionTitle>
        <FieldLabel htmlFor="set-curve">Corner curvature · {p.curve}</FieldLabel>
        <input
          id="set-curve"
          type="range"
          min={0}
          max={9}
          value={p.curve}
          onChange={(e) => p.onCurve(Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
      </section>
    </Modal>
  );
}
