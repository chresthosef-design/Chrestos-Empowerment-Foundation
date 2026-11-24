import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { loadSanityContent } from './lib/sanityContent';

// Wait briefly for CMS content so pages render with it. Falls back to homeData.js after 4s or on error.
loadSanityContent().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});
