
import { useCallback, useMemo } from 'react';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { COLORS, DeviceIconType } from '@homemap/shared';

import { DeviceIcon } from '../../../../components/DeviceIcon'

import './IconPicker.css';

export type IconPickerProps = {
    value?: DeviceIconType;
    options: DeviceIconType[];
    onChange?: (value: DeviceIconType) => void;
}

export const IconPicker = ({
    value,
    options,
    onChange,
}: IconPickerProps) => {
    const iconOptions = useMemo(() => {
        return options.map((option) => (
            <MenuItem key={option} value={option}>
                <DeviceIcon name={option} sx={{ fill: COLORS.primary }}/>
            </MenuItem>
        ))
    }, [options]);

    const handleChange = useCallback((event: SelectChangeEvent<DeviceIconType>) => {
        onChange?.(event.target.value as DeviceIconType);
    }, [onChange]);

    return (
        <div className='icon-picker'>
            <Select
                className='icon-picker__input'
                classes={{
                    select: 'icon-picker__input-select'
                }}
                MenuProps={{
                    classes: {
                        list: 'icon-picker__input-list',
                    }
                }}
                value={value}
                onChange={handleChange}
            >
                {iconOptions}
            </Select>
        </div>
    )
}