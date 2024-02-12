export const MIME = {
    imagePng: 'image/png',
    imageJpg: 'image/jpg',
    imageJpeg: 'image/jpeg',
}

export const EXTENSION = {
    png: '.png',
    jpg: '.jpg',
    jpeg: '.jpeg',
}

export const MIME_TO_EXTENSION = {
    [MIME.imagePng]: EXTENSION.png,
    [MIME.imageJpg]: EXTENSION.jpg,
    [MIME.imageJpeg]: EXTENSION.jpeg,
}

export const SUPPORTED_MIME = [
    MIME.imagePng,
    MIME.imageJpg,
    MIME.imageJpeg,
]

export const META_EXTENSION = '.meta';