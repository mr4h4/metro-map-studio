"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/engine/vector.ts
var vector_exports = {};
__export(vector_exports, {
  downloadPDF: () => downloadPDF,
  downloadSVG: () => downloadSVG,
  renderVector: () => renderVector
});
module.exports = __toCommonJS(vector_exports);

// src/app/store.ts
function slug(name) {
  return String(name || "plan").trim().toLowerCase().replace(/[^a-z0-9\u00C0-\u024F\u1E00-\u1EFF _-]+/gi, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 50) || "plan";
}
function svgFilename(name) {
  return `${slug(name)}.svg`;
}
function pdfFilename(name) {
  return `${slug(name)}.pdf`;
}
function downloadBlob(filename, blob) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 500);
}

// src/engine/vector.ts
function kernel() {
  return window;
}
var round2 = (v) => Math.round(Number(v) * 100) / 100;
function escXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function parseFont(font) {
  const m = /^(?:(bold)\s+)?(\d+(?:\.\d+)?)(pt|px)\s+(.+)$/i.exec(String(font || "").trim());
  if (!m) return { size: 10, family: "sans-serif", bold: false };
  const px = m[3].toLowerCase() === "pt" ? Number(m[2]) * (4 / 3) : Number(m[2]);
  const family = m[4].trim().replace(/^["']|["']$/g, "");
  return { size: Math.round(px * 100) / 100, family: family || "sans-serif", bold: !!m[1] };
}
function anchorOf(align) {
  switch (align) {
    case "center":
      return "middle";
    case "right":
    case "end":
      return "end";
    default:
      return "start";
  }
}
function arcTo(d, x, y, r, a0, a1, ccw) {
  const TAU = Math.PI * 2;
  let sweep = ccw ? a0 - a1 : a1 - a0;
  while (sweep < 0) sweep += TAU;
  while (sweep >= TAU) sweep -= TAU;
  const full = sweep < 1e-6 && Math.abs(a1 - a0) > 1e-6;
  const pt = (a) => [round2(x + r * Math.cos(a)), round2(y + r * Math.sin(a))];
  const large = sweep > Math.PI ? 1 : 0;
  const flag = ccw ? 0 : 1;
  if (full) {
    const [sx2, sy2] = pt(a0);
    const [mx, my] = pt(a0 + Math.PI);
    d.push(`M${sx2} ${sy2}A${round2(r)} ${round2(r)} 0 1 ${flag} ${mx} ${my}A${round2(r)} ${round2(r)} 0 1 ${flag} ${sx2} ${sy2}`);
    return d;
  }
  const [sx, sy] = pt(a0);
  const [ex, ey] = pt(a1);
  if (d.length === 0) d.push(`M${sx} ${sy}`);
  d.push(`A${round2(r)} ${round2(r)} 0 ${large} ${flag} ${ex} ${ey}`);
  return d;
}
var Recorder = class {
  constructor(measure) {
    this.measure = measure;
  }
  measure;
  strokeStyle = "#000000";
  fillStyle = "#000000";
  lineWidth = 1;
  lineCap = "butt";
  lineJoin = "miter";
  font = "10px sans-serif";
  textAlign = "start";
  textBaseline = "alphabetic";
  dash = [];
  path = [];
  out = [];
  setLineDash(dash) {
    this.dash = Array.isArray(dash) ? dash.map((v) => round2(v)) : [];
  }
  beginPath() {
    this.path = [];
  }
  closePath() {
    this.path.push("Z");
  }
  moveTo(x, y) {
    this.path.push(`M${round2(x)} ${round2(y)}`);
  }
  lineTo(x, y) {
    this.path.push(`L${round2(x)} ${round2(y)}`);
  }
  quadraticCurveTo(cpx, cpy, x, y) {
    this.path.push(`Q${round2(cpx)} ${round2(cpy)} ${round2(x)} ${round2(y)}`);
  }
  arc(x, y, r, a0, a1, ccw) {
    arcTo(this.path, x, y, r, a0, a1, !!ccw);
  }
  stroke() {
    if (this.path.length === 0) return;
    const dash = this.dash.length > 0 ? ` stroke-dasharray="${this.dash.join(" ")}"` : "";
    const cap = this.lineCap && this.lineCap !== "butt" ? ` stroke-linecap="${escXml(this.lineCap)}"` : "";
    const join = this.lineJoin && this.lineJoin !== "miter" ? ` stroke-linejoin="${escXml(this.lineJoin)}"` : "";
    this.out.push(
      `<path d="${this.path.join("")}" fill="none" stroke="${escXml(this.strokeStyle)}" stroke-width="${round2(this.lineWidth)}"${cap}${join}${dash}/>`
    );
  }
  fill() {
    if (this.path.length === 0) return;
    this.out.push(`<path d="${this.path.join("")}" fill="${escXml(this.fillStyle)}" stroke="none"/>`);
  }
  fillRect(x, y, w, h) {
    this.out.push(
      `<rect x="${round2(x)}" y="${round2(y)}" width="${round2(w)}" height="${round2(h)}" fill="${escXml(this.fillStyle)}"/>`
    );
  }
  strokeRect(x, y, w, h) {
    this.out.push(
      `<rect x="${round2(x)}" y="${round2(y)}" width="${round2(w)}" height="${round2(h)}" fill="none" stroke="${escXml(this.strokeStyle)}" stroke-width="${round2(this.lineWidth)}"/>`
    );
  }
  clearRect() {
  }
  xf = [1, 0, 0, 1, 0, 0];
  stack = [];
  save() {
    this.stack.push([...this.xf]);
  }
  restore() {
    const m = this.stack.pop();
    if (m) this.xf = m;
  }
  setTransform(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
    this.xf = [a, b, c, d, e, f];
  }
  translate(x, y) {
    const [a, b, c, d, e, f] = this.xf;
    this.xf = [a, b, c, d, e + a * x + c * y, f + b * x + d * y];
  }
  rotate(rad) {
    const [a, b, c, d, e, f] = this.xf;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    this.xf = [a * cos + c * sin, b * cos + d * sin, a * -sin + c * cos, b * -sin + d * cos, e, f];
  }
  apply(x, y) {
    const [a, b, c, d, e, f] = this.xf;
    return [round2(a * x + c * y + e), round2(b * x + d * y + f)];
  }
  rotation() {
    return Math.atan2(this.xf[1], this.xf[0]) * 180 / Math.PI;
  }
  fillText(text, x, y) {
    const f = parseFont(this.font);
    const anchor = anchorOf(this.textAlign);
    const base = this.textBaseline && this.textBaseline !== "alphabetic" ? ` dominant-baseline="${escXml(this.textBaseline)}"` : "";
    const [tx, ty] = this.apply(x, y);
    const rot = this.rotation();
    const rotAttr = Math.abs(rot) > 0.01 ? ` transform="rotate(${round2(rot)} ${tx} ${ty})"` : "";
    this.out.push(
      `<text x="${tx}" y="${ty}" font-family="${escXml(f.family)}" font-size="${f.size}"${f.bold ? ' font-weight="bold"' : ""} text-anchor="${anchor}"${base}${rotAttr} fill="${escXml(this.fillStyle)}">${escXml(text)}</text>`
    );
  }
  measureText(text) {
    return { width: this.measure(String(text), this.font) };
  }
  strokeText(text, x, y) {
    const f = parseFont(this.font);
    const anchor = anchorOf(this.textAlign);
    const base = this.textBaseline && this.textBaseline !== "alphabetic" ? ` dominant-baseline="${escXml(this.textBaseline)}"` : "";
    const [tx, ty] = this.apply(x, y);
    const rot = this.rotation();
    const rotAttr = Math.abs(rot) > 0.01 ? ` transform="rotate(${round2(rot)} ${tx} ${ty})"` : "";
    this.out.push(
      `<text x="${tx}" y="${ty}" font-family="${escXml(f.family)}" font-size="${f.size}"${f.bold ? ' font-weight="bold"' : ""} text-anchor="${anchor}"${base}${rotAttr} fill="none" stroke="${escXml(this.strokeStyle)}" stroke-width="${round2(this.lineWidth)}" stroke-linejoin="round">${escXml(text)}</text>`
    );
  }
  elements() {
    return this.out;
  }
};
function renderVector() {
  const canvas = document.getElementById("canvas");
  if (!canvas) throw new Error("Canvas not found");
  const live = canvas.getContext("2d");
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
  const dpr = typeof w.mmsDprK === "number" && w.mmsDprK > 0 ? w.mmsDprK : 1;
  const mapW = Math.round(canvas.width / dpr);
  const mapH = Math.round(canvas.height / dpr);
  w.canvas = { width: mapW, height: mapH };
  w.ctx = rec;
  try {
    w.drawmap(1);
  } finally {
    w.canvas = prevCanvas;
    w.ctx = prevCtx;
  }
  const transparent = w.cowpatuuuuu === 1;
  const paper = typeof w.mmsCanvasCol === "string" && w.mmsCanvasCol !== "" ? w.mmsCanvasCol : "#ffffff";
  const bg = transparent ? "" : `<rect x="0" y="0" width="${mapW}" height="${mapH}" fill="${escXml(paper)}"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${mapW}" height="${mapH}" viewBox="0 0 ${mapW} ${mapH}">` + bg + rec.elements().join("") + `</svg>`;
  return { svg, w: mapW, h: mapH };
}
function downloadSVG(name) {
  const { svg } = renderVector();
  downloadBlob(svgFilename(name), new Blob([svg], { type: "image/svg+xml" }));
}
async function downloadPDF(name) {
  const { svg, w, h } = renderVector();
  const { jsPDF } = await import("jspdf");
  await import("svg2pdf.js");
  const doc = new jsPDF({
    unit: "pt",
    format: [w, h],
    orientation: w >= h ? "landscape" : "portrait",
    compress: true
  });
  const el = new DOMParser().parseFromString(svg, "image/svg+xml").documentElement;
  await doc.svg(el, {
    x: 0,
    y: 0,
    width: w,
    height: h
  });
  doc.save(pdfFilename(name));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  downloadPDF,
  downloadSVG,
  renderVector
});
