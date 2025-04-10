import { useParams } from 'react-router-dom';

import HomeMap from '../../widgets/HomeMap';
import DemoBanner from '../../widgets/DemoBanner';

import './style.css';

export const ViewPage = () => {
    const { id } = useParams();

    return (
        <div className="view-page">
            <DemoBanner />
            <HomeMap planId={Number(id)} />
        </div>
    );
}

