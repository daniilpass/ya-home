import { useParams } from 'react-router-dom';

import HomeEditor from '../../widgets/HomeEditor';

import './style.css';

const NewPage = () => {
    const { id } = useParams();

    return (
        <div className="new-page">
            <HomeEditor planId={Number(id)} mode="create" />
        </div>
    );
}

export default NewPage;
