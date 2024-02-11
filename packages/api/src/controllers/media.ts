import { NextFunction, Request, Response } from 'express';

import { MediaStorage } from '../services/mediaStorage/MediaStorage';
import yaclient from '../yaClient';
import { BadRequestError, NotFoundError} from '../errors';
import { uuid } from '../utils/uuid';

export const getUserMedia = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        const mediaId = req.params.id;
        if (!uuid.validate(mediaId)) {
            throw new BadRequestError(`Not supported mediaId: ${mediaId}`);
        }

        const { id: userId } = await yaclient.getLoginInfo();
    
        const media = await MediaStorage.findMedia(userId, mediaId);
    
        if (!media) {
            throw new NotFoundError();
        }

        res.send(media);
    } catch (error) {
        next(error);
    }
}
