

import { ChangeEvent, useRef, useState } from 'react';

import { Divider, IconButton, Menu } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SettingsIcon from '@mui/icons-material/Settings';
import ImportIcon from '@mui/icons-material/Upgrade';
import SyncIcon from '@mui/icons-material/Sync';

import { COLORS } from '@homemap/shared';

import ExportIcon from '../../../../common/components/Icons/ExportIcon';

import { PlanActionsEnum, EditorTopbarProps } from './types'
import VisuallyHiddenInput from '../../../../common/components/VisuallyHiddenInput';
import { MenuItem } from './components/Menu';

export const EditorTopbarMenu = ({ actionsInProgress, onItemClick }: EditorTopbarProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const menuOpen = Boolean(menuAnchor);

    const openMenu = (e: React.MouseEvent<HTMLElement>) => {
        setMenuAnchor(e.currentTarget)
    }

    const closeMenu = () => {
        setMenuAnchor(null)
    }

    const handleClickSettings = () => onItemClick({ type: PlanActionsEnum.Settings });

    const handleClickImport = () => {
        fileInputRef.current?.click();
    }

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
                    Скачать
                </MenuItem>

                <MenuItem onClick={handleClickImport} icon={<ImportIcon />} isLoading={actionsInProgress.includes(PlanActionsEnum.Import)} >
                    Загрузить из файла
                </MenuItem>
            </Menu>

            
            <VisuallyHiddenInput
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={handleChangeImportFile}
            />
        </>
    )
}