import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// NOTE: no StrictMode on purpose. The legacy kernel binds the live <canvas>
// node (plus its listeners) once at boot; a StrictMode double-mount would leave
// it drawing on a detached node. See ensureLiveCanvas() in engine/adapter.ts.
createRoot(document.getElementById('root')!).render(<App />);
