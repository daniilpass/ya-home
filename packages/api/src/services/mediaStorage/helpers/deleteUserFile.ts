import { getFileName, getMetaFileName, unlinkUserFile } from './fs';

export const deleteUserFile = async (userId: string, fileId: string) => {
    await unlinkUserFile(userId, getFileName(fileId));
    await unlinkUserFile(userId, getMetaFileName(fileId));
}