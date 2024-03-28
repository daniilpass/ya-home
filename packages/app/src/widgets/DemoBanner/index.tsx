import { Box, Button } from '@mui/material';

import { IS_DEMO } from '../../configuration';
import { reloadWithReset } from '../../serviceWorker/tools';

const DemoBanner = () => {
    if (!IS_DEMO) {
        return null;
    }

    const handleClickReset = () => {
        reloadWithReset();
    }

    return (
        <Box sx={{
            p: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
        }}>
            Вы находитесь в демо режиме.
            <Button variant="outlined" onClick={handleClickReset}>Сброс изменений</Button>
        </Box>
    )
}

export default DemoBanner;