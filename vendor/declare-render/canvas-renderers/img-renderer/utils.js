export function getImageRatio(image) {
    return image.naturalWidth / image.naturalHeight;
}
export function getImageHeight(image, width) {
    const ratio = image.naturalWidth / image.naturalHeight;
    return width / ratio;
}
export function getImageWidth(image, height) {
    const ratio = image.naturalWidth / image.naturalHeight;
    return height * ratio;
}
//# sourceMappingURL=utils.js.map