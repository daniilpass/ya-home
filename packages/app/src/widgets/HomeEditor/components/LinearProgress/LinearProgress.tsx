import { Box, LinearProgress as MuiLinearProgress} from '@mui/material';

export const LinearProgress = () => (
    <Box sx={{ width: '100%', position: 'relative' }}>
        <Box sx={{ width: '100%', position: 'absolute', zIndex: 3 }}>
            <MuiLinearProgress />
        </Box>
    </Box>
)