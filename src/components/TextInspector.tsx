import { useEffect, useRef, useState } from 'react';
import { FiRotateCcw, FiRotateCw } from 'react-icons/fi';
import { Button, FieldLabel, SectionTitle, inputCls } from './ui';
import {
  clearTextStyle,
  getFontSize,
  getText,
  getTextColor,
  redraw,
  setTextContent,
  setTextStyle,
} from '../engine/adapter';

const PRESETS = ['#000000', '#ffffff', '#e11d48', '#2563eb', '#059669', '#f59e0b', '#2f80ed'];

export interface TextSelection {
  route: number;
  index: number;
  sx: number;
  sy: number;
}

interface Props {
  sel: TextSelection;
  onClose: (changed: boolean) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export default function TextInspector({ sel, onClose, onDuplicate, onDelete }: Props) {
  const [content, setContent] = useState('');
  const [size, setSize] = useState(8);
  const [color, setColor] = useState('#000000');
  const [bwid, setBwid] = useState(0);
  const [bcol, setBcol] = useState('#000000');
  const [rot, setRot] = useState(0);
  const dirtyRef = useRef(false);
  const liveRef = useRef({ route: sel.route, index: sel.index });
  liveRef.current = { route: sel.route, index: sel.index };

  useEffect(() => {
    const t = getText(sel.route, sel.index);
    setContent(t?.text ?? '');
    setSize(t?.size ?? getFontSize());
    setColor(t?.color ?? getTextColor());
    setBwid(t?.borderWidth ?? 0);
    setBcol(t?.borderColor ?? '#000000');
    setRot(t?.rot ?? 0);
    dirtyRef.current = false;
  }, [sel.route, sel.index]);

  const apply = (fn: () => void) => {
    fn();
    dirtyRef.current = true;
  };

  const commitContent = (v: string) => {
    const { route, index } = liveRef.current;
    setContent(v);
    setTextContent(route, index, v);
    dirtyRef.current = true;
  };

  return (
    <div
      className="fixed z-[300] w-64 rounded-xl border border-zinc-200 bg-white p-3 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
      style={{
        left: Math.min(window.innerWidth - 272, Math.max(8, sel.sx - 128)),
        top: Math.min(window.innerHeight - 380, Math.max(8, sel.sy + 12)),
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="mb-2 flex items-center">
        <SectionTitle>Texto</SectionTitle>
        <button
          type="button"
          onClick={() => onClose(dirtyRef.current)}
          aria-label="Cerrar"
          className="ml-auto grid h-6 w-6 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          ×
        </button>
      </div>

      <div className="mb-2">
        <FieldLabel>Contenido</FieldLabel>
        <input
          className={inputCls}
          value={content}
          onChange={(e) => commitContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onClose(dirtyRef.current);
            if (e.key === 'Escape') onClose(dirtyRef.current);
          }}
          placeholder="Texto de la etiqueta…"
        />
      </div>

      <div className="mb-2">
        <FieldLabel>Tamaño · {size} pt</FieldLabel>
        <input
          type="range"
          min={4}
          max={48}
          value={size}
          onChange={(e) => {
            const v = Number(e.target.value);
            setSize(v);
            const { route, index } = liveRef.current;
            apply(() => setTextStyle(route, index, { size: v }));
          }}
          className="w-full accent-indigo-600"
        />
      </div>

      <div className="mb-2">
        <FieldLabel>Color</FieldLabel>
        <div className="flex items-center gap-1.5">
          {PRESETS.map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              onClick={() => {
                setColor(c);
                const { route, index } = liveRef.current;
                apply(() => setTextStyle(route, index, { color: c }));
              }}
              className={`h-6 w-6 rounded-full ring-1 ring-inset ring-black/20 ${
                color.toLowerCase() === c ? 'outline outline-2 outline-offset-2 outline-indigo-500' : ''
              }`}
              style={{ background: c }}
            />
          ))}
          <input
            type="color"
            title="Color personalizado"
            value={/^#[0-9a-fA-F]{6}$/.test(color) ? color : '#000000'}
            onChange={(e) => {
              setColor(e.target.value);
              const { route, index } = liveRef.current;
              apply(() => setTextStyle(route, index, { color: e.target.value }));
            }}
            className="h-6 w-8 cursor-pointer rounded border border-zinc-300 bg-white p-0.5 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>
      </div>

      <div className="mb-2">
        <FieldLabel>Giro · {rot}°</FieldLabel>
        <div className="flex gap-1.5">
          <Button
            size="sm"
            className="flex-1"
            title="Girar 45° a la izquierda"
            onClick={() => {
              const v = (((rot - 45) % 360) + 360) % 360;
              setRot(v);
              const { route, index } = liveRef.current;
              apply(() => setTextStyle(route, index, { rot: v }));
            }}
          >
            <FiRotateCcw size={14} /> 45°
          </Button>
          <Button
            size="sm"
            className="flex-1"
            title="Girar 45° a la derecha"
            onClick={() => {
              const v = (rot + 45) % 360;
              setRot(v);
              const { route, index } = liveRef.current;
              apply(() => setTextStyle(route, index, { rot: v }));
            }}
          >
            45° <FiRotateCw size={14} />
          </Button>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <div>
          <FieldLabel>Borde · {bwid}</FieldLabel>          <input
            type="number"
            min={0}
            max={20}
            className={inputCls}
            value={bwid}
            onChange={(e) => {
              const v = Math.min(20, Math.max(0, Math.round(Number(e.target.value) || 0)));
              setBwid(v);
              const { route, index } = liveRef.current;
              apply(() => setTextStyle(route, index, { borderWidth: v }));
            }}
          />
        </div>
        <div>
          <FieldLabel>Color borde</FieldLabel>
          <input
            type="color"
            title="Color del borde"
            value={/^#[0-9a-fA-F]{6}$/.test(bcol) ? bcol : '#000000'}
            onChange={(e) => {
              setBcol(e.target.value);
              const { route, index } = liveRef.current;
              apply(() => setTextStyle(route, index, { borderColor: e.target.value }));
            }}
            className="h-8 w-full cursor-pointer rounded-md border border-zinc-300 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>
      </div>

      <div className="flex gap-1.5">
        <Button
          size="sm"
          className="flex-1"
          onClick={() => {
            const { route, index } = liveRef.current;
            clearTextStyle(route, index);
            setSize(getFontSize());
            setColor(getTextColor());
            setBwid(0);
            setBcol('#000000');
            setRot(0);
            dirtyRef.current = true;
            redraw();
          }}
          title="Volver a los valores globales del estudio"
        >
          Restablecer
        </Button>
        <Button size="sm" className="flex-1" onClick={onDuplicate}>
          Duplicar
        </Button>
        <Button size="sm" variant="danger" onClick={onDelete}>
          Borrar
        </Button>
      </div>
      <p className="mt-2 text-[10px] leading-snug text-zinc-400">Enter cierra · % salta de línea · arrastra la etiqueta para moverla</p>
    </div>
  );
}
