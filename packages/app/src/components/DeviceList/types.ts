import type { MouseEvent as ReactMouseEvent } from 'react';
import type { ListProps } from '@mui/material';

import type { Collection, Device } from '@homemap/shared';

export type onDeviceListItemClick = (id: string, event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void

export type DeviceListItem = Pick<Device, 'id' | 'name' | 'type' | 'subtype'>

export type DeviceListProps = Pick<ListProps, 'sx'> & {
    items: Collection<DeviceListItem>;
    selectedItemId?: string;
    withTooltip?: boolean;
    onItemClick: onDeviceListItemClick;
}

export type DeviceListItemProps = {
    item: DeviceListItem;
    selected?: boolean;
    withTooltip?: boolean;
    onClick: onDeviceListItemClick;
}