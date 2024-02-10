
import React, { useState } from 'react';
import { ChromePicker, ColorChangeHandler, ColorResult } from 'react-color';
import { Popover, SxProps, Theme } from '@mui/material';

import ColorButton from './ColorButton';
import { getContrastColorHEX } from './utils';

type Props = {
    color: string;
    sx?: SxProps<Theme>;
    onChange?: ColorChangeHandler | undefined;
}


const ColorPickerButton = ({ color, sx, onChange }: Props) => {
    const [pickerAnchor, setPickerAnchor] = React.useState<HTMLButtonElement | null>(null);
    const [textColor, setTextColor] = useState<string>(
        getContrastColorHEX(color)
    );
    
    const hanldeColorChange = (color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => {
        setTextColor(getContrastColorHEX(color.hex));
        onChange?.(color, event);
    }

    const handlePickerOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setPickerAnchor(event.currentTarget);
    }

    const handlePickerClose = () => {
        setPickerAnchor(null);
    }

    const pickerOpen = !!pickerAnchor;

    return (
        <>
            <ColorButton
                bgColor={color}
                textColor={textColor}
                onClick={handlePickerOpen}
                size='large'
                variant='contained'
                sx={sx}
            >
                {color}
            </ColorButton>
            <Popover
                open={pickerOpen}
                onClose={handlePickerClose}
                anchorEl={pickerAnchor}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <ChromePicker 
                    color={color}
                    onChange={hanldeColorChange}
                    disableAlpha
                />                
            </Popover>
        </>
    )
}

export default ColorPickerButton;