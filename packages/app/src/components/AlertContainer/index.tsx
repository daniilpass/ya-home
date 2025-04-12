import { Box } from '@mui/material';

import { Alert } from '../../common/components/Alert';
import { useSelector, useDispatch } from '../../store/hooks';

const AlertContainer = () => {
    const queue = useSelector((state) => state.alerts.queue);
    const dispatch = useDispatch();

    const handleClose = (id: string) => {
        dispatch.alerts.close(id);
    };

    const handleExited = (id: string) => {
        dispatch.alerts.exited(id);
    };

    return (
        <Box sx={{
            marginTop: 6,
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%, 0)',
            zIndex: 1337,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
        }}>
            {
                [...queue].reverse().map((alert) => {
                    return <Alert
                        key={alert.id}
                        open={alert.open}
                        content={alert?.content}
                        severity={alert?.severity}
                        variant={alert?.variant}
                        onClose={() => handleClose(alert.id)}
                        onExited={() =>handleExited(alert.id)}
                    />;
                })        
            }
        </Box>
    );
};

export default AlertContainer;