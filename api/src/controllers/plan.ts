import { NextFunction, Request, Response } from 'express';

import yaclient from '../yaClient/index.js';
import { PlanRepository } from '../dal/repositories/index.js';
import { NotFoundError } from '../errors/index.js';

export const getUserPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: userId } = await yaclient.getLoginInfo();
        const plan = await PlanRepository.getPlanByUserId(userId);

        if (!plan) {
            throw new NotFoundError();
        }

        res.json(plan);
    } catch (error) {
        next(error);
    }
}