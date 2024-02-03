import { NextFunction, Request, Response } from 'express';
import { Plan, schemas } from '@homemap/shared';

import yaclient from '../yaClient';
import { PlanRepository } from '../dal/repositories';
import { NotFoundError } from '../errors';
import { jsonValidator } from '../utils/jsonValidator';
import { SchemaValidationError } from '../errors/SchemaValidationError';

export const getUserPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Find existing user plan
        const { id: userId } = await yaclient.getLoginInfo();
        const planEntity = await PlanRepository.getUserPlan(userId);
    
        if (!planEntity) {
            throw new NotFoundError();
        }

        // Prepare response
        const plan: Plan = planEntity.toModel();
        res.json(plan);
    } catch (error) {
        next(error);
    }
}

export const updateUserPlan = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {         
        // Schema validation
        const { valid, errors } = jsonValidator.validate(req.body, schemas.planSchema);
        if (!valid) {
            throw new SchemaValidationError(errors);
        }

        // Find existing user plan by plan id
        const planId = Number(req.params.id);
        const { id: _, ...planJson }: Plan = req.body;
        const { id: userId } = await yaclient.getLoginInfo();
        const existingPlan = await PlanRepository.getUserPlanById(userId, planId);

        if (!existingPlan) {
            throw new NotFoundError();
        }

        // Update entity
        existingPlan.json = planJson;
        await existingPlan.save()

        // Prepare response
        const updatedPlan: Plan = existingPlan.toModel();
        res.json(updatedPlan);
    } catch (error) {
        next(error);
    }
}