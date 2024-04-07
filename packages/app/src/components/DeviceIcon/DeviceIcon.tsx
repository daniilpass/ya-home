import { FC } from 'react';

import { DeviceIconName, icons } from './icons';
import { SxProps, Theme } from '@mui/material';

type Props = {
    name: DeviceIconName,
    sx?: SxProps<Theme>,
}

const DeviceIcon: FC<Props> = ({name, sx}) => {
    const Icon = icons[name];
    return Icon ? <Icon sx={sx} /> : null;
};

export default DeviceIcon;