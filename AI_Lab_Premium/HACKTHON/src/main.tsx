import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { CartAndOrderProvider } from './context/CartAndOrderContext';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LanguageProvider>
      <AccessibilityProvider>
        <CartAndOrderProvider>
          <App />
        </CartAndOrderProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  </React.StrictMode>
);
