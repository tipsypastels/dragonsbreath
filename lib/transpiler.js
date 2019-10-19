"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dictionary_1 = __importDefault(require("./builtin_commands/dictionary"));
var string_substitutions_1 = __importDefault(require("./string_substitutions"));
var Transpiler = /** @class */ (function () {
    function Transpiler() {
    }
    Transpiler.prototype.transpile = function (lines, parentLine) {
        var _this = this;
        return lines.map(function (l, i) { return _this.transpileLine(i, l, parentLine); }).join('\n'). /* yes this is intended*/split('\n').map(function (l) {
            if (l.match(/^[A-z0-9_]+::?/)) {
                return l.trim();
            }
            return "  " + l.trim();
        }).join('\n');
    };
    Transpiler.prototype.error = function (message) {
        throw new SyntaxError(message);
    };
    // public because the transpiler can call it
    Transpiler.prototype.formatLineAsDelegated = function (line) {
        var string = line.command;
        if (line.parameters) {
            string += " " + line.parameters.map(this.transpileParameter).join(', ');
        }
        return string;
    };
    Transpiler.prototype.transpileLine = function (lineNo, line, parentLine) {
        var method = line.command;
        if (method in dictionary_1.default) {
            return new dictionary_1.default[method](line, parentLine, this)
                .callRender();
        }
        else {
            return this.formatLineAsDelegated(line);
        }
    };
    Transpiler.prototype.transpileParameter = function (parameter) {
        switch (parameter.type) {
            case 'string': {
                return string_substitutions_1.default("\"" + parameter.value + "\"");
            }
            case 'it': {
                return 'VAR_RESULT';
            }
            default: {
                return parameter.value.toString();
            }
        }
    };
    return Transpiler;
}());
exports.default = Transpiler;
