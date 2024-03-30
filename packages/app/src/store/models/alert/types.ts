import { AlertProps } from '../../../common/components/Alert';

export type AlertSettings = 
    & Pick<AlertProps, 'severity' | 'variant'> 
    & {
        id: string;
        content: string;
        open: boolean;
        exiting?: boolean;
    }

export type AlertState = {
    queue: AlertSettings[],
}
