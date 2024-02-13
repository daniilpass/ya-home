import { useEffect, useState } from 'react';

import { Collection, PlanInfo } from '@homemap/shared';

import ApiClient from '../../api';
import AppLoader from '../../components/AppLoader';
import { HomeEmpty } from '../../widgets/HomeEmpty';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../app/routes';

import './style.css';

const MainPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEmpty, setIsEmpty] = useState<boolean>(true);
    const navigate = useNavigate();

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
            });
    }, [navigate]);

    return (
        <div className="main-page">
            <AppLoader isLoading={isLoading} />
            { isEmpty && <HomeEmpty /> }
        </div>
    );
}

export default MainPage;
