import { NextFunction, Request, Response } from 'express';

import { Collection, Plan, PlanInfo, schemas } from '@homemap/shared';

import { MediaStorage } from '../services/mediaStorage/MediaStorage';
import yaclient from '../yaClient';
import { PlanRepository } from '../dal/repositories';
import { BadRequestError, NotFoundError, SchemaValidationError } from '../errors';
import { jsonValidator } from '../utils/jsonValidator';
import { parseBase64DataUrl } from '../utils/dataUrl';
import { logger } from '../utils';
import { PlanEntity } from '../dal/entities';
import { mapToRecord } from '../mappers';

// TODO: set to 1
const PLAN_LIMIT = 100;

export const getUserPlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Find all existing user plans
        const { id: userId } = await yaclient.getLoginInfo();
        const planEntities = await PlanRepository.getUserPlanAll(userId);
    
        if (!planEntities) {
            throw new NotFoundError();
        }

        // Prepare response
        const response: Collection<PlanInfo> = mapToRecord(planEntities, 'id', (x: PlanEntity) => x.toModelShort());
        res.json(response);
    } catch (error) {
        next(error);
    }
}

export const getUserPlanById = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        // Find user plan by id
        const planId = req.params.id;
        const { id: userId } = await yaclient.getLoginInfo();
        const planEntity = await PlanRepository.getUserPlanById(userId, Number(planId));
    
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

export const createUserPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {         
        // Schema validation
        const { valid, errors } = jsonValidator.validate(req.body, schemas.planSchema);
        if (!valid) {
            throw new SchemaValidationError(errors);
        }

        // Request info
        const { id: _, ...planJson }: Plan = req.body;
        const { id: userId } = await yaclient.getLoginInfo();

        // Find existing user plans
        const userPlans = await PlanRepository.getUserPlanAll(userId);
        if (userPlans && userPlans.length > PLAN_LIMIT) {
            throw new BadRequestError(`Достигнут лимит: ${userPlans.length}`);
        }
        
        // Process base64 image if present
        const imageBase64 = planJson.background.image ? parseBase64DataUrl(planJson.background.image) : null;
        if (imageBase64) {
            // Repalce data:base64 value to created mediaId
            planJson.background.image = await MediaStorage.saveMedia(userId, imageBase64);
        } else {
            // Repalce any other value
            planJson.background.image = undefined
        }
    
        // Create and save entity
        const createdPlan = await PlanEntity.create({
            userId,
            json: planJson,
        });

        // Return response
        res.json(createdPlan.toModel());
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
        
        // Process base64 image if present
        let outdatedMediaId = null;
        const imageBase64 = planJson.background.image ? parseBase64DataUrl(planJson.background.image) : null;
        if (imageBase64) {
            outdatedMediaId = existingPlan.json.background.image;
            // Repalce data:base64 value to created mediaId
            planJson.background.image = await MediaStorage.saveMedia(userId, imageBase64);
        } else {
            // Repalce any other value to existing mediaId
            planJson.background.image = existingPlan.json.background.image;
        }
    
        // Update entity
        existingPlan.json = planJson;
        await existingPlan.save();

        // Delete old image
        if (outdatedMediaId) {
            try {
                await MediaStorage.deleteMedia(userId, outdatedMediaId);
            } catch {
                // do not throw
                logger.error(`[server] Error occured while trying to delete user media: ${outdatedMediaId}`);
            }
        }

        // Return response
        res.json(existingPlan.toModel());
    } catch (error) {
        next(error);
    }
}