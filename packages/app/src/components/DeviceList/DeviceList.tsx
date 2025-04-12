import type { MouseEvent as ReactMouseEvent } from 'react';
import { List } from '@mui/material'

import DeviceListItem from './DeviceListItem';
import type { DeviceListProps } from './types';

const DeviceList = ({ items, selectedItemId, withTooltip, onItemClick, sx }: DeviceListProps) => {
    const handleItemClick = (id: string, event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
        onItemClick(id, event);
    }

    return (
        <>
            <List component="div" sx={sx}>
                {
                    Object.keys(items).map(id => (
                        <DeviceListItem
                            key={id}
                            item={items[id]}
                            selected={id === selectedItemId}
                            withTooltip={withTooltip}
                            onClick={handleItemClick}
                        />
                    ))
                }
            </List>
        </>
    )
}

export default DeviceList;
