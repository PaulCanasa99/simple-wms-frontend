import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { startApp } from './bootstrap';
import './styles/global.css';
import './i18n';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root not found');

const root = createRoot(rootEl);

startApp().then((demoMode) => {
  root.render(
    <StrictMode>
      <App demoMode={demoMode} />
    </StrictMode>,
  );
});
