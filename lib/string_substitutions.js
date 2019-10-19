"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function stringSubstitutions(text) {
    return text.replace(/([A-Z_]+?)\((.+?)\)/g, '{COLOR $1}$2{COLOR NO_COLOR}');
}
exports.default = stringSubstitutions;
