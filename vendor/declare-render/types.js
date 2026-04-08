export var RendererType;
(function (RendererType) {
    RendererType["TEXT"] = "text";
    RendererType["IMG"] = "img";
    RendererType["SHAPE"] = "shape";
})(RendererType || (RendererType = {}));
// ----- String schema for AI (readable as string) -----
export const RENDER_DATA_SCHEMA = `
RenderData: { "id": string, "width": number, "height": number, "layers": Array<TextRenderData | ImgRenderData | ShapeRenderData>, "output"?: { "type"?: "png" | "jpg" } }

TextRenderData: { "id": string|number, "type": "text", "x": number, "y": number, "width": number, "height": number, "content": string, "style": { "fontName": string, "fontSize": number | { "max": number, "min": number }, "color": string, "align"?: "center"|"right", "verticalAlign"?: "center"|"top"|"bottom", "fontWeight"?: string, "verticalGap"?: number, "backgroundColor"?: string, "padding"?: number|{ "x": number, "y": number }, "border"?: { "color": string, "width"?: number }, "radius"?: number }, "rotate"?: number }

ImgRenderData: { "id": string, "type": "img", "x": number, "y": number, "width"?: number, "height"?: number, "url"?: string, "color"?: string, "objectFit": "contain"|"cover", "radius"?: number, "rotate"?: number, "globalAlpha"?: number, "shadow"?: { "color": string, "blur": number, "X": number, "Y": number } }

ShapeRenderData: { "id": string|number, "type": "shape", "x": number (typically 0), "y": number (typically 0), "rotate"?: number, "style"?: { "fillStyle"?: string, "strokeStyle"?: string, "lineWidth"?: number, "lineCap"?: "butt"|"round"|"square", "lineJoin"?: "bevel"|"round"|"miter", "miterLimit"?: number, "lineDash"?: number[], "lineDashOffset"?: number, "globalAlpha"?: number }, "shadow"?: { "color": string, "blur": number, "X": number, "Y": number }, "shapes": Array<ShapeCommand> } (shape coordinates are relative to layer x,y; typically set layer x=0, y=0 and use absolute coordinates in shape commands)

ShapeCommand: { "type": "rect"|"fillRect"|"strokeRect"|"clearRect"|"beginPath"|"closePath"|"moveTo"|"lineTo"|"arc"|"ellipse"|"arcTo"|"quadraticCurveTo"|"bezierCurveTo"|"fill"|"stroke"|"fillAndStroke", "style"?: ShapeStyle (optional; overrides layer style for this command), ...additional properties based on type }
- rect: { "type": "rect", "x": number, "y": number, "width": number, "height": number, "rx"?: number (horizontal border radius), "ry"?: number (vertical border radius), "style"?: ShapeStyle }
- arc: { "type": "arc", "x": number, "y": number, "radius"?: number (for circles), "radiusX"?: number (for ellipses), "radiusY"?: number (for ellipses), "startAngle": number, "endAngle": number, "counterclockwise"?: boolean, "style"?: ShapeStyle } (must have either radius OR both radiusX and radiusY)
- ellipse: { "type": "ellipse", "x": number, "y": number, "radiusX": number (horizontal radius), "radiusY": number (vertical radius), "rotation": number (rotation angle in radians), "startAngle": number, "endAngle": number, "counterclockwise"?: boolean, "style"?: ShapeStyle }
`.trim();
//# sourceMappingURL=types.js.map