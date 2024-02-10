
import { ChangeEvent, useEffect, useState } from 'react';
import { ColorResult } from 'react-color';
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { Plan, Point } from '@homemap/shared';

import PointInput from '../../../../common/components/PointInput';
import ColorPickerButton from '../../../../components/ColorPickerButton';
import HomeMap from '../../../../components/HomeMap';
import VisuallyHiddenInput from '../../../../components/VisuallyHiddenInput';

import './style.scss';
import { readFileAsDataURL } from '../../../../utils/file';

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

    const handleDimensionsChange = (value: Point) => {
        setDialogValue({
            ...dialogValue,
            width: value[0],
            height: value[1],
        })
    }

    const handleImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }
        
        const imageDataURL = await readFileAsDataURL(file);

        setDialogValue({
            ...dialogValue,
            background: {
                ...dialogValue.background,
                image: imageDataURL,
            }
        });
    }

    const dimensions: Point = [dialogValue.width, dialogValue.height];
    const color = dialogValue.background.color;
    const image = dialogValue.background.image;

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
                        {/* <Button
                            variant="outlined"
                            sx={{ width: '100%', marginTop: 1 }}
                        >
                            подогнать
                        </Button> */}
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
                        width={dialogValue.width}
                        height={dialogValue.height}
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

const PlanSettingsDialog = ({ value, open, onClose }: DialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            scroll="body"
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
