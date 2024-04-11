import { DialogProps } from '../../../common/components/Dialog';

export type DialogSettings = Pick<DialogProps, 'content' | 'open'> & {
    type: 'error' | 'crash';
    error?: Error;
}

export type DialogState = {
    active: DialogSettings | undefined,
}

export type DialogShowPayload= {
    content: string;
    error?: Error;
}
