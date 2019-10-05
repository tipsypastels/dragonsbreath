"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var command_output_builder_1 = __importDefault(require("../command_output_builder"));
var BuiltinCommand = /** @class */ (function () {
    function BuiltinCommand(line, parentLine, transpiler) {
        this.line = line;
        this.parentLine = parentLine;
        this.transpiler = transpiler;
        this.output = new command_output_builder_1.default(this);
    }
    Object.defineProperty(BuiltinCommand.prototype, "command", {
        get: function () {
            return this.line.command;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BuiltinCommand.prototype, "parameters", {
        get: function () {
            return this.line.parameters;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BuiltinCommand.prototype, "children", {
        get: function () {
            return this.line.children;
        },
        enumerable: true,
        configurable: true
    });
    BuiltinCommand.prototype.yield = function () {
        return this.transpiler.transpile(this.line.children, this.line);
    };
    BuiltinCommand.prototype.delegate = function () {
        return this.transpiler.formatLineAsDelegated(this.line);
    };
    BuiltinCommand.prototype.error = function (message) {
        this.transpiler.error(message);
    };
    BuiltinCommand.prototype.param = function (param) {
        return this.transpiler.transpileParameter(param);
    };
    BuiltinCommand.prototype.assertParams = function () {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        var _a = this, command = _a.command, parameters = _a.parameters;
        parameters || (parameters = []);
        var requiredTypes = types.filter(function (t) {
            return typeof t === 'string' || Array.isArray(t);
        });
        var rangeStr = requiredTypes.length === types.length
            ? requiredTypes.length
            : requiredTypes.length + ".." + types.length;
        if (parameters.length < requiredTypes.length) {
            this.error(command + " requires " + rangeStr + " parameters, got " + parameters.length);
        }
        if (parameters.length > types.length) {
            this.error(command + " requires " + rangeStr + " parameters, got " + parameters.length);
        }
        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            var param = parameters[i];
            var valid = void 0;
            if (typeof type === 'string') {
                valid = type === param.type;
            }
            else if (Array.isArray(type)) {
                valid = type.includes(param.type);
            }
            else if (typeof type.optional === 'string') {
                valid = !param || type.optional === param.type;
            }
            else {
                valid = !param || type.optional.includes(param.type);
            }
            if (!valid) {
                this.error("Parameter " + (i + 1) + " of " + command + " must be " + types[i] + ", got " + parameters[i].type);
            }
        }
        return this;
    };
    BuiltinCommand.prototype.assertChildren = function () {
        if (!this.children) {
            this.error("Cannot have an empty " + this.command);
        }
        return this;
    };
    BuiltinCommand.prototype.callRender = function () {
        return (this.render() || this.output).toString();
    };
    return BuiltinCommand;
}());
exports.default = BuiltinCommand;
