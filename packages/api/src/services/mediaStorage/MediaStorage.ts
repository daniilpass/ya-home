import { promises as fs, mkdir } from 'fs';
import path from 'path';

import { logger } from '../../utils';
import { AppError } from '../../errors';
import { MediaBase64 } from '../../types/MediaBase64';
import { uuid } from '../../utils/uuid';
import { MIME_TO_EXTENSION, SUPPORTED_MIME } from './constants'
import { MEDIA_STORAGE_PATH } from '../../constants';

const isSupportedMime = (mime: string): boolean => SUPPORTED_MIME.includes(mime);

const mimeToExtension = (mime: string): string | null => MIME_TO_EXTENSION[mime] ?? null;

const getUserDir = (userId: string) => path.join(MEDIA_STORAGE_PATH, userId);

const getUserFilepath = (userId: string, filename: string) => path.join(getUserDir(userId), filename);

const readUserDir = (userId: string) => fs.readdir(getUserDir(userId));

const readUserFile = (userId: string, filename: string) => fs.readFile(getUserFilepath(userId, filename));

const unlinkUserFile = (userId: string, file: string) => fs.unlink(getUserFilepath(userId, file));

const findUserFile = async (userId: string, nameNoExt: string) => {
    const files = await readUserDir(userId);
    return files.find((file) => path.parse(file).name === nameNoExt);
}

const saveBase64Media = async (userId: string, media: MediaBase64): Promise<string> => {
    if (!isSupportedMime(media.mime)) {
        throw new AppError(`Not supported media: ${media.mime}`);
    }

    const mediaId = uuid.new();
    const mediaExt = mimeToExtension(media.mime);
    const filename = `${mediaId}${mediaExt}`;
    const userDir = getUserDir(userId);
    const filepath = getUserFilepath(userId, filename);

    try {
        await clearMedia(userId);
    } catch {
        logger.error('[MediaStorage] Error occured while trying to clear user media');
    }

    await fs.mkdir(userDir, { recursive: true });
    await fs.writeFile(
        filepath,
        media.data,
        'base64',
    );

    return mediaId;
};

const findMedia = async (userId: string, mediaId: string): Promise<Buffer | null> => {
    const filename = await findUserFile(userId, mediaId);
    if (!filename) {
        return null;
    }

    return readUserFile(userId, filename);
}

const clearMedia = async (userId: string) => {
    const files = await readUserDir(userId);
    for (const file of files) {
        await unlinkUserFile(userId, file);
    }
}

export const MediaStorage = {
    saveBase64Media,
    findMedia,
}
