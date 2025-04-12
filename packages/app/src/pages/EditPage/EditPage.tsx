import { useParams } from 'react-router-dom';

import HomeEditor from '../../widgets/HomeEditor';
import DemoBanner from '../../widgets/DemoBanner';

import './style.css';

export const EditPage = () => {
    const { id } = useParams();

    return (
        <div className="edit-page">
            <DemoBanner />
            <HomeEditor planId={Number(id)} />
        </div>
    );
};

