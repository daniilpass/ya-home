
import {Route, Routes, BrowserRouter} from 'react-router-dom';
import { Provider } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';

import { store } from '../store';
import MainPage from '../pages/MainPage';
import ViewPage from '../pages/ViewPage';
import EditPage from '../pages/EditPage';
import NotFoundPage from '../pages/NotFoundPage';
import AlertContainer from '../components/AlertContainer';
import DialogContainer from '../components/DialogContainer';
import ErrorFallback from '../components/ErrorFallback';

import { routes } from './routes';

const App = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <AlertContainer />
                <DialogContainer />
                <ErrorBoundary fallback={<ErrorFallback />} >
                    <Routes>
                        <Route path={routes.root} element={<MainPage />} />

                        <Route path={routes.view}>
                            <Route path=":id" element={<ViewPage />} />
                        </Route>

                        <Route path={routes.edit}>
                            <Route path=":id" element={<EditPage />} />
                        </Route>

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </ErrorBoundary>
            </BrowserRouter>
        </Provider>     
    );
}

export default App;
