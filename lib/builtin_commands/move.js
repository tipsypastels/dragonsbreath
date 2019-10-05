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
var misc_movement_command_1 = __importDefault(require("./misc_movement_command"));
var Move = /** @class */ (function (_super) {
    __extends(Move, _super);
    function Move() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Move.prototype.render = function () {
        return this.output.addGoto({ type: 'movement', eventId: this.eventId });
    };
    Object.defineProperty(Move.prototype, "eventId", {
        get: function () {
            this.assertChildren()
                .assertParams(['number', 'constant', 'token']);
            if (this.children.some(function (c) { return misc_movement_command_1.default.all.indexOf(c.command) === -1; })) {
                this.error('All children of the move command must be movement commands. You cannot use regular commands as children of move.');
            }
            var id = this.parameters[0];
            if (id.type === 'token') {
                if (id.value === 'player') {
                    id = { type: 'constant', value: 'EVENT_OBJ_ID_PLAYER' };
                }
                else {
                    throw new SyntaxError('The parameter to the move command must be a number, a constant, or the token player');
                }
            }
            return this.param(id);
        },
        enumerable: true,
        configurable: true
    });
    return Move;
}(builtin_command_1.default));
exports.default = Move;
