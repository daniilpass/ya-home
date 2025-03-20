

import { ChangeEvent, useState } from 'react';

import { Divider, IconButton, Menu } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SettingsIcon from '@mui/icons-material/Settings';
import ExportIcon from '@mui/icons-material/Upgrade';
import SyncIcon from '@mui/icons-material/Sync';

import { COLORS } from '@homemap/shared';

import ImportIcon from '../../../../common/components/Icons/ImportIcon';

import { PlanActionsEnum, EditorTopbarProps } from './types'
import VisuallyHiddenInput from '../../../../common/components/VisuallyHiddenInput';
import { MenuItem } from './components/Menu';

export const EditorTopbarMenu = ({ actionsInProgress, onItemClick }: EditorTopbarProps) => {
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(menuAnchor);
    const openMenu = (e: React.MouseEvent<HTMLElement>) => {
        setMenuAnchor(e.currentTarget)
    }
    const closeMenu = (e: React.MouseEvent<HTMLElement>) => {
        setMenuAnchor(null)
    }

    const handleClickSettings = () => onItemClick({ type: PlanActionsEnum.Settings });
    const handleChangeImportFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }
        onItemClick({
            type: PlanActionsEnum.Import,
            file
        });
        e.target.value = '';
    }
    const handleClickExport = () => onItemClick({ type: PlanActionsEnum.Export });
    const handleClickSyncDevices = () => onItemClick({ type: PlanActionsEnum.SyncDevices });

    return (
        <>
            <IconButton onClick={openMenu} sx={{ color: COLORS.primary }} >
                <MoreHorizIcon />
            </IconButton>

            <Menu
                open={menuOpen}
                anchorEl={menuAnchor}
                onClose={closeMenu}
                onClick={closeMenu}
            >
                <MenuItem onClick={handleClickSettings} icon={<SettingsIcon />} >
                    Параметры
                </MenuItem>

                <MenuItem onClick={handleClickSyncDevices} icon={<SyncIcon />} isLoading={actionsInProgress.includes(PlanActionsEnum.SyncDevices)}>
                    Синхр. устройства
                </MenuItem>

                <Divider orientation="horizontal" />

                <MenuItem onClick={handleClickExport} icon={<ExportIcon />} isLoading={actionsInProgress.includes(PlanActionsEnum.Export)}>
                    Экспорт
                </MenuItem>

                <MenuItem icon={<ImportIcon />} isLoading={actionsInProgress.includes(PlanActionsEnum.Import)} >
                    Импорт
                    <VisuallyHiddenInput
                        type="file"
                        accept="application/json"
                        onChange={handleChangeImportFile}
                    />
                </MenuItem>
            </Menu>
        </>
    )
}