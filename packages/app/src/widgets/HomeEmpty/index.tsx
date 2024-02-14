import { Box, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { routes } from '../../app/routes'
import RouterLinkButton from '../../common/components/RouterLinkButton'

export const HomeEmpty = () => {
    return (
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
                У Вас еще нет ни одного плана =(
            </Typography>            
            <RouterLinkButton LinkComponent={RouterLink} to={routes.new} variant="contained">
                Создать сейчас
            </RouterLinkButton>
        </Box>
    )
}