import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './app';
import {loadConfiguration} from './tools/loadConfiguration';
import ApiClient from './api';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

loadConfiguration().then(data => {
    console.log(data);
    const api = new ApiClient(data.apiHost);
    api.ping();
});

