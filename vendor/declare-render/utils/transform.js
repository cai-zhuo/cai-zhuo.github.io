/**
 * Transform utilities for canvas editor.
 * Based on patterns from Fabric.js and Konva.
 */
/**
 * Calculate the Axis-Aligned Bounding Box (AABB) of a rotated rectangle.
 * This is used for selection bounds calculation after rotation.
 * Based on Konva's getClientRect pattern.
 */
export function getRotatedBounds(cx, cy, width, height, rotation) {
    if (rotation === 0 || width === 0 || height === 0) {
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
 * Get the world-space position of a corner of an axis-aligned rect after rotation.
 * Based on Fabric.js control positioning.
 */
export function getRotatedCornerPosition(bounds, corner, rotationDeg) {
    const w = bounds.x2 - bounds.x1;
    const h = bounds.y2 - bounds.y1;
    const cx = (bounds.x1 + bounds.x2) / 2;
    const cy = (bounds.y1 + bounds.y2) / 2;
    const rad = (rotationDeg * Math.PI) / 180;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    let lx, ly;
    switch (corner) {
        case 'nw':
            lx = -w / 2;
            ly = -h / 2;
            break;
        case 'ne':
            lx = w / 2;
            ly = -h / 2;
            break;
        case 'sw':
            lx = -w / 2;
            ly = h / 2;
            break;
        case 'se':
            lx = w / 2;
            ly = h / 2;
            break;
    }
    return { x: cx + lx * c - ly * s, y: cy + lx * s + ly * c };
}
/**
 * Get the world-space position of an edge center after rotation.
 * Used for edge resize handle hit-testing.
 */
export function getRotatedEdgePosition(bounds, edge, rotationDeg) {
    const w = bounds.x2 - bounds.x1;
    const h = bounds.y2 - bounds.y1;
    const cx = (bounds.x1 + bounds.x2) / 2;
    const cy = (bounds.y1 + bounds.y2) / 2;
    const rad = (rotationDeg * Math.PI) / 180;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    let lx, ly;
    switch (edge) {
        case 'n':
            lx = 0;
            ly = -h / 2;
            break;
        case 's':
            lx = 0;
            ly = h / 2;
            break;
        case 'e':
            lx = w / 2;
            ly = 0;
            break;
        case 'w':
            lx = -w / 2;
            ly = 0;
            break;
    }
    return { x: cx + lx * c - ly * s, y: cy + lx * s + ly * c };
}
/**
 * Get the position of a transform control handle.
 */
export function getControlPosition(bounds, control, rotationDeg) {
    if (control === 'rotation') {
        // Rotation handle is above the top edge
        const topCenter = getRotatedEdgePosition(bounds, 'n', rotationDeg);
        return { x: topCenter.x, y: topCenter.y - 30 };
    }
    if (isCornerName(control)) {
        return getRotatedCornerPosition(bounds, control, rotationDeg);
    }
    return getRotatedEdgePosition(bounds, control, rotationDeg);
}
function isCornerName(val) {
    return ['nw', 'ne', 'sw', 'se'].includes(val);
}
/**
 * Calculate rotation angle from pivot point to mouse position.
 * Returns angle in degrees.
 */
export function getRotationAngle(pivotX, pivotY, mouseX, mouseY) {
    return (Math.atan2(mouseY - pivotY, mouseX - pivotX) * 180) / Math.PI;
}
/**
 * Snap angle to nearest increment.
 */
export function snapAngle(angle, snapDegrees = 15) {
    if (snapDegrees <= 0)
        return angle;
    return Math.round(angle / snapDegrees) * snapDegrees;
}
/**
 * Check if a point is inside a rotated rectangle.
 */
export function pointInRotatedRect(px, py, cx, cy, width, height, rotation) {
    // Translate point to be relative to center
    const dx = px - cx;
    const dy = py - cy;
    // If no rotation, simple AABB check
    if (rotation === 0) {
        return (dx >= -width / 2 &&
            dx <= width / 2 &&
            dy >= -height / 2 &&
            dy <= height / 2);
    }
    // Rotate point in opposite direction to check if inside
    const angleRad = (-rotation * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    const rx = dx * cos - dy * sin;
    const ry = dx * sin + dy * cos;
    return (rx >= -width / 2 &&
        rx <= width / 2 &&
        ry >= -height / 2 &&
        ry <= height / 2);
}
/**
 * Calculate scale factors for resizing from a drag delta.
 * Based on Fabric.js scale logic.
 */
export function getScaleFactors(corner, deltaX, deltaY, currentWidth, currentHeight, proportional = false) {
    let scaleX = 1;
    let scaleY = 1;
    const aspectRatio = currentWidth / currentHeight;
    switch (corner) {
        case 'se':
            scaleX = deltaX / currentWidth;
            scaleY = deltaY / currentHeight;
            break;
        case 'sw':
            scaleX = -deltaX / currentWidth;
            scaleY = deltaY / currentHeight;
            break;
        case 'ne':
            scaleX = deltaX / currentWidth;
            scaleY = -deltaY / currentHeight;
            break;
        case 'nw':
            scaleX = -deltaX / currentWidth;
            scaleY = -deltaY / currentHeight;
            break;
    }
    if (proportional) {
        // Maintain aspect ratio
        const avgScale = (Math.abs(scaleX) + Math.abs(scaleY)) / 2;
        scaleX = avgScale * (scaleX >= 0 ? 1 : -1);
        scaleY = avgScale * (scaleY >= 0 ? 1 : -1);
    }
    return { scaleX, scaleY };
}
/**
 * Calculate new dimensions after scaling.
 */
export function calculateScaledDimensions(currentWidth, currentHeight, scaleX, scaleY, corner) {
    let newWidth = currentWidth * Math.abs(scaleX);
    let newHeight = currentHeight * Math.abs(scaleY);
    let x = 0;
    let y = 0;
    // Adjust position based on which corner is being dragged
    switch (corner) {
        case 'se':
            x = 0;
            y = 0;
            break;
        case 'sw':
            x = currentWidth * (1 - Math.abs(scaleX));
            y = 0;
            break;
        case 'ne':
            x = 0;
            y = currentHeight * (1 - Math.abs(scaleY));
            break;
        case 'nw':
            x = currentWidth * (1 - Math.abs(scaleX));
            y = currentHeight * (1 - Math.abs(scaleY));
            break;
    }
    return {
        width: Math.max(newWidth, 10),
        height: Math.max(newHeight, 10),
        x,
        y,
    };
}
/**
 * Get the cursor style for a control handle.
 */
export function getControlCursor(control, rotation) {
    if (control === 'rotation') {
        return 'grab';
    }
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    // Map corners to cursors based on rotation
    if (['nw', 'se'].includes(control)) {
        if (normalizedRotation >= 315 || normalizedRotation < 45) {
            return 'nwse-resize';
        }
        if (normalizedRotation >= 45 && normalizedRotation < 135) {
            return 'nesw-resize';
        }
        if (normalizedRotation >= 135 && normalizedRotation < 225) {
            return 'nwse-resize';
        }
        return 'nesw-resize';
    }
    if (['ne', 'sw'].includes(control)) {
        if (normalizedRotation >= 315 || normalizedRotation < 45) {
            return 'nesw-resize';
        }
        if (normalizedRotation >= 45 && normalizedRotation < 135) {
            return 'nwse-resize';
        }
        if (normalizedRotation >= 135 && normalizedRotation < 225) {
            return 'nesw-resize';
        }
        return 'nwse-resize';
    }
    // Edge handles
    if (control === 'n' || control === 's') {
        return 'ns-resize';
    }
    if (control === 'e' || control === 'w') {
        return 'ew-resize';
    }
    return 'default';
}
/**
 * Convert control name to x/y anchor offsets.
 */
export function getControlAnchor(control) {
    switch (control) {
        case 'nw':
            return { originX: 'left', originY: 'top' };
        case 'ne':
            return { originX: 'right', originY: 'top' };
        case 'sw':
            return { originX: 'left', originY: 'bottom' };
        case 'se':
            return { originX: 'right', originY: 'bottom' };
        case 'n':
            return { originX: 'center', originY: 'top' };
        case 's':
            return { originX: 'center', originY: 'bottom' };
        case 'e':
            return { originX: 'right', originY: 'center' };
        case 'w':
            return { originX: 'left', originY: 'center' };
        case 'rotation':
            return { originX: 'center', originY: 'top' };
        default:
            return { originX: 'center', originY: 'center' };
    }
}
//# sourceMappingURL=transform.js.map