import { FileBase64 } from './types/FileBase64';
import { FileInfo } from './types/FileInfo';
import { assertMediaId, assertMime, deleteUserFile, findUserFile, saveUserFile } from './helpers';

const saveMedia = async (userId: string, media: FileBase64): Promise<string> => {
    assertMime(media.mime);

    const mediaId = await saveUserFile(userId, media);
    return mediaId;
};

const findMedia = (userId: string, mediaId: string): Promise<FileInfo | null> => {
    assertMediaId(mediaId);

    return findUserFile(userId, mediaId);
}

const deleteMedia = (userId: string, mediaId: string) => {
    assertMediaId(mediaId);

    return deleteUserFile(userId, mediaId);
}

const getMediaUrl = (mediaId: string) => {
    assertMediaId(mediaId);

    return `/api/media/${mediaId}`;
}

export const MediaStorage = {
    assertMime,
    assertMediaId,
    saveMedia,
    findMedia,
    deleteMedia,
    getMediaUrl,
}
