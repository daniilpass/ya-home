
import React, { useEffect, useState } from 'react';
import { ChromePicker, ColorChangeHandler, ColorResult } from 'react-color';
import { Popover, SxProps, Theme } from '@mui/material';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';

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
    
    useEffect(() => {
        setTextColor(getContrastColorHEX(color));
    }, [color])

    const hanldeColorChange = (color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => {
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
                startIcon={<FormatColorFillIcon />}
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