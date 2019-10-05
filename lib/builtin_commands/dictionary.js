"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var script_1 = __importDefault(require("./script"));
var lock_1 = __importDefault(require("./lock"));
var if_1 = __importDefault(require("./if"));
var else_1 = __importDefault(require("./else"));
var using_msgbox_1 = __importDefault(require("./using_msgbox"));
var say_1 = __importDefault(require("./say"));
var end_1 = __importDefault(require("./end"));
var givemon_1 = __importDefault(require("./givemon"));
var misc_movement_command_1 = __importDefault(require("./misc_movement_command"));
var move_1 = __importDefault(require("./move"));
var move_and_wait_1 = __importDefault(require("./move_and_wait"));
var BUILTIN_COMMAND_DICT = {
    script: script_1.default,
    lock: lock_1.default,
    if: if_1.default,
    else_if: if_1.default,
    elif: if_1.default,
    else: else_1.default,
    using_msgbox: using_msgbox_1.default,
    say: say_1.default,
    end: end_1.default,
    step_end: end_1.default,
    givemon: givemon_1.default,
    move: move_1.default,
    move_and_wait: move_and_wait_1.default,
};
misc_movement_command_1.default.all
    .forEach(function (m) { return BUILTIN_COMMAND_DICT[m] = misc_movement_command_1.default; });
exports.default = BUILTIN_COMMAND_DICT;
