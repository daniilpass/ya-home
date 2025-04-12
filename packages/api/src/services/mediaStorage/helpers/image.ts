import { Jimp } from 'jimp';

import { AppError } from '../../../errors';
import { FileImage } from '../types/FileImage';

const errorUnsupportedImage = "Unsopported image";
const errorCantReadImage = "Can't read image";

export const imageFromBuffer = async (buffer: Buffer): Promise<FileImage> => {
    try {
        const image = await Jimp.read(buffer);
        const {
            mime,
            bitmap: { width, height }
        } = image;

        if (!mime || width === 0 || height === 0) {
            throw new AppError(errorUnsupportedImage);
        }

        const imageInfo: FileImage = {
            buffer,
            size: Buffer.byteLength(buffer),
            width,
            height,
            meta: {
                mime,
                name: '',
            }
        }
    
        return imageInfo;
    } catch {
        throw new AppError(errorCantReadImage);
    }
}