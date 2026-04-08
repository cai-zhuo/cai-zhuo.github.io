import { BaseRender } from "../base-renderer.js";
import { cloneDeep, isNumber } from "https://esm.sh/lodash-es@4.17.21";
import { getImageHeight, getImageRatio, getImageWidth } from "./utils.js";
export class ImgRender extends BaseRender {
    constructor(ctx, engine, data) {
        super();
        this.width = 0;
        this.height = 0;
        this.imageWidth = 0;
        this.imageHeight = 0;
        this.layout = async () => {
            const { url, width, height } = this.data;
            const image = url ? await this.engine.loadImage(url) : null;
            if (!image) {
                if (!width || !height) {
                    throw new Error("img renderer without url should specify size");
                }
                this.width = width;
                this.height = height;
                this.imageWidth = width;
                this.imageHeight = height;
                return this;
            }
            this.image = image;
            if (!width) {
                if (!height) {
                    this.imageWidth = image.naturalWidth;
                    this.imageHeight = image.naturalHeight;
                    this.width = this.imageWidth;
                    this.height = this.imageHeight;
                }
                else {
                    this.imageWidth = getImageWidth(image, height);
                    this.imageHeight = height;
                    this.width = this.imageWidth;
                    this.height = this.imageHeight;
                }
            }
            else {
                if (!height) {
                    this.imageWidth = width;
                    this.imageHeight = getImageHeight(image, width);
                    this.width = this.imageWidth;
                    this.height = this.imageHeight;
                }
                else {
                    // Both width and height are specified - this is the layer boundary
                    this.width = width;
                    this.height = height;
                    const ratio = getImageRatio(image);
                    const objectFit = this.data.objectFit || "contain";
                    // Calculate image size to fit within the boundary
                    if (objectFit === "cover") {
                        // Cover: image fills the entire area, may overflow
                        if (ratio > width / height) {
                            this.imageHeight = height;
                            this.imageWidth = height * ratio;
                        }
                        else {
                            this.imageWidth = width;
                            this.imageHeight = width / ratio;
                        }
                    }
                    else {
                        // Contain: image fits within the area
                        if (ratio > width / height) {
                            this.imageWidth = width;
                            this.imageHeight = width / ratio;
                        }
                        else {
                            this.imageHeight = height;
                            this.imageWidth = height * ratio;
                        }
                    }
                }
            }
            return this;
        };
        this.draw = async () => {
            const { x, y, rotate } = this.data;
            const { width, height } = this;
            if (!rotate) {
                // No rotation - draw directly
                if (this.data.color) {
                    this.drawColor(x, y);
                }
                if (this.image) {
                    await this.drawImage(x, y, this.image);
                }
            }
            else {
                // With rotation - apply transform then draw
                const actualHeight = height
                    ? height
                    : !this.image
                        ? 0
                        : (this.image.naturalHeight / this.image.naturalWidth) * width;
                this.ctx.save();
                this.ctx.translate(x + width / 2, y + actualHeight / 2);
                this.ctx.rotate((rotate * Math.PI) / 180);
                this.ctx.translate(-(x + width / 2), -(y + actualHeight / 2));
                if (this.data.color) {
                    this.drawColor(x, y);
                }
                if (this.image) {
                    await this.drawImage(x, y, this.image);
                }
                this.ctx.restore();
            }
            return this;
        };
        this.getContainerCoordinates = () => {
            const { x, y, width, height } = this.data;
            // Return the layer's declared boundary from data props
            // Use computed dimensions only if not specified in data
            const boundaryWidth = width ?? this.width;
            const boundaryHeight = height ?? this.height;
            return {
                x1: x,
                y1: y,
                x2: x + boundaryWidth,
                y2: y + boundaryHeight,
            };
        };
        this.ctx = ctx;
        this.engine = engine;
        this.data = cloneDeep(data);
    }
    get container() {
        return this.getContainerCoordinates();
    }
    async drawImage(x, y, image) {
        this.ctx.save();
        if (isNumber(this.data.globalAlpha)) {
            this.ctx.globalAlpha = this.data.globalAlpha;
        }
        if (this.data.shadow) {
            this.ctx.shadowBlur = this.data.shadow.blur;
            this.ctx.shadowColor = this.data.shadow.color;
            this.ctx.shadowOffsetX = this.data.shadow.X || 0;
            this.ctx.shadowOffsetY = this.data.shadow.Y || 0;
        }
        // Center the image within the layer boundary
        const offsetX = (this.width - this.imageWidth) / 2;
        const offsetY = (this.height - this.imageHeight) / 2;
        this.ctx.drawImage(image, x + offsetX, y + offsetY, this.imageWidth, this.imageHeight);
        this.ctx.restore();
    }
    drawColor(x, y) {
        const { width, height } = this;
        this.ctx.save();
        if (!this.data.color)
            return;
        this.ctx.fillStyle = this.data.color;
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, width, height, this.data.radius || 0);
        this.ctx.fill();
        this.ctx.restore();
    }
}
//# sourceMappingURL=index.js.map