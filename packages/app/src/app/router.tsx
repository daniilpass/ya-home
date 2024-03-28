import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom';

import RootLayout from './RootLayout';
import MainPage from '../pages/MainPage';
import ViewPage from '../pages/ViewPage';
import EditPage from '../pages/EditPage';
import NotFoundPage from '../pages/NotFoundPage';

export const routes = {
    root: '/',
    view: '/view',
    edit: '/edit',
}

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout />}>
            <Route path={routes.root} element={<MainPage />} />

            <Route path={routes.view}>
                <Route path=":id" element={<ViewPage />} />
            </Route>

            <Route path={routes.edit}>
                <Route path=":id" element={<EditPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Route>
    )
);
