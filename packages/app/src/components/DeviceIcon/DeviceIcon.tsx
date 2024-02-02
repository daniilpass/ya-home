import { FC } from 'react';

import { DeviceIconName, icons } from './icons';

type Props = {
    name: DeviceIconName,
}

const DeviceIcon: FC<Props> = ({name}) => {
    const Icon = icons[name];
    return Icon ? <Icon /> : null;
};

export default DeviceIcon;