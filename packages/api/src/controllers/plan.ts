import { NextFunction, Request, Response } from 'express';

import { Collection, Plan, PlanInfo } from '@homemap/shared';

import PlanService from '../services/planService';
import ValidationService from '../services/validationService';
import { UnauthorizedError } from '../errors/UnauthorizedError';

export const getUserPlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userInfo?.yaUserId;
        if (!userId) {
            throw new UnauthorizedError();
        }

        const plans: Collection<PlanInfo> = await new PlanService().getUserPlans(userId);

        res.json(plans);        
    } catch (error) {
        next(error);
    }
}

export const getUserPlanById = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        const userId = req.userInfo?.yaUserId;
        if (!userId) {
            throw new UnauthorizedError();
        }

        const planId = Number(req.params.id);
        const plan: Plan = await new PlanService().getUserPlanById(userId, planId);

        res.json(plan);
    } catch (error) {
        next(error);
    }
}

export const createUserPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userInfo?.yaUserId;
        if (!userId) {
            throw new UnauthorizedError();
        }

        ValidationService.validatePlan(req.body);

        const plan: Plan = await new PlanService().createUserPlan(userId, req.body);

        res.json(plan);
    } catch (error) {
        next(error);
    }
}

export const updateUserPlan = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        const userId = req.userInfo?.yaUserId;
        if (!userId) {
            throw new UnauthorizedError();
        }
   
        ValidationService.validatePlan(req.body);

        const planId = Number(req.params.id);
        const plan: Plan = await new PlanService().updateUserPlan(userId, planId, req.body);

        res.json(plan);
    } catch (error) {
        next(error);
    }
}