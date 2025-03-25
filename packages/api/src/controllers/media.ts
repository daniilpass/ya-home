import { NextFunction, Request, Response } from 'express';

import MediaStorage from '../services/mediaStorage';
import { NotFoundError} from '../errors';
import { MIME } from '../services/mediaStorage/constants';
import { UnauthorizedError } from '../errors/UnauthorizedError';

export const getUserMedia = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        const userId = req.userInfo?.yaUserId;
        if (!userId) {
            throw new UnauthorizedError();
        }

        const mediaId = req.params.id;
        MediaStorage.assertMediaId(mediaId);

        const media = await MediaStorage.findMedia(userId, mediaId);
        if (!media) {
            throw new NotFoundError();
        }

        res.setHeader('Content-Type', media.meta.mime ?? MIME.applicationOctetStream);
        res.send(media.buffer);
    } catch (error) {
        next(error);
    }
}
