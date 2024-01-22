import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import ConfigurationContextProvider from './providers/ConfigurationContextProvider';
import App from './app';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <BrowserRouter>
        <ConfigurationContextProvider>
            <CssBaseline />
            <App />
        </ConfigurationContextProvider>
    </BrowserRouter>
);