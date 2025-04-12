import {FC, useEffect, useState} from 'react';
import { Backdrop, Box } from '@mui/material';

import Loader from '../../common/components/Loader';

type Props = {
    isLoading: boolean;
    opacity?: 'full' | 'half'
}

const transitionDuration = 400;

const AppLoader: FC<Props> = ({
    isLoading,
    opacity = 'full',
}) => {
    const [display, setDisplay] = useState(true);

    useEffect(() => {
        if (isLoading) {
            setDisplay(true);
        }
    }, [isLoading]);

    return (
        <Backdrop
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                background: opacity === 'full' ? '#97cbfe' : undefined,
            }}
            open={isLoading}
            transitionDuration={transitionDuration}
            onTransitionEnd={() => setDisplay(false)}
            appear={false}
        >
            {display && (
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Loader color='white' />
                </Box>
            )}
        </Backdrop>
    )
}

export default AppLoader;
