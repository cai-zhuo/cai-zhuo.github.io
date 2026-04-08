import { RendererType } from "./types.js";
import { normalizeSchema } from "./utils/normalize-schema.js";
import { ImgRender } from "./canvas-renderers/img-renderer/index.js";
import { TextRender } from "./canvas-renderers/text-renderer/index.js";
import { ShapeRender } from "./canvas-renderers/shape-render/index.js";
export { RendererType, RENDER_DATA_SCHEMA as RENDER_DATA_SCHEMA_FOR_AI } from "./types.js";
export { getEditablePoints, updateShapePoint, rotatePoint, getLayerVisualCenter, getRotatedBounds } from "./utils/shape-points.js";
export class Renderer {
    constructor(schema, engine) {
        /**
         * Run layout (no draw) and return layer bounds for hit testing.
         * Caller must ensure canvas dimensions match schema before calling.
         */
        this.layoutAndGetLayerBounds = async () => {
            if (!this.schema.layers.length) {
                return [];
            }
            const bounds = [];
            for (let i = 0; i < this.schema.layers.length; i++) {
                const layerData = this.schema.layers[i];
                const layer = this.createLayer(layerData);
                await layer.layout();
                bounds.push({
                    id: layer.getId(),
                    type: layer.getLayerType(),
                    bounds: { ...layer.container },
                    path: [i],
                });
            }
            return bounds;
        };
        /**
         * Render to the internal canvas. Does not convert to buffer.
         * Returns this for chaining (e.g. to call getCanvasElement).
         */
        this.render = async () => {
            if (!this.schema.layers.length) {
                throw new Error("[Renderer] empty canvas with no layers");
            }
            for (const layerData of this.schema.layers) {
                const layer = this.createLayer(layerData);
                await layer.layout();
                await layer.draw();
            }
            return this;
        };
        this.draw = async () => {
            await this.render();
            return this.toBuffer();
        };
        // Normalize schema to handle multiple input formats
        const normalizedSchema = normalizeSchema(schema);
        const { width, height } = normalizedSchema;
        this.schema = normalizedSchema;
        this.engine = engine;
        this.canvas = this.engine.createCanvas(width, height);
        this.ctx = this.engine.getContext(this.canvas);
        if ("patternQuality" in this.ctx) {
            this.ctx.patternQuality = "best";
        }
        if ("quality" in this.ctx) {
            this.ctx.quality = "best";
        }
    }
    createLayer(layerData) {
        switch (layerData.type) {
            case RendererType.TEXT:
                return new TextRender(this.ctx, this.engine, layerData);
            case RendererType.IMG:
                return new ImgRender(this.ctx, this.engine, layerData);
            case RendererType.SHAPE:
                return new ShapeRender(this.ctx, layerData);
            default:
                throw new Error("[Renderer] unknown layer type");
        }
    }
    /**
     * Return the canvas as HTMLCanvasElement when running in browser.
     * Returns null in Node.js.
     */
    getCanvasElement() {
        if (typeof document !== "undefined" && this.canvas && "nodeName" in this.canvas) {
            return this.canvas;
        }
        return null;
    }
    async toBuffer() {
        const type = this.schema.output?.type || "png";
        return this.engine.toBuffer(this.canvas, type);
    }
}
//# sourceMappingURL=index.js.map