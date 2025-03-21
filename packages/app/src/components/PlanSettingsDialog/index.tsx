
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { ColorResult } from 'react-color';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { COLORS, Plan, Point, Size } from '@homemap/shared';

import { MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from '../../configuration';
import PointInput from '../../common/components/PointInput';
import ColorPickerButton from '../../common/components/ColorPickerButton';
import VisuallyHiddenInput from '../../common/components/VisuallyHiddenInput';
import { readFileAsDataURL } from '../../utils/file';
import HomeMap from '../HomeMap';
import { useDispatch } from '../../store/hooks';
import { PropertiesGroup } from '../FormProperties/PropertiesGroup';

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
    const dispatch = useDispatch();

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
        
        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            dispatch.alerts.warning(`Выбранный файл больше ${MAX_IMAGE_SIZE_MB}мб`);
            e.target.value = '';
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
                height: '200px',
                marginBottom: 2,
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

            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
                flexShrink: 0,
                gap: 2,
                width: '100%',
            }}>
                <Box sx={{
                    flex: '1',
                    gap: 2,
                }}>
                    <PropertiesGroup title="Изображение">
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
                        <Typography variant="subtitle1" color="GrayText" sx={{
                            marginTop: 1,
                            textAlign: 'center',
                        }}>
                            Размером до {MAX_IMAGE_SIZE_MB}мб
                        </Typography>
                    </PropertiesGroup>
                    
                    <PropertiesGroup title="Заливка">
                        <ColorPickerButton
                            color={color}
                            onChange={handleColorChange}
                            sx={{width: '100%'}}
                        />
                    </PropertiesGroup>
                </Box>

                <Box sx={{
                    flex: '1',
                }}>
                    <PropertiesGroup title="Размеры">
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
                    </PropertiesGroup>
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
            classes={{
                paper: 'dialog-plan-settings',
            }}
            open={open}
            onClose={handleClose}
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
                        color: COLORS.primary
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
