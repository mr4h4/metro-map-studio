# Metro Map Studio — metro plan editor

React 19 + Tailwind CSS v4 studio for drawing metro plans. The drawing kernel
is the original engine, preserved verbatim and driven through a typed adapter —
pixel-identical output, zero regression risk.

## Run it

```powershell
npm install
npm run dev      # http://localhost:8000/ (project library, entry point)
npm run build    # type-check + production bundle into dist/
npm test         # boots the real kernel under jsdom, 19 assertions
```

## Project structure

```text
index.html            Vite entry (loads kernel + jscolor as classic scripts)
src/
  main.tsx / App.tsx  Root + view routing (home / editor, deep-linkable ?id=)
  index.css           Tailwind v4 + dark variant + cursor gating
  app/store.ts        Theme + localStorage project library (keys unchanged)
  engine/adapter.ts   Typed bridge over the legacy kernel (the only coupling)
  engine/LegacyBridge.tsx  Hidden fields the kernel reads/writes (never visible)
  components/         TopBar, Sidebar, CanvasStage, Modals, ui primitives
  pages/Home.tsx      Project library: new / open / import / export / delete
  pages/Editor.tsx    Studio: routes, line style, tools, canvas, undo, save
public/
  engine/legacy.js    Drawing kernel descended from the classic app (patched:
                        empty boot, DPR/zoom coords, free texts, rivers, parks,
                        zones, sea, per-item text style)
  vendor/jscolor/     Colour picker for the kernel's hidden field
  a.html              High-res export helper · editor.html redirects old links
test/engine.test.cjs  Kernel integration test (jsdom + stubbed 2d canvas)
```

## Features

- **Resizable canvas**: presets S–XL, custom W×H (200–4000 px), and **Fit** (grows to
  content without moving anything). Size is stored per project.
- **Minimalist studio UI**: neutral palette, single accent, one left panel, canvas
  toolbar, status bar. No gradients, no clutter.
- **Precision cursor**: high-visibility ring + route-coloured dot, blend-proof on any
  background; native cursor returns automatically if the overlay fails.
- **Undo/redo**: `Ctrl+Z` / `Ctrl+Y` (code-string snapshots, 100 deep). Native text
  undo is preserved inside inputs.
- **Dark / light mode**: topbar toggle, persisted as `mms.theme`.
- **Library** (`mms.projects.v1`, same key as v1 — existing plans carry over):
  create, open, rename, duplicate, delete; `.metro.json` backups, raw-code copy,
  `.json`/`.txt`/paste import with validation.
- **One-click export**: PNG (lossless raster), SVG and PDF (true vector, traced
  from a kernel redraw — `src/engine/vector.ts`), plus JSON (full backup with
  code + canvas + name, re-importable). Images always cover the whole canvas
  (export resets the view temporarily), named after the project.
- **Fixed canvas + native scroll**: the canvas stays exactly at its set size and the
  workspace scrolls (bars, wheel, or middle-drag for a comfortable grab-scroll).
  Gestures are clamped to the sheet, so everything drawn is always exported.
- **Browser-style zoom**: − / % / + in the canvas toolbar resizes the canvas box
  via CSS (backing store and export dims untouched); the kernel maps pointer
  coords back by the factor, so drawing, pills and labels all work zoomed.
- **Station pills (type 6)**: interchange look with the anchor end fixed on the line
  point and the body stretching toward the station direction (the same 8-way
  setting as labels/dashes). Pick Pill, then drag it on the canvas to resize by
  hand. Length travels with the save code (`lineNstationMw`).
- **Settings (gear, top right)**: label size + color, label font (Arial, Verdana,
  Trebuchet MS, Georgia, Courier New, Impact), canvas color (light / dark /
  custom) and line curvature. Everything is applied live, undoable, persisted
  in the save code, and honored by PNG/SVG/PDF export.
- **Silent stations + free Text tool**: placing a station no longer asks for a
  name; labels are separate `lineNtextM` entities placed anywhere with the Text
  tool, draggable by hand, erasable with Remove, and persisted
  (`lineNtexts / Mx / My / Mtext`, quotes escaped).
- **Legacy compatibility**: library codes and Load-dialog codes are the exact same
  format the classic app produced; old `editor.html?id=` links redirect.

## How the engine boundary works

The kernel (`public/engine/legacy.js`) is a classic script: implicit globals, direct
DOM access, its own canvas listeners. React never fights it:

- `LegacyBridge` renders the hidden fields it needs (`#aaqq`, `#colbox`, `#frm3`, …)
  inside a `display:none` container — its own show/hide calls can't flash anything.
- `adapter.ts` calls its functions, reads its globals, and wraps four of them
  (`routechange`, `addrouteyay`, `setroutes`, `thedel`) with change notifications.
- Snapshots reuse the kernel's own serializer (`thebigsave`), so save format and
  undo history are byte-compatible with the classic app.
- `main.tsx` intentionally skips React StrictMode, and `ensureLiveCanvas()`
  re-points the kernel if the `<canvas>` node is ever swapped: the kernel binds
  the live canvas node and its listeners once at boot, so a double-mount would
  otherwise leave it drawing on a detached node.

Credit for the engine: beno.uk.
