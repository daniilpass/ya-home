import { MAX_IMAGE_SIZE_BYTES } from '@homemap/shared';

import { AppError } from '../../../errors';
import { uuid } from '../../../utils/uuid';
import { SUPPORTED_IMAGE_MIME } from '../constants';
import { FileImage } from '../types/FileImage';

export const assertMediaId = (mediaId: string) => {
    if (!uuid.validate(mediaId)) {
        throw new AppError(`Not supported mediaId: ${mediaId}`);
    }
}


export const assertImageMime = (mime: string) => {
    if (!SUPPORTED_IMAGE_MIME.includes(mime)) {
        throw new AppError(`Not supported mime: ${mime}`);
    }
}

export const assertImageSize = (sizeBytes: number) => {
    if (sizeBytes > MAX_IMAGE_SIZE_BYTES) {
        throw new AppError(`Max allowed size: ${MAX_IMAGE_SIZE_BYTES}`);
    }
}

export const assertImage = (image: FileImage) => {
    assertImageMime(image.mime);
    assertImageSize(image.size);
}