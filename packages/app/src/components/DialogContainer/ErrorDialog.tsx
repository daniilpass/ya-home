import ErrorDialogComponent from '../../common/components/ErrorDialog';
import { useDispatch } from '../../store/hooks';

import { DialogProps } from './types';

const ErrorDialog = ({ dialog }: DialogProps) => {
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch.dialog.close();
    }

    return (
        <ErrorDialogComponent
            open={dialog?.open || false}
            content={dialog?.content}
            labelClose='Закрыть'
            onClose={handleClose}
        />
    );
}

export default ErrorDialog;