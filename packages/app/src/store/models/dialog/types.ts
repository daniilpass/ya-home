import { DialogProps } from '../../../common/components/Dialog';

export type DialogSettings = Pick<DialogProps, 'content' | 'open'> & {
    type: 'error' | 'crash';
}

export type DialogState = {
    active: DialogSettings | undefined,
}
