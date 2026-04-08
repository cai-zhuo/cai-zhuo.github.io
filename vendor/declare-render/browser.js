/**
 * Browser entry point
 * This file ensures DOM canvas is used when running in browser
 */
import { Renderer as BaseRenderer } from "./index.js";
import { BrowserCanvasEngine } from "./engine/browser-engine.js";
// Re-export types
export * from "./index.js";
/**
 * Renderer class for Browser environment
 * Automatically uses BrowserCanvasEngine
 */
export class Renderer extends BaseRenderer {
    constructor(schema) {
        super(schema, new BrowserCanvasEngine());
    }
}
//# sourceMappingURL=browser.js.map