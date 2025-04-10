
import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { COLORS } from '@homemap/shared';

import { PlanSettingsDialogContent } from './PlanSettingsDialogContent';
import { DialogValue, DialogProps } from './types';

export const PlanSettingsDialog = ({
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
