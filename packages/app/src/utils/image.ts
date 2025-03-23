export const isValidImage = (src: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = function() {
            const isValid = image.width > 0 && image.height > 0;
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