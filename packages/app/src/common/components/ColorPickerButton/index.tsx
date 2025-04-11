
import React, { useEffect, useState } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';

import { Popover, SxProps, TextField, Theme } from '@mui/material';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';

import ColorButton from './ColorButton';
import { getContrastColorHEX } from './utils';

import classes from './style.module.css';

type Props = {
    color: string;
    sx?: SxProps<Theme>;
    onChange?: (color: string) => void;
}

const ColorPickerButton = ({ color, sx, onChange }: Props) => {
    const [pickerAnchor, setPickerAnchor] = React.useState<HTMLButtonElement | null>(null);
    const [textColor, setTextColor] = useState<string>(
        getContrastColorHEX(color)
    );
    
    useEffect(() => {
        setTextColor(getContrastColorHEX(color));
    }, [color])

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
                classes={{
                    paper: classes.popover
                }}
                open={pickerOpen}
                onClose={handlePickerClose}
                anchorEl={pickerAnchor}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <HexColorPicker className={classes.colorPicker} color={color} onChange={onChange} />
                <HexColorInput className={classes.colorInput} color={color} prefixed onChange={onChange} />
            </Popover>
        </>
    )
}

export default ColorPickerButton;