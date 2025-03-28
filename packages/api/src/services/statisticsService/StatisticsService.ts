import { FlushableCollection } from '../../classes/FlushableCollection';
import { STAT_BATCH_SIZE } from '../../constants';
import { StatUserRequest } from '../../dal/entities';
import { logger } from '../../utils';
import { getErrorMessage } from '../../utils/errors';
import { UserRequestInfo } from './types';

export class StatisticsService {
    private userRequestBatch: FlushableCollection<UserRequestInfo>;

    constructor() {
        this.userRequestBatch = new FlushableCollection<UserRequestInfo>(STAT_BATCH_SIZE, this.onFlushUserRequestBatch);
    }

    private async onFlushUserRequestBatch(batch: UserRequestInfo[]) {
        try {
            await StatUserRequest.bulkCreate(batch);
        } catch (error) {
            logger.error(`[StatisticsService] Error occured while trying save user requests statistics. Error: ${getErrorMessage(error)}`);
        }
    } 

    logUserRequest(userRequestInfo: UserRequestInfo) {
        this.userRequestBatch.add(userRequestInfo);
    }
}