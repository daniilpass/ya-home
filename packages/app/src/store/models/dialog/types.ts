import { ErrorDialogProps } from '../../../common/components/ErrorDialog';

export type DialogSettings = Pick<ErrorDialogProps, 'content' | 'open'> & {
    type: 'error' | 'crash';
}

export type DialogState = {
    active: DialogSettings | undefined,
}
