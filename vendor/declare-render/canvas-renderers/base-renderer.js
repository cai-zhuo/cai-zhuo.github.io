export class BaseRender {
    constructor() {
        this.setPosition = (x, y) => {
            this.data.x = x;
            this.data.y = y;
            return this.layout();
        };
    }
    /** Expose id without exposing internal data. */
    getId() {
        return this.data.id;
    }
    /** Expose type without exposing internal data. */
    getLayerType() {
        return this.data.type;
    }
}
//# sourceMappingURL=base-renderer.js.map