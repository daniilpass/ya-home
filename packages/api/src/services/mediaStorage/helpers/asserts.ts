import { AppError } from '../../../errors';
import { uuid } from '../../../utils/uuid';
import { SUPPORTED_MIME } from '../constants';
import { FileImage } from '../types/FileImage';

const isSupportedMime = (mime: string): boolean => SUPPORTED_MIME.includes(mime);

export const assertMime = (mime: string) => {
    if (!isSupportedMime(mime)) {
        throw new AppError(`Not supported media: ${mime}`);
    }
}

export const assertMediaId = (mediaId: string) => {
    if (!uuid.validate(mediaId)) {
        throw new AppError(`Not supported mediaId: ${mediaId}`);
    }
}

export const assertImage = (image: FileImage) => {
    assertMime(image.mime);
}