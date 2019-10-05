"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function lineIsDescendant(child, ancestor) {
    return child.signature.includes(ancestor.number);
}
exports.lineIsDescendant = lineIsDescendant;
