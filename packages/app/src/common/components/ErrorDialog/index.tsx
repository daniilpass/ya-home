import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export type ErrorDialogProps = {
    open: boolean;
    content?: string;
    labelSubmit?: string;
    labelClose?: string;
    hideSubmit?: boolean;
    hideClose?: boolean;
    onSubmit?: () => void;
    onClose?: () => void;
}

const ErrorDialog = ({
    open,
    content,
    labelSubmit = 'Submit',
    labelClose = 'Close',
    onSubmit,
    onClose,
}: ErrorDialogProps) => {
    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth='sm'
        >
            <DialogTitle>
                Ошибка
            </DialogTitle>
            <DialogContent>
                {content}
            </DialogContent>
            <DialogActions>
                {onSubmit && <Button onClick={onSubmit}>{labelSubmit}</Button>}
                {onClose && <Button onClick={onClose}>{labelClose}</Button>}
            </DialogActions>
        </Dialog>
    )
}

export default ErrorDialog;