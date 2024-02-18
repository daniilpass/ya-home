import { ChangeEvent } from 'react';
import { Box, Button, Divider } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import ExportIcon from '@mui/icons-material/Upgrade';

import ImportIcon from '../../../../common/components/Icons/ImportIcon';
import VisuallyHiddenInput from '../../../../common/components/VisuallyHiddenInput';
import LoadingButton from '../../../../common/components/LoadingButton';
import { PlanActionsEnum } from './constants';


export type PlanActionEvent = {
    type: PlanActionsEnum;
    file?: File;
}

export type Props = {
    onClick: (event: PlanActionEvent) => void;
    actionsInProgress: PlanActionsEnum[];
}

const PlanActions = ({
    onClick,
    actionsInProgress,
}: Props) => {
    const handleChangeImportFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }
        onClick({
            type: PlanActionsEnum.Import,
            file
        });
        e.target.value = '';
    }

    const handleClickSave= () => onClick({ type: PlanActionsEnum.Save });
    const handleClickSettings = () => onClick({ type: PlanActionsEnum.Settings });
    const handleClickExport = () => onClick({ type: PlanActionsEnum.Export });

    return (
        <Box sx={{
            p: "8px",
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 1,
            width: '100%',
        }}>
            <LoadingButton
                onClick={handleClickSave}
                startIcon={<SaveIcon />}
                isLoading={actionsInProgress.includes(PlanActionsEnum.Save)}
            >
                Сохранить
            </LoadingButton>

            <Button onClick={handleClickSettings} startIcon={<SettingsIcon />}>
                Параметры
            </Button>

            <Divider orientation="vertical" />

            <LoadingButton
                onClick={handleClickExport}
                startIcon={<ExportIcon />}
                isLoading={actionsInProgress.includes(PlanActionsEnum.Export)}
            >
                Экспорт
            </LoadingButton>

            <LoadingButton
                component="label"
                startIcon={<ImportIcon />}
                isLoading={actionsInProgress.includes(PlanActionsEnum.Import)}
            >
                Импорт
                <VisuallyHiddenInput
                    type="file"
                    accept="application/json"
                    onChange={handleChangeImportFile}
                />
            </LoadingButton>
        </Box>
    )
}

export default PlanActions;