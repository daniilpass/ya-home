import Dialog from '../../../../common/components/Dialog';

export type UnsavedChangesDialogProps = {
    open: boolean;
    onSubmit: () => void;
    onClose: () => void;
}

const UnsavedChangesDialog = ({ open, onSubmit, onClose }: UnsavedChangesDialogProps) => {
    return (
        <Dialog
            open={open}
            type="warning"
            title="Остались несохраненные изменения"
            content="Вы точно хотите покинуть страницу?"
            labelSubmit="Покинуть страницу"
            labelClose="Остаться"
            onSubmit={onSubmit}
            onClose={onClose}
        />
    );
}

export default UnsavedChangesDialog;