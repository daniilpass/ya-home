import { Box, Typography } from '@mui/material';

import { routes } from '../../app/router';
import RouterLinkButton from '../../common/components/RouterLinkButton';

import './style.css';

export const NotFoundPage = () => {
    return (
        <div className="not-found-page">
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
            }}>
                <Typography component="h1" variant="h5" align="center" marginBottom={1}>
                    Раздел не найден =(
                </Typography>

                <RouterLinkButton to={routes.root} variant="contained">
                    На главную
                </RouterLinkButton>
            </Box>
        </div>
    );
};
