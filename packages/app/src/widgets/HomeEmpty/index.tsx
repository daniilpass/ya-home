import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

import type { Plan } from '@homemap/shared';
import { DEFAULT_PLAN } from '@homemap/shared';

import type { DialogValue as PlanSettingsValue } from '../../components/PlanSettingsDialog';
import { PlanSettingsDialog } from '../../components/PlanSettingsDialog';
import { routes } from '../../app/router';
import ApiClient from '../../api';
import { store } from '../../store';

export const HomeEmpty = () => {
    const navigate = useNavigate();
    const [planSettingsOpen, setPlanSettingsOpen] = useState<boolean>(false);
    const [planSettingsValue, setPlanSettingsValue] = useState<PlanSettingsValue>();

    const handleShowSettingsDialog = () => {
        setPlanSettingsValue(DEFAULT_PLAN);
        setPlanSettingsOpen(true);
    };

    const handleCloseSettingsDialog = () => {
        setPlanSettingsOpen(false);
    };

    const handleSubmitSettingsDialog = async (value: PlanSettingsValue) => {
        const plan: Plan = {
            id: 0,
            width: value.width,
            height: value.height,
            background: {
                ...value.background,
            },
            devices: {},
        };

        try {
            const { id } = await ApiClient.createPlan(plan);
            navigate(`${routes.edit}/${id}`);
        } catch {
            store.dispatch.alerts.error('Ошибка при создании');
        }
    };

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
        }}>
            <Typography component="h1" variant="h5" align="center" marginBottom={1}>
                У Вас еще нет ни одного плана =(
            </Typography>  
          
            <Button variant="contained" onClick={handleShowSettingsDialog}>
                Создать сейчас
            </Button>
    
            <PlanSettingsDialog
                open={planSettingsOpen}
                value={planSettingsValue!}
                labelSubmit="Создать"
                onClose={handleCloseSettingsDialog}
                onSubmit={handleSubmitSettingsDialog}
            />
        </Box>
    );
};