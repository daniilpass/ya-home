import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { Model } from 'sequelize';

import type { Plan, PlanInfo } from '@homemap/shared';

import MediaStorage from '../../services/mediaStorage';

export class PlanEntity extends Model<InferAttributes<PlanEntity>, InferCreationAttributes<PlanEntity>> {
    declare id: CreationOptional<number>;
    declare userId: string;
    declare json: Omit<Plan, 'id'>;

    toModel(): Plan {
        return {
            id: this.id,
            width: this.json.width,
            height: this.json.height,
            devices: {
                ...this.json.devices,
            },
            background: {
                ...this.json.background,
                ...(
                    this.json.background.image 
                        ? { image: MediaStorage.getMediaUrl(this.json.background.image) } 
                        : undefined
                ),
            }
        };
    }

    toModelShort (): PlanInfo {
        return {
            id: this.id,
            width: this.json.width,
            height: this.json.height,
            background: {
                ...this.json.background,
                ...(
                    this.json.background.image 
                        ? { image: MediaStorage.getMediaUrl(this.json.background.image) } 
                        : undefined
                ),
            }
        };
    }
}
