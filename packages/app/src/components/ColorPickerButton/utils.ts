import { RGBColor } from 'react-color';

const colorThreshold = 255 / 2;

export const rgbToHex = (color: RGBColor) => {
    return "#" + (
        (1 << 24) |
        (color.r << 16) |
        (color.g << 8) |
        (color.b)
    ).toString(16).slice(1);
}

export const hexToRgb = (color: string) => {
    const bigint = parseInt(color.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    }
}

export const getContrastColorRGB = (color: RGBColor): RGBColor => {
    const v = (color.r + color.g + color.b) / 3 > colorThreshold ? 0 : 255;
    console.log('HELLO', (color.r + color.g + color.b) / 3, color.r + color.g + color.b)
    return { r: v, g: v, b: v };
}

export const getContrastColorHEX = (color: string): string => {
    console.log('HELLO', color, hexToRgb(color))
    const contrastColor = getContrastColorRGB(hexToRgb(color));
    return rgbToHex(contrastColor);
}
