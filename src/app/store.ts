/* Theme + project library. Same localStorage keys as v1 so existing data carries over. */

import exampleData from '../data/barcelona.example.json';

export type Theme = 'light' | 'dark';
const THEME_KEY = 'mms.theme';
const PROJECTS_KEY = 'mms.projects.v1';

export interface CanvasSize {
  w: number;
  h: number;
}

export interface Project {
  id: string;
  name: string;
  /** legacy map code (setroutes(...) serialization) — empty means blank canvas */
  code: string;
  canvas: CanvasSize;
  updatedAt: number;
}

export const DEFAULT_CANVAS: CanvasSize = { w: 1600, h: 1200 };
export const LEGACY_CANVAS: CanvasSize = { w: 1100, h: 920 };

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function cleanName(n: unknown): string {
  const s = String(n ?? '').trim().slice(0, 60);
  return s || 'Untitled plan';
}

/* ---------- theme ---------- */

export function getTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function applyTheme(t: Theme): void {
  document.documentElement.classList.toggle('dark', t === 'dark');
}

export function setTheme(t: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {
    /* private mode — theme just won't persist */
  }
  applyTheme(t);
}

/* ---------- projects ---------- */

function normalize(p: unknown): Project | null {
  if (!p || typeof p !== 'object') return null;
  const o = p as Record<string, unknown>;
  if (typeof o['id'] !== 'string' || typeof o['name'] !== 'string') return null;
  const c = o['canvas'] as { w?: unknown; h?: unknown } | undefined;
  return {
    id: o['id'] as string,
    name: cleanName(o['name']),
    code: typeof o['code'] === 'string' ? (o['code'] as string) : '',
    canvas:
      c && Number.isFinite(c.w) && Number.isFinite(c.h)
        ? {
            w: Math.min(4000, Math.max(200, Math.round(c.w as number))),
            h: Math.min(4000, Math.max(200, Math.round(c.h as number))),
          }
        : { ...LEGACY_CANVAS },
    updatedAt: typeof o['updatedAt'] === 'number' ? (o['updatedAt'] as number) : Date.now(),
  };
}

export function listProjects(): Project[] {
  try {
    const raw = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    const out: Project[] = [];
    for (const item of raw) {
      const p = normalize(item);
      if (p) out.push(p);
    }
    return out;
  } catch {
    return [];
  }
}

function persist(all: Project[]): void {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(all));
  } catch {
    alert('Could not save: local storage is unavailable or full.');
  }
}

export function getProject(id: string): Project | null {
  return listProjects().find((p) => p.id === id) ?? null;
}

export function createProject(name: string, code = '', canvas: CanvasSize = DEFAULT_CANVAS): Project {
  const all = listProjects();
  const p: Project = { id: uid(), name: cleanName(name), code, canvas: { ...canvas }, updatedAt: Date.now() };
  persist([p, ...all]);
  return p;
}

export function updateProject(id: string, patch: Partial<Pick<Project, 'name' | 'code' | 'canvas'>>): Project | null {
  const all = listProjects();
  const i = all.findIndex((p) => p.id === id);
  if (i === -1) return null;
  const next: Project = {
    ...all[i],
    ...(patch.name != null ? { name: cleanName(patch.name) } : {}),
    ...(patch.code !== undefined ? { code: patch.code } : {}),
    ...(patch.canvas ? { canvas: { ...patch.canvas } } : {}),
    updatedAt: Date.now(),
  };
  all[i] = next;
  persist(all);
  return next;
}

export function deleteProject(id: string): void {
  persist(listProjects().filter((p) => p.id !== id));
}

export function duplicateProject(id: string): Project | null {
  const p = getProject(id);
  if (!p) return null;
  return createProject(`${p.name} (copy)`, p.code, p.canvas);
}

const EXAMPLE_FLAG = 'mms.example.v1';

/**
 * Seeds the bundled Barcelona example once per browser, so every user starts
 * with a real map in the library. Never duplicates (flag) and never touches
 * existing projects.
 */
export function seedExampleProject(): boolean {
  try {
    if (localStorage.getItem(EXAMPLE_FLAG)) return false;
    localStorage.setItem(EXAMPLE_FLAG, '1');
  } catch {
    return false;
  }
  const data = exampleData as { name?: unknown; code?: unknown; canvas?: unknown };
  if (!isMapCode(data.code)) return false;
  let canvas: CanvasSize = { ...DEFAULT_CANVAS };
  const c = data.canvas as { w?: unknown; h?: unknown } | undefined;
  if (c && Number.isFinite(c.w) && Number.isFinite(c.h)) {
    canvas = {
      w: Math.min(4000, Math.max(200, Math.round(c.w as number))),
      h: Math.min(4000, Math.max(200, Math.round(c.h as number))),
    };
  }
  const name = typeof data.name === 'string' && data.name.trim() !== '' ? `${data.name.trim()} (example)` : 'Barcelona (example)';
  createProject(name, data.code, canvas);
  return true;
}

/* ---------- map-code helpers (legacy format) ---------- */

export function isMapCode(s: unknown): s is string {
  return typeof s === 'string' && s.includes('setroutes(');
}

export function routeCount(code: string): number {
  const m = /setroutes\((\d+)\)/.exec(code || '');
  return m ? parseInt(m[1], 10) : 0;
}

export function parseImport(text: string): { name: string; code: string } | null {
  const t = String(text || '').trim();
  if (!t) return null;
  if (t.startsWith('{')) {
    try {
      const o = JSON.parse(t) as { name?: unknown; code?: unknown };
      if (o && isMapCode(o.code)) return { name: cleanName(o.name), code: o.code };
    } catch {
      /* fall through to raw check */
    }
  }
  if (isMapCode(t)) return { name: '', code: t };
  return null;
}

function slug(name: string): string {
  return (
    String(name || 'plan')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u00C0-\u024F\u1E00-\u1EFF _-]+/gi, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50) || 'plan'
  );
}

export function exportFilename(name: string): string {
  return `${slug(name)}.metro.json`;
}

export function pngFilename(name: string): string {
  return `${slug(name)}.png`;
}

export function svgFilename(name: string): string {
  return `${slug(name)}.svg`;
}

export function pdfFilename(name: string): string {
  return `${slug(name)}.pdf`;
}

export function download(filename: string, text: string): void {
  downloadBlob(filename, new Blob([text], { type: 'application/json' }));
}

export function downloadBlob(filename: string, blob: Blob): void {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 500);
}
