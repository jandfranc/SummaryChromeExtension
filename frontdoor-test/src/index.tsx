import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { SummaryProvider } from './popup/SummaryContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <SummaryProvider>
      <App />
    </SummaryProvider>
  </React.StrictMode>,
);
