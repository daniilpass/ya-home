import { Plan } from '@homemap/shared';

export type DialogValue= Pick<Plan, 'width' | 'height' | 'background'>;

export type DialogProps = {
    value: DialogValue;
    open: boolean;
    hideClose?: boolean;
    labelSubmit?: string;
    labelClose?: string;
    onSubmit: (value: DialogValue) => void;
    onClose: () => void;
}

export type DialogContentProps = {
    value: DialogValue;
    onChange: (value: DialogValue) => void;
}