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
var GiveMon = /** @class */ (function (_super) {
    __extends(GiveMon, _super);
    function GiveMon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GiveMon.prototype.render = function () {
        this.assertParams('constant', 'number', { optional: 'constant' });
        var _a = this.parameters, species = _a[0], level = _a[1], item = _a[2];
        var outputParams = [
            this.param(species),
            this.param(level),
            item ? this.param(item) : 'ITEM_NONE',
        ].join(', ');
        this.output.addLine("givemon " + outputParams);
    };
    return GiveMon;
}(builtin_command_1.default));
exports.default = GiveMon;
