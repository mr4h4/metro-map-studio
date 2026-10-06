/* Metro Map Studio — home / project library page. */
(function () {
  'use strict';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function fmtDate(ts) {
    try { return new Date(ts).toLocaleString(); }
    catch (e) { return ''; }
  }
  function openEditor(id) {
    location.href = 'editor.html?id=' + encodeURIComponent(id);
  }
  function copyText(t, okMsg) {
    function done() { alert(okMsg); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(done, function () { fallback(); });
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = t;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); }
      catch (e) { alert('Copy failed — select the code manually.'); }
      ta.remove();
    }
  }

  function render() {
    var projects = window.mmsStore.list();
    projects.sort(function (a, b) { return (b.updatedAt || 0) - (a.updatedAt || 0); });
    var grid = document.getElementById('projectGrid');
    var empty = document.getElementById('emptyState');
    var count = document.getElementById('projCount');
    grid.textContent = '';
    count.textContent = String(projects.length);
    empty.style.display = projects.length ? 'none' : 'block';

    projects.forEach(function (p) {
      var card = el('div', 'project-card');
      var head = el('div', 'project-name-row');
      head.appendChild(el('div', 'project-name', p.name));
      card.appendChild(head);

      var meta = el('div', 'project-meta');
      var n = window.mmsStore.routeCount(p.code);
      var badge = el('span', 'route-badge', n === 1 ? '1 route' : n + ' routes');
      meta.appendChild(badge);
      meta.appendChild(el('span', '', p.code ? ('Saved ' + fmtDate(p.updatedAt)) : 'Blank canvas'));
      card.appendChild(meta);

      var actions = el('div', 'project-actions');
      var bOpen = el('button', 'btn btn-primary btn-sm', 'Open');
      bOpen.type = 'button';
      bOpen.onclick = function () { openEditor(p.id); };
      var bExp = el('button', 'btn btn-ghost btn-sm', 'Export');
      bExp.type = 'button';
      bExp.title = 'Download .json backup';
      bExp.onclick = function () { window.mmsStore.exportFile(p); };
      var bCopy = el('button', 'btn btn-ghost btn-sm', 'Copy code');
      bCopy.type = 'button';
      bCopy.title = 'Copy raw map code (works in Load dialog)';
      bCopy.onclick = function () {
        if (!p.code) { alert('This project is still blank — open it and draw something first.'); return; }
        copyText(p.code, 'Map code copied. Paste it in the editor Load dialog.');
      };
      var bDup = el('button', 'btn btn-ghost btn-sm', 'Duplicate');
      bDup.type = 'button';
      bDup.onclick = function () { window.mmsStore.duplicate(p.id); render(); };
      var bDel = el('button', 'btn btn-danger-ghost btn-sm', 'Delete');
      bDel.type = 'button';
      bDel.onclick = function () {
        if (confirm('Delete "' + p.name + '"?\nThis only removes the local copy.')) {
          window.mmsStore.remove(p.id);
          render();
        }
      };
      actions.appendChild(bOpen);
      actions.appendChild(bExp);
      actions.appendChild(bCopy);
      actions.appendChild(bDup);
      actions.appendChild(bDel);
      card.appendChild(actions);
      grid.appendChild(card);
    });
  }

  function newProject() {
    var name = prompt('Name for the new project:', 'Untitled plan');
    if (name == null) return;
    var p = window.mmsStore.create(name, '');
    openEditor(p.id);
  }

  function importFromText(text, fallbackName) {
    var parsed = window.mmsStore.parseImport(text);
    var err = document.getElementById('importError');
    if (!parsed) {
      err.textContent = 'That does not look like map code (expected setroutes(...) or a .metro.json file).';
      err.style.display = 'block';
      return;
    }
    err.style.display = 'none';
    var name = parsed.name;
    if (!name) {
      var typed = document.getElementById('importName').value;
      name = typed || fallbackName || 'Imported plan';
    }
    var p = window.mmsStore.create(name, parsed.code);
    document.getElementById('importText').value = '';
    document.getElementById('importName').value = '';
    render();
    openEditor(p.id);
  }

  document.addEventListener('DOMContentLoaded', function () {
    render();
    document.getElementById('newBtn').onclick = newProject;
    document.getElementById('newBtnEmpty').onclick = newProject;
    document.getElementById('importBtn').onclick = function () {
      importFromText(document.getElementById('importText').value, 'Imported plan');
    };
    document.getElementById('importFile').addEventListener('change', function (ev) {
      var f = ev.target.files && ev.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        importFromText(String(r.result || ''), f.name.replace(/\.(metro\.json|json|txt)$/i, ''));
      };
      r.readAsText(f);
      ev.target.value = '';
    });
  });
})();
