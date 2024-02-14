import {Route, Routes} from 'react-router-dom';

import { routes } from './routes';
import MainPage from '../pages/MainPage';
import ViewPage from '../pages/ViewPage';
import EditPage from '../pages/EditPage';

const App = () => {
    return (
        <Routes>
            <Route path={routes.root} element={<MainPage />} />

            <Route path={routes.view}>
                <Route path=":id" element={<ViewPage />} />
            </Route>

            <Route path={routes.edit}>
                <Route path=":id" element={<EditPage />} />
            </Route>
        </Routes>        
    );
}

export default App;
