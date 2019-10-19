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
var script_1 = require("./builtin_commands/script");
var FileMerger = /** @class */ (function () {
    function FileMerger(existingScripts, newScripts) {
        this.existingScripts = existingScripts;
        this.newScripts = newScripts;
    }
    FileMerger.prototype.merge = function () {
        var existingScripts = this.extractScriptsToObj(this.existingScripts);
        var newScripts = this.extractScriptsToObj(this.newScripts);
        var all = __assign(__assign({}, existingScripts), newScripts);
        // remove old dragonsbreath scripts that were removed in the incoming code
        for (var scriptName in all) {
            if (all[scriptName].includes("@ " + script_1.DRAGONSBREATH_SCRIPT_MAGIC_COMMENT) && !newScripts[scriptName]) {
                delete all[scriptName];
            }
        }
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
