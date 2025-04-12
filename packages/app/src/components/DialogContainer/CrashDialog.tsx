import DialogComponent from '../../common/components/Dialog';
import { routes } from '../../app/router';

import type { DialogProps } from './types';

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
            content={dialog?.content}
            labelSubmit="На главную"
            labelClose="Перезагрузить"
            onSubmit={handleSubmit}
            onClose={handleClose}
        />
    );
}

export default CrashDialog;