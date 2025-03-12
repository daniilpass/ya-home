import { FC } from 'react';
import { SxProps, Theme } from '@mui/material';
import { deviceIcons, DeviceIconType } from '@homemap/shared';

import { Icons } from './icons';

type Props = {
    name: DeviceIconType,
    sx?: SxProps<Theme>,
}

const DeviceIcon: FC<Props> = ({name, sx}) => {
    const Icon = Icons[name] ?? Icons[deviceIcons.Blank];
    return Icon ? <Icon sx={sx} /> : null;
};

export default DeviceIcon;