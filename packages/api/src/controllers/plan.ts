import { NextFunction, Request, Response } from 'express';

import { Plan, schemas } from '@homemap/shared';

import { MediaStorage } from '../services/mediaStorage/MediaStorage';
import yaclient from '../yaClient';
import { PlanRepository } from '../dal/repositories';
import { NotFoundError, SchemaValidationError } from '../errors';
import { jsonValidator } from '../utils/jsonValidator';
import { parseBase64DataUrl } from '../utils/dataUrl';
import { logger } from '../utils';

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
        
        // Process base64 image if present
        let mediaIdToDelete = null;
        const imageBase64 = planJson.background.image ? parseBase64DataUrl(planJson.background.image) : null;
        if (imageBase64) {
            mediaIdToDelete = existingPlan.json.background.image;
            planJson.background.image = await MediaStorage.saveMedia(userId, imageBase64);
        }
    
        // Update entity
        existingPlan.json = planJson;
        await existingPlan.save()

        // Delete old image
        if (mediaIdToDelete) {
            try {
                await MediaStorage.deleteMedia(userId, mediaIdToDelete);
            } catch {
                // do not throw
                logger.error(`[server] Error occured while trying to delete user media: ${mediaIdToDelete}`);
            }
        }

        // Prepare response
        const updatedPlan: Plan = existingPlan.toModel();
        res.json(updatedPlan);
    } catch (error) {
        next(error);
    }
}