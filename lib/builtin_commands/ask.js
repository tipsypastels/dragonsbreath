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
var say_1 = __importDefault(require("./say"));
var Ask = /** @class */ (function (_super) {
    __extends(Ask, _super);
    function Ask() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ask.prototype.render = function () {
        this.assertParams('string');
        this.parameters.push({ type: 'constant', value: 'MSGBOX_YESNO' });
        return _super.prototype.render.call(this);
    };
    return Ask;
}(say_1.default));
exports.default = Ask;
