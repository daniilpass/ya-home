import type { SelectChangeEvent, SelectProps } from '@mui/material';
import { ListItemText, MenuItem, Select } from '@mui/material';
import type { Collection } from '@homemap/shared';

import type { DeviceSelectItem } from './types';
import { memo, useCallback, useMemo } from 'react';
import { deviceTypeToName } from '../../utils/device';

import './DeviceSelect.css';

export type DeviceSelectProps = Pick<SelectProps, 'sx'> & {
    items: Collection<DeviceSelectItem>;
    selectedItemId?: string;
    onChange?: (itemId: string) => void;
}

const MenuItemContent = ({ item }: { item: DeviceSelectItem}) => (
    <ListItemText
        primary={item.name}
        primaryTypographyProps={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
        }}
        secondary={deviceTypeToName(item.type, item.subtype)}
    />
);

const SelectValue = ({ item }: { item?: DeviceSelectItem}) => (
    <ListItemText
        primary={item?.name ?? 'Выберите устройство'}
        primaryTypographyProps={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
        }}
    />
);


const DeviceSelect = ({ items, selectedItemId, onChange, sx }: DeviceSelectProps) => {
    const handleChange = useCallback((e: SelectChangeEvent<string>) => {
        onChange?.(e.target.value);
    }, [onChange]);

    const itmes = useMemo(() => {
        return Object.keys(items).map(id => (
            <MenuItem key={id} value={id}>
                <MenuItemContent item={items[id]} />
            </MenuItem>
        ));
    }, [items]);

    const renderSelectedValue = useCallback((value: string) => <SelectValue item={items[value]}/>, [items]);

    return (
        <Select
            value={selectedItemId ?? ''}
            displayEmpty
            renderValue={renderSelectedValue}
            onChange={handleChange}
            className="device-select"
            classes={{
                select: 'device-select__select'
            }}
            sx={{
                padding: '4px',
                ...sx
            }}
        >
            {itmes}
        </Select>
    );
};

export default memo(DeviceSelect);
