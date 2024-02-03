import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Plan } from '@homemap/shared';

export class PlanEntity extends Model<InferAttributes<PlanEntity>, InferCreationAttributes<PlanEntity>> {
    declare id: CreationOptional<number>;
    declare userId: string;
    declare json: Omit<Plan, 'id'>;

    toModel(): Plan {
        return {
            id: this.id,
            ...this.json,
        }
    }
}
