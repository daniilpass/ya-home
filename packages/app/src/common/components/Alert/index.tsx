import { Alert as MuiAlert, AlertProps as MuiAlertProps, Snackbar, SnackbarCloseReason } from '@mui/material';

export type AlertProps = {
    content?: string;
    open: boolean;
    severity?: MuiAlertProps['severity'];
    variant?: MuiAlertProps['variant'];
    autoHideDuration?: number;
    onClose?: () => void;
    onExited?: () => void;
}

export const Alert = ({ 
    content,
    open,
    severity,
    variant,
    autoHideDuration = 2000,
    onClose,
    onExited,
}: AlertProps) => {

    const handleClose = (_: unknown, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway' || reason === 'escapeKeyDown') {
            return;
        }
        onClose?.();
    }

    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            sx={{
                position: 'relative',
            }}
            TransitionProps={{
                onExited
            }}
        >
        <MuiAlert
            onClose={handleClose}
            severity={severity}
            variant={variant}
            sx={{ width: '100%' }}
        >
            {content}
        </MuiAlert>
        </Snackbar>
    );
}