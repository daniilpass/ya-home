import cx from 'classnames';
import { IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SaveIcon from '@mui/icons-material/Save';
import { COLORS } from '@homemap/shared';

import Toolbar from '../../../../common/components/Toolbar'
import LoadingButton from '../../../../common/components/LoadingButton';
import { useIsMobile } from '../../../../hooks/useIsMobile';

import { EditorTopbarMenu } from './EditorTopbarMenu';
import type { EditorTopbarProps} from './types';
import { PlanActionsEnum, } from './types'
import './EditorTopbar.css';

export const EditorTopbar = ({ actionsInProgress, onItemClick }: EditorTopbarProps) => {
    const isMobile = useIsMobile();

    const handleClickExitToView = () => onItemClick({ type: PlanActionsEnum.ExitToView });
    const handleClickSave = () => onItemClick({ type: PlanActionsEnum.Save });

    const className = cx('editor-topbar', {
        'editor-topbar--mobile': isMobile,
    });
    const positon = isMobile ? 'top' : 'left';

    return (
        <Toolbar className={className} position={positon}>
            <IconButton onClick={handleClickExitToView} sx={{ color: COLORS.primary }} >
                <ExitToAppIcon sx={{ transform: 'rotate(180deg)' }} />
            </IconButton>

            <LoadingButton
                onClick={handleClickSave}
                startIcon={<SaveIcon />}
                isLoading={actionsInProgress.includes(PlanActionsEnum.Save)}
                sx={{
                    margin: 'auto',
                }}
            >
                Сохранить
            </LoadingButton>

            <EditorTopbarMenu actionsInProgress={actionsInProgress} onItemClick={onItemClick} />
        </Toolbar>
    )
}