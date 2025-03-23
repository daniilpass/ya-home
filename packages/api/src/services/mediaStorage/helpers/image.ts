import { Jimp } from 'jimp';

import { AppError } from '../../../errors';
import { FileImage } from '../types/FileImage';

const errorUnsupportedImage = "Unsopported image";
const errorCantReadImage = "Can't read image";

export const imageFromBuffer = async (buffer: Buffer): Promise<FileImage> => {
    try {
        const image = await Jimp.read(buffer);

        if (!image.mime) {
            throw new AppError(errorUnsupportedImage);
        }

        const imageInfo: FileImage = {
            buffer,
            size: Buffer.byteLength(buffer),
            width: image.bitmap.width,
            height: image.bitmap.height,
            mime: image.mime,
        }
    
        return imageInfo;
    } catch (error) {
        throw new AppError(errorCantReadImage);
    }
}