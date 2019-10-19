"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function smartSplitText(text, opts) {
    opts.pertinentRepresentation || (opts.pertinentRepresentation = function (a) { return a; });
    var lines = [];
    var current = [];
    var words = text.split(/(?!{.+?)\s+(?!.+?})/);
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        if (opts.pertinentRepresentation(current.concat(word).join(' ')).length > opts.maxLen) {
            lines.push(current.join(' '));
            current = [word];
        }
        else {
            current.push(word);
        }
        if (i === words.length - 1) {
            lines.push(current.join(' '));
        }
    }
    return lines;
}
exports.default = smartSplitText;
