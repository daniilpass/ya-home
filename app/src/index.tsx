import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';

import ConfigurationContextProvider from './providers/ConfigurationContextProvider';
import App from './app';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <BrowserRouter>
        <ConfigurationContextProvider>
            <App />
        </ConfigurationContextProvider>
    </BrowserRouter>
);