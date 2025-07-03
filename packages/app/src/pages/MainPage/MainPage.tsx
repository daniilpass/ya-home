
import { useLoaderData } from 'react-router-dom';

import { HomeEmpty } from '../../widgets/HomeEmpty';
import type { LoaderResponse } from '../../app/types';

import './style.css';

export const MainPage = () => {
    const { success, data } = useLoaderData<LoaderResponse>();

    return (
        <div className="main-page">
            { success && !data && <HomeEmpty /> }
        </div>
    );
};
