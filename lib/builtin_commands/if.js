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
var If = /** @class */ (function (_super) {
    __extends(If, _super);
    function If() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    If.prototype.render = function () {
        this.assertChildren()
            .assertParams(['eq', 'ge', 'gt', 'le', 'lt']);
        var condition = this.parameters[0];
        // make typescript happy
        if (typeof condition.value !== 'object') {
            return;
        }
        var _a = condition.value, left = _a.left, right = _a.right;
        if (left.type === 'token') {
            this.output
                .addLine(this.param(left))
                .addLine("compare VAR_RESULT, " + this.param(right));
        }
        else {
            this.output
                .addLine("compare " + this.param(left) + ", " + this.param(right));
        }
        this.output.addGoto({ type: 'code', if: condition.type });
    };
    return If;
}(builtin_command_1.default));
exports.default = If;
