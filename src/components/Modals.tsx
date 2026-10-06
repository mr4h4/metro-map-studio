import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Button, inputCls } from './ui';
import { isMapCode } from '../app/store';

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-zinc-950/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[calc(100vh-3rem)] w-full max-w-lg overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <h2 className="text-sm font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-auto grid h-7 w-7 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            ×
          </button>
        </div>
        <div className="px-4 py-4">{children}</div>
      </div>
    </div>
  );
}

export function ExportModal({
  open,
  onClose,
  code,
  onCopy,
  onDownloadPNG,
  onDownloadSVG,
  onDownloadPDF,
  onDownloadJSON,
}: {
  open: boolean;
  onClose: () => void;
  code: string;
  onCopy: () => void;
  onDownloadPNG: (scale: number) => void;
  onDownloadSVG: () => void;
  onDownloadPDF: () => void | Promise<void>;
  onDownloadJSON: () => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const run = (label: string, fn: () => void | Promise<void>) => {
    try {
      const r = fn();
      if (r && typeof (r as Promise<void>).then === 'function') {
        setBusy(label);
        (r as Promise<void>).then(
          () => setBusy(null),
          () => setBusy(null),
        );
      }
    } catch {
      setBusy(null);
    }
  };
  return (
    <Modal open={open} onClose={onClose} title="Export">
      <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
        Download the whole canvas in full quality — pick a format.
      </p>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <Button size="sm" variant="primary" disabled={busy !== null} onClick={() => onDownloadPNG(1)}>
          PNG 1x
        </Button>
        <Button size="sm" variant="primary" disabled={busy !== null} onClick={() => onDownloadPNG(2)}>
          PNG 2x
        </Button>
        <Button size="sm" variant="primary" disabled={busy !== null} onClick={() => onDownloadPNG(4)}>
          PNG 4x
        </Button>
        <Button size="sm" variant="primary" disabled={busy !== null} onClick={onDownloadSVG}>
          SVG
        </Button>
        <Button
          size="sm"
          variant="primary"
          disabled={busy !== null}
          onClick={() => run('pdf', onDownloadPDF)}
        >
          {busy === 'pdf' ? 'Building PDF…' : 'PDF'}
        </Button>
        <Button size="sm" variant="primary" disabled={busy !== null} onClick={onDownloadJSON}>
          JSON
        </Button>
      </div>
      <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
        PNG is a lossless raster image — 2x/4x re-render the plan at higher
        resolution for sharp prints. SVG and PDF are vector versions of the plan. JSON is
        a full backup (code + canvas + name) you can re-import later.
      </p>
      <textarea
        readOnly
        value={code}
        rows={4}
        onFocus={(e) => e.target.select()}
        className="mb-3 w-full resize-y rounded-md border border-zinc-300 bg-zinc-50 p-2 font-mono text-[11px] dark:border-zinc-700 dark:bg-zinc-950"
      />
      <div className="flex flex-wrap gap-1.5">
        <Button size="sm" onClick={onCopy}>
          Copy code
        </Button>
      </div>
    </Modal>
  );
}

export function LoadModal({
  open,
  onClose,
  onLoad,
}: {
  open: boolean;
  onClose: () => void;
  onLoad: (code: string) => void;
}) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setText('');
      setError('');
    }
  }, [open ]);

  const submit = () => {
    if (!isMapCode(text.trim())) {
      setError('That does not look like map code (expected setroutes(…)).');
      return;
    }
    onLoad(text.trim());
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Load map code">
      <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
        Paste the code of a previously saved map. The current plan will be replaced.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="setroutes(2);…"
        className={`${inputCls} mb-2 h-auto font-mono text-[11px]`}
      />
      {error && <p className="mb-2 text-xs font-semibold text-red-600 dark:text-red-400">{error}</p>}
      <Button size="sm" variant="primary" onClick={submit}>
        Load code
      </Button>
    </Modal>
  );
}
