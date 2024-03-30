import { NextFunction, Request, Response } from 'express';

import YaService from '../services/yaService';
import MediaStorage from '../services/mediaStorage';
import { NotFoundError} from '../errors';

export const getUserMedia = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        const mediaId = req.params.id;
        MediaStorage.assertMediaId(mediaId);

        const userId = await YaService.getUserId();
        const media = await MediaStorage.findMedia(userId, mediaId);
        if (!media) {
            throw new NotFoundError();
        }

        res.setHeader('Content-Type', media.meta.mime);
        res.send(media.data);
    } catch (error) {
        next(error);
    }
}
