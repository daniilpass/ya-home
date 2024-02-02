import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Plan as HomePlan} from '@homemap/shared';

export class Plan extends Model<InferAttributes<Plan>, InferCreationAttributes<Plan>> {
    declare userId: string;
    declare json: HomePlan;
}
