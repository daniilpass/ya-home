import type { FC } from 'react';

import type { SvgIconOwnProps } from '@mui/material';
import { SvgIcon } from '@mui/material';

import './style.css';

type Props = {
    color?: SvgIconOwnProps['color'] | 'white';
    size?: number,
}

const Loader: FC<Props> = ({
    color = 'primary',
    size = 52,
}) => {
    const iconColor = color === 'white' ? undefined : color; 

    return (
        <SvgIcon
            sx={{
                fontSize: size,
                color: color,
            }}
            color={iconColor}
        >
            <svg className="loader" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 15a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Zm8.66-10a1 1 0 0 1-.366 1.366l-2.598 1.5a1 1 0 1 1-1-1.732l2.598-1.5A1 1 0 0 1 20.66 7ZM7.67 14.5a1 1 0 0 1-.367 1.366l-2.598 1.5a1 1 0 1 1-1-1.732l2.598-1.5a1 1 0 0 1 1.366.366ZM20.66 17a1 1 0 0 1-1.366.366l-2.598-1.5a1 1 0 0 1 1-1.732l2.598 1.5A1 1 0 0 1 20.66 17ZM7.67 9.5a1 1 0 0 1-1.367.366l-2.598-1.5a1 1 0 1 1 1-1.732l2.598 1.5A1 1 0 0 1 7.67 9.5Z"/>
            </svg>
        </SvgIcon>
    );
};

export default Loader;
