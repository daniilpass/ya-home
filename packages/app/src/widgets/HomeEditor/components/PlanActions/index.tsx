import { Box, Button } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';

export type Props = {
    onSave: () => void;
    onShowSettings: () => void;
}

const PlanActions = ({ onSave, onShowSettings }: Props) => {
    return (
        <Box sx={{p: "8px", display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
            <Button onClick={onSave} startIcon={<SaveIcon />}>
                Сохранить
            </Button >
            <Button onClick={onShowSettings} startIcon={<SettingsIcon />}>
                Параметры
            </Button >
        </Box>
    )
}

export default PlanActions;