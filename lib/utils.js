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
    var firstLineWithContent = lines.find(function (l) { return l.trim(); });
    var indent;
    var match;
    if (match = /^\s+/.exec(firstLineWithContent)) {
        indent = match[0].length;
    }
    else {
        indent = 0;
    }
    return lines.map(function (l) { return l.slice(indent); }).join('\n');
}
exports.trimAndKeepIndents = trimAndKeepIndents;
