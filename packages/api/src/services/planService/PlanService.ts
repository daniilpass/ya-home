import { Request } from 'express';
import { Collection, Plan, PlanInfo } from '@homemap/shared';

import { PlanRepository } from '../../dal/repositories';
import { AppError, NotFoundError } from '../../errors';
import { parseBase64DataUrl } from '../../utils/dataUrl';
import { logger } from '../../utils';
import { PlanEntity } from '../../dal/entities';
import { mapToRecord } from '../../mappers';

import YaService from '../yaService';
import MediaStorage from '../mediaStorage';

const PLAN_LIMIT = 1;

export class PlanService {
    yaService: YaService;

    constructor(req: Request) {
        this.yaService = new YaService(req);
    }

    async getUserPlans(): Promise<Collection<PlanInfo>> {
        const userId = await this.yaService.getUserId();
        const planEntities = await PlanRepository.getUserPlanAll(userId);
    
        if (!planEntities) {
            throw new NotFoundError();
        }
    
        const result: Collection<PlanInfo> = mapToRecord(planEntities, 'id', (x: PlanEntity) => x.toModelShort());
        return result;
    }
    
    async getUserPlanById(planId: number): Promise<Plan> {
        const userId = await this.yaService.getUserId();
        const planEntity = await PlanRepository.getUserPlanById(userId, planId);
    
        if (!planEntity) {
            throw new NotFoundError();
        }
    
        return planEntity.toModel();
    }
    
    async createUserPlan(planPayload: Plan): Promise<Plan> {
        const { id: _, ...planJson } = planPayload;
        const userId = await this.yaService.getUserId();
    
        // Find existing user plans
        const userPlans = await PlanRepository.getUserPlanAll(userId);
        if (userPlans && userPlans.length === PLAN_LIMIT) {
            throw new AppError(`Достигнут лимит: ${PLAN_LIMIT}`);
        }
        
        // Process base64 image if present
        planJson.background.image = await this.processPlanImage(userId, planJson.background.image);
    
        // Create and save entity
        const createdPlan = await PlanEntity.create({
            userId,
            json: planJson,
        });
    
        return createdPlan.toModel();
    }
    
    async updateUserPlan(planId: number, planPayload: Plan) {
        const { id: _, ...planJson }: Plan = planPayload;
        const userId = await this.yaService.getUserId();
        const existingPlan = await PlanRepository.getUserPlanById(userId, planId);
    
        if (!existingPlan) {
            throw new NotFoundError();
        }
    
        // Process base64 image if present
        planJson.background.image = await this.processPlanImage(
            userId,
            planJson.background.image,
            existingPlan.json.background.image,
        );
    
        // Update entity
        existingPlan.json = planJson;
        await existingPlan.save();
    
        // Delete old image
        const existingImage = existingPlan.json.background.image;
        if (existingImage && existingImage !== planJson.background.image) {
            try {
                await MediaStorage.deleteMedia(userId, existingImage);
            } catch {
                // do not throw
                logger.error(`[server] Error occured while trying to delete user media: ${existingImage}`);
            }
        }
    
        return existingPlan.toModel();
    }
    
    private processPlanImage = async (userId: string, newImage?: string, existingImage?: string): Promise<string | undefined> => {
        if (!newImage) {
            return undefined;
        }
    
        const imageBase64 = newImage ? parseBase64DataUrl(newImage) : null;
        if (imageBase64) {
            const mediaId = await MediaStorage.saveMedia(userId, imageBase64);
            return mediaId;
        } else {
            return existingImage;
        }
    }
}
