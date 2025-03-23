import { uuid } from '../../../utils/uuid';
import { UserFile } from '../types/UserFile';

import { createUserDir, getFileName, mimeToExtension, writeUserFile } from './fs';
import { writeUserFileMeta } from './meta';


export const saveUserFile = async (userId: string, file: UserFile): Promise<string> => {
    const fileId = uuid.new();
    const fileExt = mimeToExtension(file.meta.mime);
    file.meta.name = `${fileId}${fileExt}`;

    // Create user dir
    await createUserDir(userId);

    // Write file meta
    await writeUserFileMeta(userId, fileId, file.meta);

    // Write file
    await writeUserFile(userId, getFileName(fileId), file.buffer);

    return fileId;
}