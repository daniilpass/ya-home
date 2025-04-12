import { PlanEntity } from '../entities';

const getUserPlanAll = (userId: string): Promise<PlanEntity[] | null> => {
    return PlanEntity.findAll({
        where: { userId }
    });
};

const getUserPlanById = (userId: string, planId: number): Promise<PlanEntity | null> => {
    return PlanEntity.findOne({
        where: { id: planId, userId }
    });
};

export const PlanRepository = {
    getUserPlanAll,
    getUserPlanById,
};