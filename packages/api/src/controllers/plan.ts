import { NextFunction, Request, Response } from 'express';

import { Collection, Plan, PlanInfo } from '@homemap/shared';

import PlanService from '../services/planService';
import ValidationService from '../services/validationService';

export const getUserPlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plans: Collection<PlanInfo> = await PlanService.getUserPlans();

        res.json(plans);        
    } catch (error) {
        next(error);
    }
}

export const getUserPlanById = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        const planId = Number(req.params.id);
        const plan: Plan = await PlanService.getUserPlanById(planId);

        res.json(plan);
    } catch (error) {
        next(error);
    }
}

export const createUserPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ValidationService.validatePlan(req.body);

        const plan: Plan = await PlanService.createUserPlan(req.body);

        res.json(plan);
    } catch (error) {
        next(error);
    }
}

export const updateUserPlan = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {         
        ValidationService.validatePlan(req.body);

        const planId = Number(req.params.id);
        const plan: Plan = await PlanService.updateUserPlan(planId, req.body);

        res.json(plan);
    } catch (error) {
        next(error);
    }
}