/**
 * Frontend bootstrap: attaches the React app to the DOM.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './modules/app/App';
import './styles/index.scss';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);


