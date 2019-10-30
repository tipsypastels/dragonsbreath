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
var ShowPortrait = /** @class */ (function (_super) {
    __extends(ShowPortrait, _super);
    function ShowPortrait() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShowPortrait.prototype.render = function () {
        if (this.children) {
            this.output
                .addLine(this.delegate())
                .yield()
                .addLine('hideportrait');
        }
        else {
            return this.delegate();
        }
    };
    return ShowPortrait;
}(builtin_command_1.default));
exports.default = ShowPortrait;
