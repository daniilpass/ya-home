import { promises as fs } from 'fs';
import path from 'path';

import { MEDIA_STORAGE_PATH } from '../../../constants';
import { META_EXTENSION, MIME_TO_EXTENSION } from '../constants';

export const mimeToExtension = (mime: string | undefined): string => (mime && MIME_TO_EXTENSION[mime]) ?? '';

const getFileName = (fileId: string, isMeta?: boolean) => isMeta ? `${fileId}${META_EXTENSION}` : `${fileId}`;
const getUserFilepath = (userId: string, fileId: string, isMeta?: boolean) => path.join(getUserDir(userId), getFileName(fileId, isMeta));
const getUserMetaFilepath = (userId: string, fileId: string) => getUserFilepath(userId, fileId, true);

const getUserDir = (userId: string) => path.join(MEDIA_STORAGE_PATH, userId);
export const createUserDir = (userId: string) => fs.mkdir(getUserDir(userId), { recursive: true });

export const readUserFile = async (userId: string, fileId: string) => Promise.all([
    fs.readFile(getUserFilepath(userId, fileId)),
    fs.readFile(getUserMetaFilepath(userId, fileId)),
]).then(([fileBuffer, metaBuffer]) => ({
    fileBuffer,
    metaBuffer
}));

export const writeUserFile = async (userId: string, fileId: string, data: Buffer, meta: Buffer) => Promise.all([
    fs.writeFile(getUserFilepath(userId, fileId), data),
    fs.writeFile(getUserMetaFilepath(userId, fileId), meta)
]);

export const unlinkUserFile = async (userId: string, fileId: string) => Promise.all([
    fs.unlink(getUserFilepath(userId, fileId)),
    fs.unlink(getUserMetaFilepath(userId, fileId)),
]);