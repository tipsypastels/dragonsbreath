"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var script_1 = __importStar(require("./builtin_commands/script"));
var msgbox_1 = __importDefault(require("./msgbox"));
var CommandOutputBuilder = /** @class */ (function () {
    function CommandOutputBuilder(command) {
        this.command = command;
        this.result = [];
    }
    CommandOutputBuilder.prototype.addLine = function () {
        var _a;
        var lines = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            lines[_i] = arguments[_i];
        }
        (_a = this.result).push.apply(_a, lines);
        return this;
    };
    CommandOutputBuilder.prototype.addLineIf = function (condition) {
        var lines = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            lines[_i - 1] = arguments[_i];
        }
        if (condition) {
            this.addLine.apply(this, lines);
        }
        return this;
    };
    CommandOutputBuilder.prototype.addGoto = function (opts) {
        if (script_1.default.current) {
            /**
             * order matters here - if you get the name before yielding, all children that use subscripts will also have the same numeric subscript id, because we're fetching the name first and only pushing the line on after. so always yield before getting the name
             */
            var yieldedLines = (opts.lines || this.command.yield())
                .split('\n');
            var subscriptName = script_1.default.current
                .getSubscriptName(opts.type);
            var lineName = void 0;
            switch (opts.type) {
                case 'code':
                    {
                        lineName = "goto_if_" + opts.if + " " + subscriptName;
                        break;
                    }
                    ;
                case 'text':
                    {
                        lineName = "msgbox " + subscriptName + ", " + msgbox_1.default.current;
                        break;
                    }
                    ;
                case 'movement': {
                    lineName = "applymovement " + opts.eventId + ", " + subscriptName;
                    break;
                }
            }
            this.addLine(lineName);
            script_1.default.current.subscripts.push({
                name: subscriptName,
                type: opts.type,
                texts: yieldedLines,
                sourceLine: this.command.line,
                sourceParentLine: this.command.parentLine,
            });
        }
        return this;
    };
    CommandOutputBuilder.prototype.eachSubscript = function (callback, _a) {
        var _this = this;
        var type = (_a === void 0 ? {} : _a).type;
        if (script_1.default.current) {
            script_1.default.current.subscripts.forEach(function (subscript) {
                if (type && subscript.type !== type) {
                    return;
                }
                if (!script_1.subscriptIsChildOfLine(subscript, _this.command.line)) {
                    return;
                }
                callback(subscript);
            });
        }
        return this;
    };
    CommandOutputBuilder.prototype.yield = function () {
        this.result.push(this.command.yield());
        return this;
    };
    CommandOutputBuilder.prototype.toString = function () {
        return this.result.join('\n');
    };
    return CommandOutputBuilder;
}());
exports.default = CommandOutputBuilder;
