import { Collection, Plan, PlanInfo } from '@homemap/shared';

import { PlanRepository } from '../../dal/repositories';
import { AppError, NotFoundError } from '../../errors';
import { parseBase64DataUrl } from '../../utils/dataUrl';
import { logger } from '../../utils';
import { PlanEntity } from '../../dal/entities';
import { mapToRecord } from '../../mappers';

import MediaStorage from '../mediaStorage';

const PLAN_LIMIT = 1;

export class PlanService {
    async getUserPlans(userId: string): Promise<Collection<PlanInfo>> {
        const planEntities = await PlanRepository.getUserPlanAll(userId);
    
        if (!planEntities) {
            throw new NotFoundError();
        }
    
        const result: Collection<PlanInfo> = mapToRecord(planEntities, 'id', (x: PlanEntity) => x.toModelShort());
        return result;
    }
    
    async getUserPlanById(userId: string, planId: number): Promise<Plan> {
        const planEntity = await PlanRepository.getUserPlanById(userId, planId);
    
        if (!planEntity) {
            throw new NotFoundError();
        }
    
        return planEntity.toModel();
    }
    
    async createUserPlan(userId: string, planPayload: Plan): Promise<Plan> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _, ...planJson } = planPayload;
    
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
    
    async updateUserPlan(userId: string, planId: number, planPayload: Plan) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _, ...planJson }: Plan = planPayload;
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
    
        // Delete old image
        const existingImage = existingPlan.json.background.image;
        const newImage = planJson.background.image;
        if (existingImage && newImage && existingImage !== newImage) {
            try {
                await MediaStorage.deleteMedia(userId, existingImage);
            } catch {
                // do not throw
                logger.error(`[server] Error occured while trying to delete user media: ${existingImage}`);
            }
        }

        // Update entity
        existingPlan.json = planJson;
        await existingPlan.save();
    
        return existingPlan.toModel();
    }
    
    private processPlanImage = async (userId: string, newImage?: string, existingImage?: string): Promise<string | undefined> => {
        if (!newImage) {
            return undefined;
        }
        const userImage = parseBase64DataUrl(newImage);
        if (userImage) {
            const mediaId = await MediaStorage.saveMedia(userId, userImage);
            return mediaId;
        } else {
            return existingImage;
        }
    }
}
