/**
 * Rotate a point around an origin by angle in degrees.
 * Uses the standard 2D rotation formula:
 * x' = x*cos(θ) - y*sin(θ)
 * y' = x*sin(θ) + y*cos(θ)
 */
export function rotatePoint(px, py, originX, originY, angleDeg) {
    const angleRad = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    const dx = px - originX;
    const dy = py - originY;
    return {
        x: originX + dx * cos - dy * sin,
        y: originY + dx * sin + dy * cos,
    };
}
/**
 * Calculate the visual center of a layer for rotation.
 * For shape layers: center of the rendered content bounds (midpoint of x1,x2 and y1,y2)
 * For text/img layers: layer.x + width/2, layer.y + height/2
 */
export function getLayerVisualCenter(layer, bounds) {
    if (layer.type === "shape") {
        // For shapes, the visual center is the midpoint of the bounds
        return {
            cx: (bounds.x1 + bounds.x2) / 2,
            cy: (bounds.y1 + bounds.y2) / 2,
        };
    }
    // For text/img, use layer center: x + width/2, y + height/2
    const cx = typeof layer.x === "number"
        ? layer.x + (layer.width ?? 0) / 2
        : (bounds.x1 + bounds.x2) / 2;
    const cy = typeof layer.y === "number"
        ? layer.y + (layer.height ?? 0) / 2
        : (bounds.y1 + bounds.y2) / 2;
    return { cx, cy };
}
/**
 * Calculate the Axis-Aligned Bounding Box (AABB) of a rotated rectangle.
 * Used for selection bounds calculation after rotation.
 */
export function getRotatedBounds(cx, cy, width, height, rotation) {
    if (rotation === 0) {
        return {
            x1: cx - width / 2,
            y1: cy - height / 2,
            x2: cx + width / 2,
            y2: cy + height / 2,
        };
    }
    const angleRad = (rotation * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    const halfW = width / 2;
    const halfH = height / 2;
    const corners = [
        { x: -halfW, y: -halfH },
        { x: halfW, y: -halfH },
        { x: halfW, y: halfH },
        { x: -halfW, y: halfH },
    ];
    const rotatedCorners = corners.map((corner) => ({
        x: cx + corner.x * cos - corner.y * sin,
        y: cy + corner.x * sin + corner.y * cos,
    }));
    const xs = rotatedCorners.map((c) => c.x);
    const ys = rotatedCorners.map((c) => c.y);
    return {
        x1: Math.min(...xs),
        y1: Math.min(...ys),
        x2: Math.max(...xs),
        y2: Math.max(...ys),
    };
}
/**
 * Extract all editable points from a shape layer's commands.
 * Points are in shape-local coordinates (relative to layer x, y).
 * pointKey identifies which field(s) to update when dragging.
 */
export function getEditablePoints(shape) {
    const points = [];
    if (!shape.shapes?.length)
        return points;
    shape.shapes.forEach((cmd, i) => {
        switch (cmd.type) {
            case "rect":
            case "fillRect":
            case "strokeRect":
            case "clearRect":
                points.push({ commandIndex: i, pointKey: "xy", x: cmd.x, y: cmd.y });
                points.push({
                    commandIndex: i,
                    pointKey: "widthHeight",
                    x: cmd.x + cmd.width,
                    y: cmd.y + cmd.height,
                });
                break;
            case "moveTo":
            case "lineTo":
                points.push({ commandIndex: i, pointKey: "xy", x: cmd.x, y: cmd.y });
                break;
            case "arc":
                points.push({ commandIndex: i, pointKey: "xy", x: cmd.x, y: cmd.y });
                if (cmd.radius !== undefined) {
                    points.push({
                        commandIndex: i,
                        pointKey: "radius",
                        x: cmd.x + cmd.radius,
                        y: cmd.y,
                    });
                }
                else if (cmd.radiusX !== undefined && cmd.radiusY !== undefined) {
                    points.push({
                        commandIndex: i,
                        pointKey: "radiusX",
                        x: cmd.x + cmd.radiusX,
                        y: cmd.y,
                    });
                    points.push({
                        commandIndex: i,
                        pointKey: "radiusY",
                        x: cmd.x,
                        y: cmd.y + cmd.radiusY,
                    });
                }
                break;
            case "ellipse":
                points.push({ commandIndex: i, pointKey: "xy", x: cmd.x, y: cmd.y });
                points.push({
                    commandIndex: i,
                    pointKey: "radiusX",
                    x: cmd.x + cmd.radiusX,
                    y: cmd.y,
                });
                points.push({
                    commandIndex: i,
                    pointKey: "radiusY",
                    x: cmd.x,
                    y: cmd.y + cmd.radiusY,
                });
                break;
            case "arcTo":
                points.push({ commandIndex: i, pointKey: "x1y1", x: cmd.x1, y: cmd.y1 });
                points.push({ commandIndex: i, pointKey: "x2y2", x: cmd.x2, y: cmd.y2 });
                break;
            case "quadraticCurveTo":
                points.push({ commandIndex: i, pointKey: "cp1", x: cmd.cp1x, y: cmd.cp1y });
                points.push({ commandIndex: i, pointKey: "end", x: cmd.x, y: cmd.y });
                break;
            case "bezierCurveTo":
                points.push({ commandIndex: i, pointKey: "cp1", x: cmd.cp1x, y: cmd.cp1y });
                points.push({ commandIndex: i, pointKey: "cp2", x: cmd.cp2x, y: cmd.cp2y });
                points.push({ commandIndex: i, pointKey: "end", x: cmd.x, y: cmd.y });
                break;
            default:
                break;
        }
    });
    return points;
}
/**
 * Update a shape command when a point is dragged.
 * Returns the updated command (caller should immutably update shapes array).
 */
export function updateShapePoint(cmd, pointKey, newX, newY) {
    const c = { ...cmd };
    switch (pointKey) {
        case "xy":
            c.x = newX;
            c.y = newY;
            break;
        case "widthHeight":
            if ("width" in c && "height" in c) {
                c.width = Math.max(0, newX - (c.x ?? 0));
                c.height = Math.max(0, newY - (c.y ?? 0));
            }
            break;
        case "radius":
            if ("radius" in c) {
                c.radius = Math.max(0, newX - (c.x ?? 0));
            }
            break;
        case "radiusX":
            if ("radiusX" in c) {
                c.radiusX = Math.max(0, newX - (c.x ?? 0));
            }
            break;
        case "radiusY":
            if ("radiusY" in c) {
                c.radiusY = Math.max(0, newY - (c.y ?? 0));
            }
            break;
        case "x1y1":
            if ("x1" in c && "y1" in c) {
                c.x1 = newX;
                c.y1 = newY;
            }
            break;
        case "x2y2":
            if ("x2" in c && "y2" in c) {
                c.x2 = newX;
                c.y2 = newY;
            }
            break;
        case "cp1":
            if ("cp1x" in c && "cp1y" in c) {
                c.cp1x = newX;
                c.cp1y = newY;
            }
            break;
        case "cp2":
            if ("cp2x" in c && "cp2y" in c) {
                c.cp2x = newX;
                c.cp2y = newY;
            }
            break;
        case "end":
            if ("x" in c && "y" in c) {
                c.x = newX;
                c.y = newY;
            }
            break;
        default:
            break;
    }
    return c;
}
//# sourceMappingURL=shape-points.js.map