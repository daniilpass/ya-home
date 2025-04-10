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
import AuthPage from '../pages/AuthPage';
import { PageSuspense } from '../components/PageSuspense';

export const routes = {
    root: '/',
    view: '/view',
    edit: '/edit',
    auth: '/auth',
}

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout />}>
            <Route path={routes.root} element={<PageSuspense><MainPage /></PageSuspense>} />

            <Route path={routes.view}>
                <Route path=":id" element={<PageSuspense><ViewPage /></PageSuspense>} />
            </Route>

            <Route path={routes.edit}>
                <Route path=":id" element={<PageSuspense><EditPage /></PageSuspense>} />
            </Route>

            <Route path={routes.auth} element={<PageSuspense><AuthPage /></PageSuspense>} />

            <Route path="*" element={<PageSuspense><NotFoundPage /></PageSuspense>} />
        </Route>
    )
);
