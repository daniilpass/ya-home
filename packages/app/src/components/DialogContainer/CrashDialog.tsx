import DialogComponent from '../../common/components/Dialog';
import { routes } from '../../app/router';

import { DialogProps } from './types';
import ErrorContent from './ErrorContent';

const CrashDialog = ({ dialog }: DialogProps) => {
    const handleSubmit = () => {
        window.location.href = routes.root;
    }

    const handleClose = () => {
        window.location.reload();
    }

    return (
        <DialogComponent
            open={dialog?.open || false}
            type="error"
            title="Ошибка"
            content={<ErrorContent title={dialog?.content} error={dialog?.error}  />}
            labelSubmit='На главную'
            labelClose='Перезагрузить'
            onSubmit={handleSubmit}
            onClose={handleClose}
        />
    );
}

export default CrashDialog;