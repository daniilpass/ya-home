
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { ColorResult } from 'react-color';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { Plan, Point, Size } from '@homemap/shared';

import PointInput from '../../common/components/PointInput';
import ColorPickerButton from '../../common/components/ColorPickerButton';
import VisuallyHiddenInput from '../../common/components/VisuallyHiddenInput';
import { readFileAsDataURL } from '../../utils/file';
import HomeMap from '../HomeMap';

import './style.scss';

export type DialogValue= Pick<Plan, 'width' | 'height' | 'background'>;

export type DialogProps = {
    value: DialogValue;
    open: boolean;
    hideClose?: boolean;
    labelSubmit?: string;
    labelClose?: string;
    onSubmit: (value: DialogValue) => void;
    onClose: () => void;
}

type DialogContentProps = {
    value: DialogValue;
    onChange: (value: DialogValue) => void;
}

const PlanSettingsDialogContent = ({ value, onChange }: DialogContentProps) => {
    const [backgroundNaturalSize, setBackgroundNaturalSize] = useState<Size>();

    const handleColorChange = (color: ColorResult) => {
        onChange({
            ...value,
            background: {
                ...value.background,
                color: color.hex,
            }
        });
    }

    const handleDimensionsChange = (dimensions: Point) => {
        onChange({
            ...value,
            width: dimensions[0],
            height: dimensions[1],
        });
    }

    const handleImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }
        
        const imageDataURL = await readFileAsDataURL(file);

        onChange({
            ...value,
            background: {
                ...value.background,
                image: imageDataURL,
            }
        });
    }

    const handleBackgroundLoad = (e: SyntheticEvent<HTMLImageElement>) => {
        const imageEl = e.target as HTMLImageElement;
        setBackgroundNaturalSize({
            width: imageEl.naturalWidth,
            height: imageEl.naturalHeight,
        });        
    }

    const handleClickFitToBackground = () => {
        if (!backgroundNaturalSize) {
            return;
        }

        onChange({
            ...value,
            width: backgroundNaturalSize.width,
            height: backgroundNaturalSize.height,
        });
    }

    const dimensions: Point = [value.width, value.height];
    const color = value.background.color;
    const image = value.background.image;

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
                        component="label"
                        variant='contained'
                        startIcon={<CloudUploadIcon />}
                        sx={{width: '100%'}}
                        size='large'
                    >
                        Загрузить
                        <VisuallyHiddenInput
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleImageFileChange}
                        />
                    </Button>
                
                    <Divider variant="middle" textAlign="left">Заливка</Divider>
                    <ColorPickerButton
                        color={color}
                        onChange={handleColorChange}
                        sx={{width: '100%'}}
                    />

                    <Divider variant="middle" textAlign="left">Размеры</Divider>
                    <Box>
                        <PointInput
                            value={dimensions}
                            onChange={handleDimensionsChange}
                            labelX='ширина'
                            labelY='высота'
                            vertical
                        />
                        <Button
                            variant="outlined"
                            sx={{ width: '100%', marginTop: 1 }}
                            disabled={!backgroundNaturalSize}
                            onClick={handleClickFitToBackground}
                        >
                            Подогнать
                        </Button>
                    </Box>
                </Box>
                <Box sx={{
                    width: '600px',
                    height: '400px',
                }}>
                    <HomeMap
                        background={{
                            color,
                            image,
                        }}
                        onBackgroundLoad={handleBackgroundLoad}
                        width={value.width}
                        height={value.height}
                        allowScale={true}
                        allowInitialScale={true}
                        styles={{
                            wrapper: {
                                backgroundColor: undefined,
                            }
                        }}
                    />
                </Box>
            </Box>
        </DialogContent>
    )
}

const PlanSettingsDialog = ({
    value,
    open,
    hideClose,
    labelSubmit,
    labelClose,
    onClose,
    onSubmit,
}: DialogProps) => {
    // store and change copy of value
    const [dialogValue, setDialogValue] = useState<DialogProps['value']>(value);

    useEffect(() => {
        if (open) {
            setDialogValue(value);
        }
    }, [value, open]);

    const handleDialogValueChange = (newDialogValue: DialogValue) => {
        setDialogValue(newDialogValue);
    }

    const handleSubmit = () => {
        onSubmit(dialogValue);
    }

    const handleClose = (_?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => {
        if (reason === 'backdropClick') {
            return;
        }
        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            scroll="body"
        >
            <DialogTitle>Параметры</DialogTitle>
            {!hideClose && (
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            )}

            {dialogValue && (
                <PlanSettingsDialogContent
                    value={dialogValue}
                    onChange={handleDialogValueChange}
                />
            )}

            <DialogActions>
                <Button type="submit" onClick={handleSubmit}>{labelSubmit ?? 'Применить'}</Button>
                {!hideClose && <Button onClick={handleClose}>{labelClose ?? 'Отмена'}</Button>}
            </DialogActions>
        </Dialog>
    )
}

export default PlanSettingsDialog;
