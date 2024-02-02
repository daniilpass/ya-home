import { Plan } from '../model/Plan'

const getPlanByUserId = (userId: string): Promise<Plan | null> => {
    return Plan.findOne({
        where: { userId }
    });
}

export {
    getPlanByUserId,
}