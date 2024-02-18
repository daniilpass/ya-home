import {FC} from 'react';
import { Backdrop, Box } from '@mui/material';

import Loader from '../../common/components/Loader';

type Props = {
    isLoading: boolean;
    opacity?: 'full' | 'half'
}

const AppLoader: FC<Props> = ({
    isLoading,
    opacity = 'full',
}) => {
    return (
        <Backdrop
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                background: opacity === 'full' ? '#97cbfe' : undefined,
            }}
            open={isLoading}
            transitionDuration={1000}
            appear={false}
        >
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Loader color='white' />
            </Box>
        </Backdrop>
    )
}

export default AppLoader;
