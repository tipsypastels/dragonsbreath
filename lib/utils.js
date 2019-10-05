"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}
exports.capitalize = capitalize;
function dig(obj, prop) {
    if (obj) {
        return obj[prop];
    }
}
exports.dig = dig;
/**
 * trims each line, but only as much as the lowest indented-line. for example:
 *      `a
 *        b`
 * becomes:
 * `a
 *   b`
 */
function trimAndKeepIndents(text) {
    var lines = text.split('\n');
    var lowestIndent = Math.min.apply(Math, lines.map(function (line) {
        var match = /^\s+/.exec(line);
        if (match) {
            return match[0].length;
        }
        return Infinity;
    }));
    if (lowestIndent === Infinity) {
        lowestIndent = 0;
    }
    return lines.map(function (l) { return l.slice(lowestIndent); }).join('\n');
}
exports.trimAndKeepIndents = trimAndKeepIndents;
