import { useNavigate } from 'react-router-dom';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';

import './style.css';
import { routes } from '../../../../app/router';

export type FabEditProps = {
    planId: number;
}

const FabEdit = ({ planId }: FabEditProps) => {
    const navigate = useNavigate();

    const handleClickEdit = () => {
        navigate(`${routes.edit}/${planId}`);
    };

    return (
        <Fab
            className="fab-edit"
            sx={{position: 'fixed'}}
            color="primary"
            size="small"
            onClick={handleClickEdit}
        >
            <EditIcon />
        </Fab>
    );
};

export default FabEdit;