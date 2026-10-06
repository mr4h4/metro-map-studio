/* Vector export: replays one full kernel redraw into an SVG document.
 * The kernel is untouched — its `ctx` global is briefly pointed at a recorder
 * (and `canvas` at a plain {width,height}, the only members drawmap reads),
 * then everything is restored. Text metrics are delegated to the live context
 * so label layout matches the screen exactly.
 */

import { downloadBlob, pdfFilename, svgFilename } from '../app/store';

type W = Record<string, unknown>;

function kernel(): W {
  return window as unknown as W;
}

const round2 = (v: number): number => Math.round(Number(v) * 100) / 100;

function escXml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseFont(font: string): { size: number; family: string; bold: boolean } {
  const m = /^(?:(bold)\s+)?(\d+(?:\.\d+)?)(pt|px)\s+(.+)$/i.exec(String(font || '').trim());
  if (!m) return { size: 10, family: 'sans-serif', bold: false };
  const px = m[3].toLowerCase() === 'pt' ? Number(m[2]) * (4 / 3) : Number(m[2]);
  const family = m[4].trim().replace(/^["']|["']$/g, '');
  return { size: Math.round(px * 100) / 100, family: family || 'sans-serif', bold: !!m[1] };
}

function anchorOf(align: string): string {
  switch (align) {
    case 'center':
      return 'middle';
    case 'right':
    case 'end':
      return 'end';
    default:
      return 'start';
  }
}

/** Canvas arc -> SVG arc segments appended to `d`. */
function arcTo(d: string[], x: number, y: number, r: number, a0: number, a1: number, ccw: boolean): string[] {
  const TAU = Math.PI * 2;
  let sweep = ccw ? a0 - a1 : a1 - a0;
  while (sweep < 0) sweep += TAU;
  while (sweep >= TAU) sweep -= TAU;
  const full = sweep < 1e-6 && Math.abs(a1 - a0) > 1e-6;
  const pt = (a: number): [number, number] => [round2(x + r * Math.cos(a)), round2(y + r * Math.sin(a))];
  const large = sweep > Math.PI ? 1 : 0;
  const flag = ccw ? 0 : 1;
  if (full) {
    const [sx, sy] = pt(a0);
    const [mx, my] = pt(a0 + Math.PI);
    d.push(`M${sx} ${sy}A${round2(r)} ${round2(r)} 0 1 ${flag} ${mx} ${my}A${round2(r)} ${round2(r)} 0 1 ${flag} ${sx} ${sy}`);
    return d;
  }
  const [sx, sy] = pt(a0);
  const [ex, ey] = pt(a1);
  if (d.length === 0) d.push(`M${sx} ${sy}`);
  d.push(`A${round2(r)} ${round2(r)} 0 ${large} ${flag} ${ex} ${ey}`);
  return d;
}

class Recorder {
  strokeStyle = '#000000';
  fillStyle = '#000000';
  lineWidth = 1;
  lineCap = 'butt';
  lineJoin = 'miter';
  font = '10px sans-serif';
  textAlign = 'start';
  textBaseline = 'alphabetic';
  private dash: number[] = [];
  private path: string[] = [];
  private out: string[] = [];
  constructor(private measure: (text: string, font: string) => number) {}

  setLineDash(dash: number[]): void {
    this.dash = Array.isArray(dash) ? dash.map((v) => round2(v)) : [];
  }

  beginPath(): void {
    this.path = [];
  }
  closePath(): void {
    this.path.push('Z');
  }
  moveTo(x: number, y: number): void {
    this.path.push(`M${round2(x)} ${round2(y)}`);
  }
  lineTo(x: number, y: number): void {
    this.path.push(`L${round2(x)} ${round2(y)}`);
  }
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    this.path.push(`Q${round2(cpx)} ${round2(cpy)} ${round2(x)} ${round2(y)}`);
  }
  arc(x: number, y: number, r: number, a0: number, a1: number, ccw?: boolean): void {
    arcTo(this.path, x, y, r, a0, a1, !!ccw);
  }
  stroke(): void {
    if (this.path.length === 0) return;
    const dash = this.dash.length > 0 ? ` stroke-dasharray="${this.dash.join(' ')}"` : '';
    const cap = this.lineCap && this.lineCap !== 'butt' ? ` stroke-linecap="${escXml(this.lineCap)}"` : '';
    const join = this.lineJoin && this.lineJoin !== 'miter' ? ` stroke-linejoin="${escXml(this.lineJoin)}"` : '';
    this.out.push(
      `<path d="${this.path.join('')}" fill="none" stroke="${escXml(this.strokeStyle)}" stroke-width="${round2(this.lineWidth)}"${cap}${join}${dash}/>`,
    );
  }
  fill(): void {
    if (this.path.length === 0) return;
    this.out.push(`<path d="${this.path.join('')}" fill="${escXml(this.fillStyle)}" stroke="none"/>`);
  }
  fillRect(x: number, y: number, w: number, h: number): void {
    this.out.push(
      `<rect x="${round2(x)}" y="${round2(y)}" width="${round2(w)}" height="${round2(h)}" fill="${escXml(this.fillStyle)}"/>`,
    );
  }
  strokeRect(x: number, y: number, w: number, h: number): void {
    this.out.push(
      `<rect x="${round2(x)}" y="${round2(y)}" width="${round2(w)}" height="${round2(h)}" fill="none" stroke="${escXml(this.strokeStyle)}" stroke-width="${round2(this.lineWidth)}"/>`,
    );
  }
  clearRect(): void {
    /* transparent pass — background rect is decided once in toSVG */
  }
  private xf: number[] = [1, 0, 0, 1, 0, 0];
  private stack: number[][] = [];
  save(): void {
    this.stack.push([...this.xf]);
  }
  restore(): void {
    const m = this.stack.pop();
    if (m) this.xf = m;
  }
  setTransform(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0): void {
    this.xf = [a, b, c, d, e, f];
  }
  translate(x: number, y: number): void {
    const [a, b, c, d, e, f] = this.xf;
    this.xf = [a, b, c, d, e + a * x + c * y, f + b * x + d * y];
  }
  rotate(rad: number): void {
    const [a, b, c, d, e, f] = this.xf;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    this.xf = [a * cos + c * sin, b * cos + d * sin, a * -sin + c * cos, b * -sin + d * cos, e, f];
  }
  private apply(x: number, y: number): [number, number] {
    const [a, b, c, d, e, f] = this.xf;
    return [round2(a * x + c * y + e), round2(b * x + d * y + f)];
  }
  private rotation(): number {
    // glyph rotation carried by the transform (uniform scale here)
    return (Math.atan2(this.xf[1], this.xf[0]) * 180) / Math.PI;
  }
  fillText(text: string, x: number, y: number): void {
    const f = parseFont(this.font);
    const anchor = anchorOf(this.textAlign);
    const base = this.textBaseline && this.textBaseline !== 'alphabetic' ? ` dominant-baseline="${escXml(this.textBaseline)}"` : '';
    const [tx, ty] = this.apply(x, y);
    const rot = this.rotation();
    const rotAttr = Math.abs(rot) > 0.01 ? ` transform="rotate(${round2(rot)} ${tx} ${ty})"` : '';
    this.out.push(
      `<text x="${tx}" y="${ty}" font-family="${escXml(f.family)}" font-size="${f.size}"${f.bold ? ' font-weight="bold"' : ''} text-anchor="${anchor}"${base}${rotAttr} fill="${escXml(this.fillStyle)}">${escXml(text)}</text>`,
    );
  }
  measureText(text: string): { width: number } {
    return { width: this.measure(String(text), this.font) };
  }
  strokeText(text: string, x: number, y: number): void {
    const f = parseFont(this.font);
    const anchor = anchorOf(this.textAlign);
    const base = this.textBaseline && this.textBaseline !== 'alphabetic' ? ` dominant-baseline="${escXml(this.textBaseline)}"` : '';
    const [tx, ty] = this.apply(x, y);
    const rot = this.rotation();
    const rotAttr = Math.abs(rot) > 0.01 ? ` transform="rotate(${round2(rot)} ${tx} ${ty})"` : '';
    this.out.push(
      `<text x="${tx}" y="${ty}" font-family="${escXml(f.family)}" font-size="${f.size}"${f.bold ? ' font-weight="bold"' : ''} text-anchor="${anchor}"${base}${rotAttr} fill="none" stroke="${escXml(this.strokeStyle)}" stroke-width="${round2(this.lineWidth)}" stroke-linejoin="round">${escXml(text)}</text>`,
    );
  }
  elements(): string[] {
    return this.out;
  }
}

export interface VectorArt {
  svg: string;
  w: number;
  h: number;
}

export function renderVector(): VectorArt {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
  if (!canvas) throw new Error('Canvas not found');
  const live = canvas.getContext('2d');
  const w = kernel();
  const prevCanvas = w.canvas;
  const prevCtx = w.ctx;
  const rec = new Recorder((text, font) => {
    if (!live) return 0;
    try {
      live.font = font;
      return live.measureText(text).width;
    } catch {
      return 0;
    }
  });
  // The backing store may be scaled for retina screens (mmsDprK); vector
  // output stays in map units, which is what the kernel actually drew.
  const dpr = typeof w.mmsDprK === 'number' && (w.mmsDprK as number) > 0 ? (w.mmsDprK as number) : 1;
  const mapW = Math.round(canvas.width / dpr);
  const mapH = Math.round(canvas.height / dpr);
  w.canvas = { width: mapW, height: mapH };
  w.ctx = rec as unknown as CanvasRenderingContext2D;
  try {
    (w.drawmap as (n: number) => void)(1);
  } finally {
    w.canvas = prevCanvas;
    w.ctx = prevCtx;
  }
  const transparent = (w.cowpatuuuuu as number) === 1;
  const paper = typeof w.mmsCanvasCol === 'string' && w.mmsCanvasCol !== '' ? (w.mmsCanvasCol as string) : '#ffffff';
  const bg = transparent
    ? ''
    : `<rect x="0" y="0" width="${mapW}" height="${mapH}" fill="${escXml(paper)}"/>`;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${mapW}" height="${mapH}" viewBox="0 0 ${mapW} ${mapH}">` +
    bg +
    rec.elements().join('') +
    `</svg>`;
  return { svg, w: mapW, h: mapH };
}

export function downloadSVG(name: string): void {
  const { svg } = renderVector();
  downloadBlob(svgFilename(name), new Blob([svg], { type: 'image/svg+xml' }));
}

export async function downloadPDF(name: string): Promise<void> {
  const { svg, w, h } = renderVector();
  const { jsPDF } = await import('jspdf');
  await import('svg2pdf.js');
  const doc = new jsPDF({
    unit: 'pt',
    format: [w, h],
    orientation: w >= h ? 'landscape' : 'portrait',
    compress: true,
  });
  const el = new DOMParser().parseFromString(svg, 'image/svg+xml').documentElement as unknown as SVGElement;
  await (doc as unknown as { svg: (el: SVGElement, opts: { x: number; y: number; width: number; height: number }) => Promise<void> }).svg(el, {
    x: 0,
    y: 0,
    width: w,
    height: h,
  });
  doc.save(pdfFilename(name));
}
