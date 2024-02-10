
import { CSSProperties, useEffect, useState } from 'react';
import { ColorResult } from 'react-color';
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { Plan, Point } from '@homemap/shared';

import PointInput from '../../../../common/components/PointInput';
import ColorPickerButton from '../../../../components/ColorPickerButton';

import './style.scss';

export type DialogProps = {
    value: Pick<Plan, 'width' | 'height' | 'background'>;
    open: boolean;
    onClose: () => void;
}

type DialogContentProps = Pick<DialogProps, 'value'>;

const PlanSettingsDialogContent = ({ value }: DialogContentProps) => {
    // store and change copy of value
    const [dialogValue, setDialogValue] = useState<DialogProps['value']>(value);

    useEffect(() => {
        setDialogValue(value);
    }, [value]);

    const handleColorChange = (color: ColorResult) => {
        setDialogValue({
            ...dialogValue,
            background: {
                ...dialogValue.background,
                color: color.hex,
            }
        })
    }

    const dimensions: Point = [dialogValue.width, dialogValue.height];
    const color = dialogValue.background.color;
    const image = dialogValue.background.image;
    const imageStyle: CSSProperties = {
        backgroundColor: color,
        minWidth: '400px',
        height: '100%',
    };

    return (
        <DialogContent dividers={true}>
            <Box sx={{
                display: 'flex',
                gap: 2
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 0,
                    gap: 2,
                    width: 200,
                }}>
                    <Divider variant="middle" textAlign="left">Изображение</Divider>
                    <Button
                        variant='contained'
                        sx={{width: '100%'}}
                        size='large'
                    >
                        Загрузить
                    </Button>
                
                    <Divider variant="middle" textAlign="left">Заливка</Divider>
                    <ColorPickerButton
                        color={color}
                        onChange={handleColorChange}
                        sx={{width: '100%'}}
                    />

                    <Divider variant="middle" textAlign="left">Размеры</Divider>
                    <PointInput
                        value={dimensions}
                        labelX='ширина'
                        labelY='высота'
                        vertical
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <div style={imageStyle}>
                        <img
                            className='settings__background-image'
                            src={image}
                        />
                    </div>
                </Box>
            </Box>
            
        </DialogContent>
    )
}

const PlanSettingsDialog = ({ value, open, onClose }: DialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
        >
            <DialogTitle>Параметры</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            {value && <PlanSettingsDialogContent value={value} />}
        </Dialog>
    )
}

export default PlanSettingsDialog;