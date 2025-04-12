import React, { useMemo } from 'react';

import { ListItemButton, ListItemText, Tooltip, } from '@mui/material';

import { deviceTypeToName } from '../../utils/device';

import type { DeviceListItemProps } from './types';

const DeviceListItem = ({ item, selected, withTooltip, onClick }: DeviceListItemProps) => {
    const itemComponent = useMemo(() => (
        <ListItemButton
            selected={selected}
            onClick={(e) => onClick(item.id, e)}
        >
            <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                }}
                secondary={deviceTypeToName(item.type, item.subtype)}
            />
        </ListItemButton>
    ), [item, selected, onClick]);

    return (
        withTooltip
        ? (
            <Tooltip title={item.name} placement="right" arrow>
                {itemComponent}
            </Tooltip>
        )
        : itemComponent
    );
};

export default DeviceListItem;