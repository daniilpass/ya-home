import { uuid } from '../../../utils/uuid';
import { FileBase64 } from '../types/FileBase64';

import { createUserDir, getFileName, getUserFilepath, mimeToExtension, writeUserMetaFile, writeUserFile } from './fs';
import { createFileMeta } from './meta';


export const saveUserFile = async (userId: string, file: FileBase64): Promise<string> => {
    const fileId = uuid.new();

    const fileExt = mimeToExtension(file.mime);
    const realFilename = `${fileId}${fileExt}`;
    const metaContent = createFileMeta(file, realFilename);

    // Create user dir
    await createUserDir(userId);

    // Write file meta
    await writeUserMetaFile(userId, fileId, metaContent);

    // Write file
    await writeUserFile(userId, fileId, file.data);

    return fileId;
}