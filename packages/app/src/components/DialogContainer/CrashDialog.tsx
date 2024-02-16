import ErrorDialogComponent from '../../common/components/ErrorDialog';
import { routes } from '../../app/routes';

import { DialogProps } from './types';

const CrashDialog = ({ dialog }: DialogProps) => {
    const handleSubmit = () => {
        window.location.href = routes.root;
    }

    const handleClose = () => {
        window.location.reload();
    }

    return (
        <ErrorDialogComponent
            open={dialog?.open || false}
            content={dialog?.content}
            labelSubmit='На главную'
            labelClose='Перезагрузить'
            onSubmit={handleSubmit}
            onClose={handleClose}
        />
    );
}

export default CrashDialog;