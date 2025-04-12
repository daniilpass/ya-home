import { useEffect, useState } from 'react';

import type { Collection, PlanInfo } from '@homemap/shared';

import ApiClient from '../../api';
import AppLoader from '../../components/AppLoader';
import { HomeEmpty } from '../../widgets/HomeEmpty';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../app/router';
import { useDispatch } from '../../store/hooks';

import './style.css';

export const MainPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEmpty, setIsEmpty] = useState<boolean>(true);

    useEffect(() => {
        ApiClient
            .getPlans()
            .then((planInfos: Collection<PlanInfo>) => {
                const planIds = Object.keys(planInfos);
                if (planIds.length > 0) {
                    // setIsLoading(false);
                    // setIsEmpty(true);
                    navigate(`${routes.view}/${planIds[0]}`);
                } else {
                    setIsLoading(false);
                    setIsEmpty(true);
                }
            })
            .catch(() => {
                dispatch.dialog.crash('Не удалось зарузить список планов');
            });
    }, [navigate, dispatch]);

    return (
        <div className="main-page">
            <AppLoader isLoading={isLoading} />
            { isEmpty && <HomeEmpty /> }
        </div>
    );
};
