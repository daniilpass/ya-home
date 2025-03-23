import { unlinkUserFile } from './fs';

export const deleteUserFile = async (userId: string, fileId: string) => {
    await unlinkUserFile(userId, fileId);
}