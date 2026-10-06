/* Metro Map Studio — editor extras: precision cursor, Ctrl+Z/Y, project binding.
 * The drawing engine itself (js/app.js) is untouched. */
(function () {
  'use strict';

  var projectId = null;
  var saveStateEl = null;

  function params() {
    try { return new URLSearchParams(location.search); }
    catch (e) { return { get: function () { return null; } }; }
  }
  function setSaveState(t) {
    if (saveStateEl) saveStateEl.textContent = t;
  }
  function fmtTime(ts) {
    try { return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
    catch (e) { return ''; }
  }

  /* ---------- project binding (waits for the legacy engine boot) ---------- */
  function engineReady() {
    return (typeof window.drawmap === 'function') &&
           (typeof window.mousemoded !== 'undefined') && window.mousemoded === 1;
  }
  function bindProject() {
    var q = params();
    var id = q.get('id');
    var sample = q.get('sample');
    var tries = 0;
    (function wait() {
      tries++;
      if (!engineReady()) {
        if (tries < 120) { setTimeout(wait, 50); return; }
        setSaveState('Editor failed to start');
        return;
      }
      apply(id, sample);
    })();
  }
  function apply(id, sample) {
    var nameEl = document.getElementById('projectName');
    if (id) {
      var p = window.mmsStore.get(id);
      if (!p) {
        projectId = null;
        if (nameEl) nameEl.textContent = 'Untitled';
        setSaveState('Project not found — scratch session');
        return;
      }
      projectId = id;
      if (nameEl) nameEl.textContent = p.name;
      if (p.code) {
        (0, eval)(p.code); // same global semantics as the Load dialog
        window.routechange();
        window.drawmap(1);
        setSaveState(p.code ? ('Saved ' + fmtTime(p.updatedAt)) : 'No local copy yet');
      } else {
        // blank project: same statements as the legacy "New project" action
        (0, eval)('curvenum = 2;fontzsize = 8;setroutes(1);drawmap(1)');
        setSaveState('Blank canvas — press Save');
      }
      return;
    }
    if (sample === 'demo') {
      (0, eval)('setroutes(4);qwwee()');
      window.routechange();
      window.drawmap(1);
    }
    // sample=default (or none): engine already booted its default sample
    if (nameEl) nameEl.textContent = 'Untitled';
    setSaveState('Scratch — press Save to keep it');
  }

  function captureCode() {
    window.thebigsave(); // legacy generator -> fills #ttxt2
    var code = document.getElementById('ttxt2').value;
    document.getElementById('saver').style.display = 'none';
    return code;
  }

  window.mmsSaveProject = function () {
    if (!engineReady()) { alert('The editor is still starting — try again in a second.'); return; }
    var code = captureCode();
    if (projectId) {
      var p = window.mmsStore.update(projectId, { code: code });
      var nameEl = document.getElementById('projectName');
      if (nameEl && p) nameEl.textContent = p.name;
      setSaveState('Saved ' + fmtTime(Date.now()));
    } else {
      var name = prompt('Name for this project:', 'Untitled plan');
      if (name == null) return;
      var created = window.mmsStore.create(name, code);
      projectId = created.id;
      try { history.replaceState(null, '', 'editor.html?id=' + encodeURIComponent(projectId)); }
      catch (e) {}
      document.getElementById('projectName').textContent = created.name;
      setSaveState('Saved ' + fmtTime(created.updatedAt));
    }
  };

  window.mmsRenameProject = function () {
    if (!projectId) { window.mmsSaveProject(); return; }
    var p = window.mmsStore.get(projectId);
    var name = prompt('Rename project:', p ? p.name : 'Untitled plan');
    if (name == null) return;
    var updated = window.mmsStore.update(projectId, { name: name });
    if (updated) document.getElementById('projectName').textContent = updated.name;
  };

  /* ---------- precision cursor ---------- */
  function initCursor() {
    var canvas = document.getElementById('canvas');
    var cur = document.getElementById('mms-cursor');
    if (!canvas || !cur) return;
    var dot = cur.querySelector('.cur-dot');
    var lastColor = '';
    document.body.classList.add('has-cursor'); // proves alive -> native cursor hides
    function syncColor() {
      try {
        var c = window['line' + window.currentroute + 'col'];
        if (typeof c === 'string' && c !== lastColor) {
          lastColor = c;
          dot.style.background = c;
        }
      } catch (e) {}
    }
    canvas.addEventListener('mouseenter', function () {
      syncColor();
      cur.classList.add('on');
    });
    canvas.addEventListener('mousemove', function (ev) {
      cur.style.transform = 'translate(' + ev.clientX + 'px,' + ev.clientY + 'px)';
      syncColor();
    });
    canvas.addEventListener('mouseleave', function () {
      cur.classList.remove('on');
      cur.classList.remove('pressed');
    });
    canvas.addEventListener('mousedown', function () { cur.classList.add('pressed'); });
    document.addEventListener('mouseup', function () { cur.classList.remove('pressed'); });
  }

  /* ---------- Ctrl+Z / Ctrl+Y (skipped inside editable fields) ---------- */
  function isEditable(t) {
    if (!t || !t.tagName) return false;
    var tag = t.tagName.toUpperCase();
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable === true;
  }
  function initShortcuts() {
    document.addEventListener('keydown', function (ev) {
      var mod = ev.ctrlKey || ev.metaKey;
      if (!mod) return;
      var k = (ev.key || '').toLowerCase();
      var wantUndo = !ev.shiftKey && k === 'z';
      var wantRedo = k === 'y' || (ev.shiftKey && k === 'z');
      if (!wantUndo && !wantRedo) return;
      if (isEditable(ev.target)) return; // keep native text undo
      try {
        ev.preventDefault();
        if (wantUndo) window.undof();
        else window.redof();
      } catch (e) {}
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    saveStateEl = document.getElementById('saveState');
    initCursor();
    initShortcuts();
    bindProject();
  });
})();
