/* Metro Map Studio — shared: theme + project library (localStorage). No engine code here. */
(function () {
  'use strict';

  var THEME_KEY = 'mms.theme';
  var PROJECTS_KEY = 'mms.projects.v1';

  /* ---------- theme ---------- */
  function getTheme() {
    try { return localStorage.getItem(THEME_KEY) || 'light'; }
    catch (e) { return 'light'; }
  }
  function applyTheme(t) {
    t = (t === 'dark') ? 'dark' : 'light';
    document.documentElement.dataset.theme = t;
    var b = document.getElementById('themeBtn');
    if (b) b.textContent = (t === 'dark') ? '\u2600 Light' : '\u25D0 Dark';
  }
  window.mmsThemeInit = function () { applyTheme(getTheme()); };
  window.mmsThemeToggle = function () {
    var t = (getTheme() === 'dark') ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    applyTheme(t);
  };
  document.addEventListener('DOMContentLoaded', window.mmsThemeInit);

  /* ---------- project store ---------- */
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }
  function loadProjects() {
    try {
      var raw = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch (e) { return []; }
  }
  function persistProjects(list) {
    try { localStorage.setItem(PROJECTS_KEY, JSON.stringify(list)); }
    catch (e) { alert('Could not save: local storage is unavailable or full.'); }
  }
  function cleanName(n) {
    n = String(n == null ? '' : n).trim().slice(0, 60);
    return n || 'Untitled plan';
  }
  function isMapCode(s) {
    return typeof s === 'string' && s.indexOf('setroutes(') !== -1;
  }
  // Accept our .json envelope OR raw map code pasted from the app.
  function parseImport(text) {
    text = String(text || '').trim();
    if (!text) return null;
    if (text.charAt(0) === '{') {
      try {
        var o = JSON.parse(text);
        if (o && typeof o.code === 'string' && isMapCode(o.code)) {
          return { name: cleanName(o.name), code: o.code };
        }
      } catch (e) { /* fall through to raw check */ }
    }
    if (isMapCode(text)) return { name: '', code: text };
    return null;
  }
  function routeCount(code) {
    var m = /setroutes\((\d+)\)/.exec(String(code || ''));
    return m ? parseInt(m[1], 10) : 0;
  }
  function download(filename, text) {
    var blob = new Blob([text], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 500);
  }
  function safeFilename(name) {
    return String(name || 'plan').trim().toLowerCase()
      .replace(/[^a-z0-9\u00C0-\u024F\u1E00-\u1EFF _-]+/gi, '')
      .replace(/[\s_]+/g, '-').replace(/-+/g, '-')
      .slice(0, 50) || 'plan';
  }

  window.mmsStore = {
    list: loadProjects,
    get: function (id) {
      var all = loadProjects();
      for (var i = 0; i < all.length; i++) {
        if (all[i] && all[i].id === id) return all[i];
      }
      return null;
    },
    create: function (name, code) {
      var all = loadProjects();
      var p = { id: uid(), name: cleanName(name), code: String(code || ''), updatedAt: Date.now() };
      all.unshift(p);
      persistProjects(all);
      return p;
    },
    update: function (id, patch) {
      var all = loadProjects();
      for (var i = 0; i < all.length; i++) {
        if (all[i] && all[i].id === id) {
          if (patch.name != null) all[i].name = cleanName(patch.name);
          if (patch.code != null) all[i].code = String(patch.code);
          all[i].updatedAt = Date.now();
          persistProjects(all);
          return all[i];
        }
      }
      return null;
    },
    remove: function (id) {
      persistProjects(loadProjects().filter(function (p) { return !p || p.id !== id; }));
    },
    duplicate: function (id) {
      var p = loadProjects().filter(function (x) { return x && x.id === id; })[0];
      if (!p) return null;
      return window.mmsStore.create(p.name + ' (copy)', p.code);
    },
    isMapCode: isMapCode,
    parseImport: parseImport,
    routeCount: routeCount,
    exportFile: function (project) {
      download(safeFilename(project.name) + '.metro.json', JSON.stringify({
        app: 'metro-map-studio', version: 1,
        name: project.name, updatedAt: project.updatedAt, code: project.code
      }, null, 2));
    }
  };
})();
