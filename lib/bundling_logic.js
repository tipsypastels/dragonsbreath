"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUNDLING_KEY = '___bundle___';
exports.BUNDLING_GROUPS = [
    // text commands
    [
        'say', 'smart_say', 'ask',
    ],
];
function getBundlingIndex(command) {
    for (var i = 0; i < exports.BUNDLING_GROUPS.length; i++) {
        if (exports.BUNDLING_GROUPS[i].includes(command)) {
            return i;
        }
    }
    // return NaN so they don't compare equality, rather than having to also check against -1 or undefined
    return NaN;
}
function shouldBeBundled(lastLine, currentLine) {
    if (!lastLine || !currentLine) {
        return false;
    }
    // this is already a bundle, check and then add it in
    if (lastLine.command === exports.BUNDLING_KEY) {
        if (lastLine.bundlingGroup === getBundlingIndex(currentLine.command)) {
            return true;
        }
        // the last line is NOT currently a bundle
    }
    else {
        if (getBundlingIndex(lastLine.command) === getBundlingIndex(currentLine.command)) {
            if (lastLine.command === 'say' && currentLine.command === 'say') {
                // don't bundle different msgboxes together
                return getSayCommandMsgbox(lastLine) === getSayCommandMsgbox(currentLine);
            }
            return true;
        }
    }
    return false;
}
function tryBundleLines(lastLine, currentLine) {
    if (!shouldBeBundled(lastLine, currentLine)) {
        return false;
    }
    // if the last line is a bundle, add it on
    if (lastLine.command === exports.BUNDLING_KEY) {
        lastLine.children.push(currentLine);
    }
    else {
        var lastLineDup = __assign({}, lastLine);
        lastLine.bundlingGroup = getBundlingIndex(lastLine.command);
        lastLine.command = exports.BUNDLING_KEY;
        lastLine.children = [lastLineDup, currentLine];
        delete lastLine.parameters;
    }
    return true;
}
exports.tryBundleLines = tryBundleLines;
function getSayCommandMsgbox(line) {
    if (line.command !== 'say') {
        throw new TypeError('must be used with the say command');
    }
    if (!line.parameters || !line.parameters[1]) {
        return undefined;
    }
    return line.parameters[1].value;
}
