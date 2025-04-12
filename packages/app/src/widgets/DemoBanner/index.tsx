import { Box, Button } from '@mui/material';

import { IS_DEMO } from '../../configuration';
import { reloadWithReset } from '../../serviceWorker/tools';
import Toolbar from '../../common/components/Toolbar';

import './style.css';

const DemoBanner = () => {
    if (!IS_DEMO) {
        return null;
    }

    const handleClickReset = () => {
        reloadWithReset();
    }

    return (
        <Toolbar position="top" withBorder className="demo-banner">
            <Box sx={{
                p: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                width: '100%'
            }}>
                Демо режим
                <Button variant="outlined" onClick={handleClickReset} size="small">Сброс изменений</Button>
            </Box>
        </Toolbar>
    );
}

export default DemoBanner;