
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { ColorResult } from 'react-color';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { MAX_IMAGE_HEIGHT_PX, MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB, MAX_IMAGE_WIDTH_PX, MAX_PLAN_SIDE_PX, Point, Size } from '@homemap/shared';

import PointInput from '../../common/components/PointInput';
import ColorPickerButton from '../../common/components/ColorPickerButton';
import VisuallyHiddenInput from '../../common/components/VisuallyHiddenInput';
import { readFileAsDataURL } from '../../utils/file';
import HomeMap from '../HomeMap';
import { useDispatch } from '../../store/hooks';
import { PropertiesGroup } from '../FormProperties/PropertiesGroup';

import { isValidImage } from '../../utils/image';
import { DialogContentProps } from './types';

export const PlanSettingsDialogContent = ({ value, onChange }: DialogContentProps) => {
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
        try {
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

            const isValid = await isValidImage(imageDataURL, { maxWidth: MAX_IMAGE_WIDTH_PX, maxHeight: MAX_IMAGE_HEIGHT_PX });
            if (!isValid) {
                dispatch.alerts.warning('Неподдерживаемое изображение');
                e.target.value = '';
                return;
            }

            onChange({
                ...value,
                background: {
                    ...value.background,
                    image: imageDataURL,
                }
            });
        } catch (e) {
            dispatch.alerts.error('Ошибка при чтении изображения');
        }
    }

    const handleBackgroundLoad = (e: SyntheticEvent<HTMLImageElement>) => {
        const imageEl = e.target as HTMLImageElement;

        setBackgroundNaturalSize({
            width: imageEl.naturalWidth,
            height: imageEl.naturalHeight,
        });    
        
        onChange({
            ...value,
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
                            Вес до {MAX_IMAGE_SIZE_MB} МБ<br />
                            Размер до {MAX_IMAGE_WIDTH_PX}x{MAX_IMAGE_HEIGHT_PX} точек
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
                            max={MAX_PLAN_SIDE_PX}
                            min={0}
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
