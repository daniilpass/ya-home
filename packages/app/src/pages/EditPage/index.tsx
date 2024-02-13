import { useParams } from 'react-router-dom';

import HomeEditor from '../../widgets/HomeEditor';

import './style.css';

const EditPage = () => {
    const { id } = useParams();

    return (
        <div className="edit-page">
            <HomeEditor planId={Number(id)} mode="edit" />
        </div>
    );
}

export default EditPage;
