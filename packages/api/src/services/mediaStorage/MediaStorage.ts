import { promises as fs, mkdir } from 'fs';
import path from 'path';

import { AppError } from '../../errors';
import { uuid } from '../../utils/uuid';
import { META_EXTENSION, MIME_TO_EXTENSION, SUPPORTED_MIME } from './constants'
import { MEDIA_STORAGE_PATH } from '../../constants';

import { FileBase64 } from './types/FileBase64';
import { FileMeta } from './types/FileMeta';
import { FileInfo } from './types/FileInfo';

const isSupportedMime = (mime: string): boolean => SUPPORTED_MIME.includes(mime);

const mimeToExtension = (mime: string): string | null => MIME_TO_EXTENSION[mime] ?? null;

const createFileMeta = (file: FileBase64, realFilename: string): Buffer => {
    const metaArr = [
        file.mime,
        realFilename,
    ];

    return Buffer.from(metaArr.join('\r\n'));
}

const readUserFileMeta = async (userId: string, fileId: string): Promise<FileMeta> => {
    const metaBuffer = await readUserFile(userId, getMetaFileName(fileId));
    const metaArr = metaBuffer.toString().split('\r\n');

    return {
        mime: metaArr[0],
        name: metaArr[1],
    }
}

const getFileName = (fileId: string) => `${fileId}`;

const getMetaFileName = (fileId: string) => `${fileId}${META_EXTENSION}`;

const getUserDir = (userId: string) => path.join(MEDIA_STORAGE_PATH, userId);

const getUserFilepath = (userId: string, file: string) => path.join(getUserDir(userId), file);

const readUserFile = (userId: string, file: string) => fs.readFile(getUserFilepath(userId, file));

const unlinkUserFile = (userId: string, file: string) => fs.unlink(getUserFilepath(userId, file));

const deleteUserFile = async (userId: string, fileId: string) => {
    await unlinkUserFile(userId, getFileName(fileId));
    await unlinkUserFile(userId, getMetaFileName(fileId));
}


const findUserFile = async (userId: string, fileId: string): Promise<FileInfo | null> => {
    try {
        return {
            data: await readUserFile(userId, getFileName(fileId)),
            meta: await readUserFileMeta(userId, fileId),
        };
    } catch {
        return null;
    }
}

const writeUserFile = async (userId: string, file: FileBase64): Promise<string> => {
    const fileId = uuid.new();

    const fileExt = mimeToExtension(file.mime);
    const realFilename = `${fileId}${fileExt}`;

    const dataFilename = getFileName(fileId);
    const dataFilepath = getUserFilepath(userId, dataFilename);

    const metaFilename = getMetaFileName(fileId);
    const metaFilepath = getUserFilepath(userId, metaFilename);

    const metaContent = createFileMeta(file, realFilename);

    // Create user dir
    const userDir = getUserDir(userId);
    await fs.mkdir(userDir, { recursive: true });

    // Write file meta
    await fs.writeFile(
        metaFilepath,
        metaContent,
    );

    // Write file
    await fs.writeFile(
        dataFilepath,
        file.data,
        'base64',
    );

    return fileId;
}

const saveMedia = async (userId: string, media: FileBase64): Promise<string> => {
    if (!isSupportedMime(media.mime)) {
        throw new AppError(`Not supported media: ${media.mime}`);
    }

    const mediaId = await writeUserFile(userId, media);
    return mediaId;
};

const findMedia = (userId: string, mediaId: string): Promise<FileInfo | null> => {
    return findUserFile(userId, mediaId);
}

const deleteMedia = (userId: string, mediaId: string) => {
    return deleteUserFile(userId, mediaId);
}

const getMediaUrl = (mediaId: string) => {
    return `/api/media/${mediaId}`;
}

export const MediaStorage = {
    saveMedia,
    findMedia,
    deleteMedia,
    getMediaUrl,
}
