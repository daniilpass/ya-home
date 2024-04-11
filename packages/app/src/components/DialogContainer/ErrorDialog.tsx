import DialogComponent from '../../common/components/Dialog';
import { useDispatch } from '../../store/hooks';
import ErrorContent from './ErrorContent';

import { DialogProps } from './types';

const ErrorDialog = ({ dialog }: DialogProps) => {
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch.dialog.close();
    }

    return (
        <DialogComponent
            open={dialog?.open || false}
            type="error"
            title="Ошибка"
            content={<ErrorContent title={dialog?.content} error={dialog?.error} />}
            labelClose='Закрыть'
            onClose={handleClose}
        />
    );
}

export default ErrorDialog;