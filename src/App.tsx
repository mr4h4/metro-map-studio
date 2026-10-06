import { useCallback, useEffect, useState } from 'react';
import LegacyBridge from './engine/LegacyBridge';
import Home from './pages/Home';
import Editor from './pages/Editor';
import { applyTheme, getTheme, setTheme, type Theme } from './app/store';

type Route = { view: 'home' } | { view: 'editor'; id?: string };

function parseRoute(): Route {
  const q = new URLSearchParams(location.search);
  if (q.get('view') === 'editor' || q.get('id')) {
    return { view: 'editor', id: q.get('id') || undefined };
  }
  return { view: 'home' };
}

function toQuery(r: Route): string {
  if (r.view === 'home') return '/';
  const q = new URLSearchParams({ view: 'editor' });
  if (r.id) q.set('id', r.id);
  return `/?${q.toString()}`;
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute);
  const [theme, setThemeState] = useState<Theme>(() => {
    const t = getTheme();
    applyTheme(t);
    return t;
  });

  useEffect(() => {
    const onPop = () => setRoute(parseRoute());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((r: Route) => {
    history.pushState(null, '', toQuery(r));
    setRoute(r);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((t) => {
      const next: Theme = t === 'dark' ? 'light' : 'dark';
      setTheme(next);
      return next;
    });
  }, []);

  const sessionKey = route.view === 'editor' ? `id=${route.id ?? ''}` : 'home';

  return (
    <div className="h-full">
      {/* Hidden fields the legacy kernel reads/writes; never visible, never re-rendered meaningfully */}
      <LegacyBridge />
      {route.view === 'home' ? (
        <Home
          theme={theme}
          onToggleTheme={toggleTheme}
          onEdit={(id) => navigate({ view: 'editor', id })}
        />
      ) : (
        <Editor
          projectId={route.id ?? null}
          sessionKey={sessionKey}
          theme={theme}
          onToggleTheme={toggleTheme}
          onHome={() => navigate({ view: 'home' })}
          onBound={(id) => navigate({ view: 'editor', id })}
        />
      )}
    </div>
  );
}
