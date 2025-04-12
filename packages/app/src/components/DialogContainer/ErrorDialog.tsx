import DialogComponent from '../../common/components/Dialog';
import { useDispatch } from '../../store/hooks';

import type { DialogProps } from './types';

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
            content={dialog?.content}
            labelClose="Закрыть"
            onClose={handleClose}
        />
    );
}

export default ErrorDialog;