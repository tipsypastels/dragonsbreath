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
var FileMerger = /** @class */ (function () {
    function FileMerger(existingScripts, newScripts) {
        this.existingScripts = existingScripts;
        this.newScripts = newScripts;
    }
    FileMerger.prototype.merge = function () {
        var all = __assign(__assign(__assign({}, this.extractScriptsToObj(this.existingScripts)), { '@ Beginning Dragonsbreath scripts': '\n' }), this.extractScriptsToObj(this.newScripts));
        var finalScript = Object.entries(all).map(function (_a) {
            var title = _a[0], body = _a[1];
            return title + body;
        }).join('\n');
        return finalScript;
    };
    FileMerger.prototype.extractScriptsToObj = function (scripts) {
        var results = {};
        var titlesAndBodies = scripts.split(/^\s*([A-z0-9_]+::?)/m)
            .slice(1);
        for (var i = 1; i < titlesAndBodies.length; i += 2) {
            results[titlesAndBodies[i - 1]] = titlesAndBodies[i];
        }
        return results;
    };
    return FileMerger;
}());
exports.default = FileMerger;
