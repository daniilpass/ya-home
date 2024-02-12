import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Plan } from '@homemap/shared';
import { MediaStorage } from '../../services/mediaStorage/MediaStorage';

export class PlanEntity extends Model<InferAttributes<PlanEntity>, InferCreationAttributes<PlanEntity>> {
    declare id: CreationOptional<number>;
    declare userId: string;
    declare json: Omit<Plan, 'id'>;

    toModel(): Plan {
        return {
            ...this.json,
            id: this.id,
            background: {
                ...this.json.background,
                ...(
                    this.json.background.image 
                    ? { image: MediaStorage.getMediaUrl(this.json.background.image) } 
                    : undefined
                ),
            }
        }
    }
}
