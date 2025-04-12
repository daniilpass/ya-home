import { Button, Dialog as MuiDialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export type DialogProps = {
    open: boolean;
    type?: 'success' | 'error' | 'info' | 'warning',
    title: string;
    content?: string;
    labelSubmit?: string;
    labelClose?: string;
    hideSubmit?: boolean;
    hideClose?: boolean;
    onSubmit?: () => void;
    onClose?: () => void;
}

const Dialog = ({
    open,
    type = 'info',
    title,
    content,
    labelSubmit = 'Submit',
    labelClose = 'Close',
    onSubmit,
    onClose,
}: DialogProps) => {
    return (
        <MuiDialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                {content}
            </DialogContent>
            <DialogActions>
                {onSubmit && <Button onClick={onSubmit} variant="contained" color={type}>{labelSubmit}</Button>}
                {onClose && <Button onClick={onClose}>{labelClose}</Button>}
            </DialogActions>
        </MuiDialog>
    );
};

export default Dialog;