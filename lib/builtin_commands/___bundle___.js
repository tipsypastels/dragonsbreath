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
var ___Bundle___ = /** @class */ (function (_super) {
    __extends(___Bundle___, _super);
    function ___Bundle___() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ___Bundle___.prototype.render = function () {
        var _this = this;
        switch (this.line.bundlingGroup) {
            case 0:
                {
                    return this.output
                        .addGoto({
                        type: 'text',
                        lines: this.children.map(function (c) {
                            return ".string " + _this.param(c.parameters[0]);
                        }).join('\n'),
                    });
                }
                ;
            default: {
                throw new TypeError("Unknown bundling group " + this.line.bundlingGroup);
            }
        }
    };
    return ___Bundle___;
}(builtin_command_1.default));
exports.default = ___Bundle___;
