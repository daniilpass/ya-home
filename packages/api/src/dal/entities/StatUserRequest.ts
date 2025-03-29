import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export class StatUserRequest extends Model<InferAttributes<StatUserRequest>, InferCreationAttributes<StatUserRequest>> {
    declare id: CreationOptional<number>;
    declare userId: string;
    declare route: string;
    declare path: string;
    declare method: string;
    declare statusCode: number;
    declare date: Date;
    declare duration: number;
    declare userAddress: string;
    declare userAgent: string | null;
}
