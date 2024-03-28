import { Box, Button } from '@mui/material';

import { IS_DEMO } from '../../configuration';
import { reloadWithReset } from '../../serviceWorker/tools';
import Toolbar from '../../common/components/Toolbar';

const DemoBanner = () => {
    if (!IS_DEMO) {
        return null;
    }

    const handleClickReset = () => {
        reloadWithReset();
    }

    return (
        <Toolbar position="top" withBorder>
            <Box sx={{
                p: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                width: '100%'
            }}>
                Вы находитесь в демо режиме
                <Button variant="outlined" onClick={handleClickReset} size="small">Сброс изменений</Button>
            </Box>
        </Toolbar>
    );
}

export default DemoBanner;