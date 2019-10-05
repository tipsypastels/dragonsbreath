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
var Lock = /** @class */ (function (_super) {
    __extends(Lock, _super);
    function Lock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Lock.prototype.render = function () {
        if (this.children) {
            return this.output
                .addLine('lock')
                .yield()
                .eachSubscript(function (s) { return s.texts.push('release'); }, { type: 'code' })
                .addLine('release');
        }
        else {
            return 'lock';
        }
    };
    return Lock;
}(builtin_command_1.default));
exports.default = Lock;
