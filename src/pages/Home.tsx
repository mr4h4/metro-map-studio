import { useEffect, useMemo, useState } from 'react';
import TopBar, { Brand } from '../components/TopBar';
import { Button } from '../components/ui';
import {
  createProject,
  deleteProject,
  download,
  duplicateProject,
  exportFilename,
  getProject,
  listProjects,
  parseImport,
  routeCount,
  seedExampleProject,
  type Project,
} from '../app/store';

interface HomeProps {
  onEdit: (id?: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

function fmtDate(ts: number): string {
  try {
    return new Date(ts).toLocaleString([], {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

function copyText(t: string): void {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(t).catch(() => fallback());
  } else {
    fallback();
  }
  function fallback() {
    const ta = document.createElement('textarea');
    ta.value = t;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch {
      /* best effort */
    }
    ta.remove();
  }
}

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [arm, setArm] = useState(false);
  if (!arm) {
    return (
      <Button size="sm" variant="danger" onClick={() => setArm(true)}>
        Delete
      </Button>
    );
  }
  return (
    <span className="flex gap-1">
      <Button size="sm" variant="danger" onClick={onDelete}>
        Sure?
      </Button>
      <Button size="sm" onClick={() => setArm(false)}>
        No
      </Button>
    </span>
  );
}

export default function Home({ onEdit, theme, onToggleTheme }: HomeProps) {
  const [projects, setProjects] = useState<Project[]>(() => listProjects());
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');

  const refresh = () => setProjects(listProjects());

  useEffect(() => {
    if (seedExampleProject()) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const sorted = useMemo(
    () => [...projects].sort((a, b) => b.updatedAt - a.updatedAt),
    [projects],
  );

  const create = () => {
    const p = createProject('Untitled plan');
    onEdit(p.id);
  };

  const importTextNow = (text: string, fallbackName: string) => {
    const parsed = parseImport(text);
    if (!parsed) {
      setImportError('That does not look like map code (expected setroutes(…) or a .metro.json file).');
      return;
    }
    setImportError('');
    const p = createProject(parsed.name || fallbackName, parsed.code);
    setImportText('');
    refresh();
    onEdit(p.id);
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar
        left={<Brand sub="Projects" />}
        right={
          <>
            <Button size="sm" onClick={onToggleTheme} title="Toggle dark / light mode">
              {theme === 'dark' ? '☀ Light' : '◐ Dark'}
            </Button>
            <Button size="sm" variant="primary" onClick={create}>
              + New project
            </Button>
          </>
        }
      />
      <main className="mx-auto w-full max-w-5xl flex-1 overflow-y-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight">Your metro plans</h1>
          <p className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
            Stored in this browser. Open a project to edit it, or import existing map code.
          </p>
        </div>

        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
          Library · {sorted.length}
        </h2>
        {sorted.length === 0 ? (
          <div className="mb-8 rounded-xl border border-dashed border-zinc-300 px-6 py-10 text-center dark:border-zinc-700">
            <p className="text-sm font-semibold">No projects yet</p>
            <p className="mt-1 text-[13px] text-zinc-500">Create your first plan to get started.</p>
            <div className="mt-4">
              <Button variant="primary" onClick={create}>
                + New project
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((p) => {
              const n = routeCount(p.code);
              return (
                <article
                  key={p.id}
                  className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="truncate text-sm font-bold">{p.name}</div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <span className="rounded-full bg-indigo-50 px-2 py-px font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                      {n === 1 ? '1 route' : `${n} routes`}
                    </span>
                    <span>{p.code ? fmtDate(p.updatedAt) : 'Blank canvas'}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <Button size="sm" variant="primary" onClick={() => onEdit(p.id)}>
                      Open
                    </Button>
                    <Button
                      size="sm"
                      title="Download JSON backup"
                      onClick={() =>
                        download(
                          exportFilename(p.name),
                          JSON.stringify(
                            { app: 'metro-map-studio', version: 2, name: p.name, updatedAt: p.updatedAt, code: p.code },
                            null,
                            2,
                          ),
                        )
                      }
                    >
                      JSON
                    </Button>
                    <Button
                      size="sm"
                      title="Copy raw map code"
                      onClick={() => {
                        const full = getProject(p.id);
                        if (!full?.code) return;
                        copyText(full.code);
                      }}
                    >
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        duplicateProject(p.id);
                        refresh();
                      }}
                    >
                      Duplicate
                    </Button>
                    <DeleteButton
                      onDelete={() => {
                        deleteProject(p.id);
                        refresh();
                      }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500">Import</h2>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-3 text-xs text-zinc-500">
            Import a <strong>.metro.json</strong> backup, a <strong>.txt</strong> with map code, or paste raw
            code (the same code from the classic Save dialog).
          </p>
          <label
            className="mb-3 inline-flex h-8 cursor-pointer items-center rounded-md border border-zinc-300 px-3 text-[13px] font-medium hover:border-indigo-400 dark:border-zinc-700"
          >
            Choose file…
            <input
              type="file"
              accept=".json,.txt"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const r = new FileReader();
                r.onload = () =>
                  importTextNow(String(r.result || ''), f.name.replace(/\.(metro\.json|json|txt)$/i, ''));
                r.readAsText(f);
                e.target.value = '';
              }}
            />
          </label>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={3}
            placeholder="…or paste map code here"
            className="mb-3 w-full resize-y rounded-md border border-zinc-300 bg-zinc-50 p-2 font-mono text-[11px] dark:border-zinc-700 dark:bg-zinc-950"
          />
          {importError && <p className="mb-2 text-xs font-semibold text-red-600 dark:text-red-400">{importError}</p>}
          <Button size="sm" variant="primary" onClick={() => importTextNow(importText, 'Imported plan')}>
            Import plan
          </Button>
        </div>
      </main>
    </div>
  );
}
