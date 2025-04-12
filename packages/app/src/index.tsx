import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { IS_DEMO } from './configuration';
import * as serviceWorker from './serviceWorker';
import App from './app';
import './index.css';

const swReadyPromise = IS_DEMO ? serviceWorker.register() : serviceWorker.unregister();

swReadyPromise
    .then(() => {
        const root = ReactDOM.createRoot(
            document.getElementById('root') as HTMLElement
        );

        root.render(
            <>
                <CssBaseline />
                <App />
            </>
        );
    })
    .catch((error) => {
        document.getElementById('root')!.innerText = error.message ?? 'Ошибка загрузка ServiceWorker';
    });