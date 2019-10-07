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
var msgbox_1 = __importDefault(require("../msgbox"));
var Say = /** @class */ (function (_super) {
    __extends(Say, _super);
    function Say() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Say.prototype.render = function () {
        var _this = this;
        this.assertParams('string', { optional: 'constant' });
        var _a = this.parameters, text = _a[0], msgbox = _a[1];
        msgbox_1.default.change(msgbox && msgbox.value, function () {
            _this.output.addGoto({
                type: 'text',
                lines: ".string " + _this.param(text)
            });
        });
    };
    return Say;
}(builtin_command_1.default));
exports.default = Say;
