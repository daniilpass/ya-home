import { PlanEntity } from '../entities';

const getUserPlan = (userId: string): Promise<PlanEntity | null> => {
    return PlanEntity.findOne({
        where: { userId }
    });
}

const getUserPlanById = (userId: string, planId: number): Promise<PlanEntity | null> => {
    return PlanEntity.findOne({
        where: { id: planId, userId }
    });
}

export {
    getUserPlan,
    getUserPlanById,
}