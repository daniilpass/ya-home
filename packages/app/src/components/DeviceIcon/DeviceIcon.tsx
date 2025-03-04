import { FC } from 'react';

import { DeviceIconName, Icons } from './icons';
import { SxProps, Theme } from '@mui/material';

type Props = {
    name: DeviceIconName,
    sx?: SxProps<Theme>,
}

const DeviceIcon: FC<Props> = ({name, sx}) => {
    const Icon = Icons[name];
    return Icon ? <Icon sx={sx} /> : null;
};

export default DeviceIcon;