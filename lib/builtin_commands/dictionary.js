"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
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
var bundling_logic_1 = require("../bundling_logic");
var ___bundle___1 = __importDefault(require("./___bundle___"));
var lockall_1 = __importDefault(require("./lockall"));
var choose_randomly_1 = __importDefault(require("./choose_randomly"));
var option_1 = __importDefault(require("./option"));
var when_1 = __importDefault(require("./when"));
var showportrait_1 = __importDefault(require("./showportrait"));
var spawn_camera_1 = __importDefault(require("./spawn_camera"));
var ask_1 = __importDefault(require("./ask"));
var BUILTIN_COMMAND_DICT = (_a = {
        script: script_1.default,
        lock: lock_1.default,
        lockall: lockall_1.default,
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
        choose_randomly: choose_randomly_1.default,
        option: option_1.default,
        when: when_1.default,
        showportrait: showportrait_1.default,
        showplayerportrait: showportrait_1.default,
        spawncamera: spawn_camera_1.default,
        ask: ask_1.default
    },
    _a[bundling_logic_1.BUNDLING_KEY] = ___bundle___1.default,
    _a);
misc_movement_command_1.default.all
    .forEach(function (m) { return BUILTIN_COMMAND_DICT[m] = misc_movement_command_1.default; });
exports.default = BUILTIN_COMMAND_DICT;
