import { useSelector } from '../../store/hooks';

import CrashDialog from './CrashDialog';
import ErrorDialog from './ErrorDialog';

const DialogContainer = () => {
    const dialog = useSelector((state) => state.dialog.active);

    switch (dialog?.type) {
        case 'error':
            return <ErrorDialog dialog={dialog} />
        case 'crash':
            return <CrashDialog dialog={dialog} />
        default:
            return null;
    }
}

export default DialogContainer;