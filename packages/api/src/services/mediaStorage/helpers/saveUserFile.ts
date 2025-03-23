import { uuid } from '../../../utils/uuid';
import { UserFile } from '../types/UserFile';

import { createUserDir, mimeToExtension, writeUserMetaFile, writeUserFile } from './fs';
import { createFileMeta } from './meta';


export const saveUserFile = async (userId: string, file: UserFile): Promise<string> => {
    const fileId = uuid.new();

    const fileExt = mimeToExtension(file.mime);
    const realFilename = `${fileId}${fileExt}`;
    const metaContent = createFileMeta(file, realFilename);

    // Create user dir
    await createUserDir(userId);

    // Write file meta
    await writeUserMetaFile(userId, fileId, metaContent);

    // Write file
    await writeUserFile(userId, fileId, file.buffer);

    return fileId;
}