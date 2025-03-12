
import { useCallback, useMemo } from 'react';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { DeviceIcon, DeviceIconName } from '../../../../components/DeviceIcon'

import './IconPicker.css';

export type IconPickerProps = {
    value?: DeviceIconName;
    options: DeviceIconName[];
    onChange?: (value: DeviceIconName) => void;
}

export const IconPicker = ({
    value,
    options,
    onChange,
}: IconPickerProps) => {
    const iconOptions = useMemo(() => {
        return options.map((option) => (
            <MenuItem key={option} value={option}>
                <DeviceIcon name={option}/>
            </MenuItem>
        ))
    }, [options]);

    const handleChange = useCallback((event: SelectChangeEvent<DeviceIconName>) => {
        onChange?.(event.target.value as DeviceIconName);
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