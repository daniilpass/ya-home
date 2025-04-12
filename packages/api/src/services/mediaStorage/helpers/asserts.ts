import { MAX_IMAGE_HEIGHT_PX, MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_WIDTH_PX } from '@homemap/shared';

import { AppError } from '../../../errors';
import { uuid } from '../../../utils/uuid';
import { SUPPORTED_IMAGE_MIME } from '../constants';
import type { FileImage } from '../types/FileImage';

export const assertMediaId = (mediaId: string) => {
    if (!uuid.validate(mediaId)) {
        throw new AppError(`Not supported mediaId: ${mediaId}`);
    }
};


export const assertImageMime = (mime: string | undefined) => {
    if (!mime || !SUPPORTED_IMAGE_MIME.includes(mime)) {
        throw new AppError(`Not supported mime: ${mime}`);
    }
};

export const assertImageSize = (sizeBytes: number) => {
    if (sizeBytes > MAX_IMAGE_SIZE_BYTES) {
        throw new AppError(`Max allowed size: ${MAX_IMAGE_SIZE_BYTES}`);
    }
};

export const assertImageDimensions= ({ width, height }: FileImage) => {
    if (width > MAX_IMAGE_WIDTH_PX || height > MAX_IMAGE_HEIGHT_PX) {
        throw new AppError(`Max allowed dimensions: ${MAX_IMAGE_WIDTH_PX}x${MAX_IMAGE_HEIGHT_PX}`);
    }
};

export const assertImage = (image: FileImage) => {
    assertImageMime(image.meta.mime);
    assertImageSize(image.size);
    assertImageDimensions(image);
};