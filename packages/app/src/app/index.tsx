
import {Route, Routes, BrowserRouter} from 'react-router-dom';
import { Provider } from 'react-redux';

import { routes } from './routes';
import MainPage from '../pages/MainPage';
import ViewPage from '../pages/ViewPage';
import EditPage from '../pages/EditPage';
import NotFoundPage from '../pages/NotFoundPage';
import AlertContainer from '../components/AlertContainer';
import { store } from '../store';

const App = () => {
    return (
        <Provider store={store}>
            <AlertContainer />
            <BrowserRouter>
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
            </BrowserRouter>
        </Provider>     
    );
}

export default App;
