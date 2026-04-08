export var HighlightType;
(function (HighlightType) {
    HighlightType["UNDERLINE"] = "underline";
    HighlightType["COLORED"] = "colored";
    HighlightType["HALF_RECTANGLE"] = "halfRectangle";
    HighlightType["SVG"] = "svg";
})(HighlightType || (HighlightType = {}));
export class Highlighter {
    constructor(ctx) {
        this.colorText = (c, color) => {
            this.ctx.save();
            this.ctx.fillStyle = color;
            this.ctx.fillText(c.char, c.X, c.Y);
            this.ctx.restore();
        };
        this.rectFill = (c, color) => {
            this.ctx.save();
            this.ctx.fillStyle = color;
            this.ctx.fillRect(c.X, c.Y - Math.abs(c.metrics.alphabeticBaseline) - 4, c.metrics.width, c.emHeight / 3);
            this.ctx.restore();
            this.ctx.fillText(c.char, c.X, c.Y);
        };
        this.underLine = (c, color) => {
            const x = c.X;
            const y = c.Y;
            this.ctx.beginPath();
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 8;
            this.ctx.moveTo(x, y + (c.metrics.actualBoundingBoxDescent ?? 0));
            this.ctx.lineTo(x + c.metrics.width, y + (c.metrics.actualBoundingBoxDescent ?? 0));
            this.ctx.stroke();
            this.ctx.fillText(c.char, c.X, c.Y);
        };
        this.ctx = ctx;
    }
    svg(word, svgImage, style) {
        const width = word.reduce((sum, c) => sum + c.metrics.width, 0);
        const startY = style?.coverText
            ? word[0].Y - word[0].boundingHeight
            : word[0].Y;
        const height = style?.coverText ? word[0].boundingHeight : style?.height;
        this.ctx.drawImage(svgImage, word[0].X, startY + (style?.offsetY || 0), width, height || word[0].boundingHeight);
    }
}
Highlighter.highlightByChar = [
    HighlightType.UNDERLINE,
    HighlightType.COLORED,
    HighlightType.HALF_RECTANGLE,
];
Highlighter.highlightByWord = [HighlightType.SVG];
//# sourceMappingURL=highlighter.js.map