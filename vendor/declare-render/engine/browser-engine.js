export class BrowserCanvasEngine {
    createCanvas(width, height) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
    async loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = document.createElement("img");
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
    getContext(canvas) {
        const htmlCanvas = canvas;
        const ctx = htmlCanvas.getContext("2d");
        if (!ctx) {
            throw new Error("Failed to get 2d context from canvas");
        }
        return ctx;
    }
    async toBuffer(canvas, type) {
        const htmlCanvas = canvas;
        const mimeType = type === "jpg" ? "image/jpeg" : "image/png";
        return new Promise((resolve, reject) => {
            htmlCanvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                }
                else {
                    reject(new Error("Failed to convert canvas to blob"));
                }
            }, mimeType, 1.0);
        });
    }
}
//# sourceMappingURL=browser-engine.js.map