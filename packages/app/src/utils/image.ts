export type ImageOptions = {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
}

const defaultOptions: ImageOptions = {
    minWidth: 0,
    maxWidth: Number.POSITIVE_INFINITY,
    minHeight: 0,
    maxHeight: Number.POSITIVE_INFINITY,
}

export const isValidImage = (src: string, options?: Partial<ImageOptions>): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        const asserts = {
            ...defaultOptions,
            ...options,
        }

        image.onload = function() {
            const isValidWidth = image.width >= asserts.minWidth && image.width <= asserts.maxWidth;
            const isValidHeight  = image.height >= asserts.minHeight && image.height <= asserts.maxHeight;
            const isValid = isValidWidth && isValidHeight; 
            resolve(isValid);
        }

        image.onerror = function() {
            resolve(false);
        }

        image.onabort = function() {
            resolve(false);
        }

        image.src = src;
    });  
}