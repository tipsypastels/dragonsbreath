"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var builtin_command_1 = __importDefault(require("./builtin_command"));
var line_1 = require("../line");
var utils_1 = require("../utils");
/**
 * Does a subscript belong to a given line or any of its children
 */
function subscriptIsChildOfLine(subscript, line) {
    return line_1.lineIsDescendant(subscript.sourceLine, line);
}
exports.subscriptIsChildOfLine = subscriptIsChildOfLine;
var Script = /** @class */ (function (_super) {
    __extends(Script, _super);
    function Script(line, parentLine, transpiler) {
        var _this = _super.call(this, line, parentLine, transpiler) || this;
        _this.subscripts = [];
        Script.current = _this;
        return _this;
    }
    Object.defineProperty(Script.prototype, "name", {
        get: function () {
            return this.param(this.parameters[0]);
        },
        enumerable: true,
        configurable: true
    });
    Script.prototype.render = function () {
        var _this = this;
        this.assertChildren()
            .assertParams('token');
        this.output
            .addLine(this.parameters[0].value + "::")
            .yield()
            .addLine('end');
        this.subscripts.forEach(function (subscript) {
            var _a;
            (_a = _this.output
                .addLine('\n')
                .addLine(subscript.name + ":" + (subscript.type === 'code' ? ':' : ''))).addLine.apply(_a, subscript.texts).addLineIf(subscript.type === 'code', 'end')
                .addLineIf(subscript.type === 'movement', 'step_end')
                .addLine('\n');
        });
    };
    Script.prototype.getSubscriptName = function (type) {
        return "_" + this.name + "_Subscript_" + utils_1.capitalize(type) + "_" + this.subscripts.length;
    };
    return Script;
}(builtin_command_1.default));
exports.default = Script;
