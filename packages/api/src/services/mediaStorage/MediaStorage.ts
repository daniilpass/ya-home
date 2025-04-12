import type { UserFile } from './types/UserFile';
import { assertImage, assertMediaId, deleteUserFile, findUserFile, imageFromBuffer, saveUserFile } from './helpers';

const saveMedia = async (userId: string, file: UserFile): Promise<string> => {
    const media = await imageFromBuffer(file.buffer);

    assertImage(media);

    const mediaId = await saveUserFile(userId, media);
    return mediaId;
};

const findMedia = (userId: string, mediaId: string): Promise<UserFile | null> => {
    assertMediaId(mediaId);

    return findUserFile(userId, mediaId);
};

const deleteMedia = (userId: string, mediaId: string) => {
    assertMediaId(mediaId);

    return deleteUserFile(userId, mediaId);
};

const getMediaUrl = (mediaId: string) => {
    assertMediaId(mediaId);

    return `/api/media/${mediaId}`;
};

export const MediaStorage = {
    assertImage,
    assertMediaId,
    saveMedia,
    findMedia,
    deleteMedia,
    getMediaUrl,
};
