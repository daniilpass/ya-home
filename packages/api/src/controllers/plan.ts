import { NextFunction, Request, Response } from 'express';
import { Plan } from '@homemap/shared/index.js';

import yaclient from '../yaClient/index.js';
import { PlanRepository } from '../dal/repositories/index.js';
import { NotFoundError } from '../errors/index.js';

export const getUserPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: userId } = await yaclient.getLoginInfo();
        const response = await PlanRepository.getPlanByUserId(userId);
        const plan: Plan | undefined = response?.json;
    
        if (!plan) {
            throw new NotFoundError();
        }

        res.json(plan);
    } catch (error) {
        next(error);
    }
}