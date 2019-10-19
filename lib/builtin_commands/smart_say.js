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
var smart_split_text_1 = __importDefault(require("../smart_split_text"));
var MAX_LINE_LENGTH = 40;
var SmartSay = /** @class */ (function (_super) {
    __extends(SmartSay, _super);
    function SmartSay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SmartSay.prototype.render = function () {
        this.assertParams('string', { optional: 'constant' });
        var _a = this.parameters, textParam = _a[0], msgbox = _a[1];
        var text = this.param(textParam);
        if (text.match(new RegExp("{" + BANNED_INDETERMINABLE_CONSTANTS.join('|') + "}", 'g'))) {
            this.error("Text subtitution constants, such as {PLAYER}, cannot currently be used in smart_say, because Dragonsbreath has no way to determine their length. Note that color constants such as {COLOR RED} are permitted.");
        }
        var strings = smart_split_text_1.default(text, {
            maxLen: MAX_LINE_LENGTH,
            pertinentRepresentation: function (text) {
                return text
                    .replace(/{[A-Z_ ]+?}/g, '')
                    .replace(/\\.|\$$/, '');
            },
        });
    };
    return SmartSay;
}(builtin_command_1.default));
exports.default = SmartSay;
var BANNED_INDETERMINABLE_CONSTANTS = [
    'PLAYER',
    'STR_VAR_1',
    'STR_VAR_2',
    'STR_VAR_3',
    'KUN',
    'RIVAL',
    'VERSION',
    'AQUA',
    'MAGMA',
    'ARCHIE',
    'MAXIE',
    'KYOGRE',
    'GROUDON',
    'B_BUFF1',
    'B_BUFF2',
    'B_COPY_VAR_1',
    'B_COPY_VAR_2',
    'B_COPY_VAR_3',
    'B_PLAYER_MON1_NAME',
    'B_OPPONENT_MON1_NAME',
    'B_PLAYER_MON2_NAME',
    'B_OPPONENT_MON2_NAME',
    'B_LINK_PLAYER_MON1_NAME',
    'B_LINK_OPPONENT_MON1_NAME',
    'B_LINK_PLAYER_MON2_NAME',
    'B_LINK_OPPONENT_MON2_NAME',
    'B_ATK_NAME_WITH_PREFIX_MON1',
    'B_ATK_PARTNER_NAME',
    'B_ATK_NAME_WITH_PREFIX',
    'B_DEF_NAME_WITH_PREFIX',
    'B_EFF_NAME_WITH_PREFIX',
    'B_ACTIVE_NAME_WITH_PREFIX',
    'B_SCR_ACTIVE_NAME_WITH_PREFIX',
    'B_CURRENT_MOVE',
    'B_LAST_MOVE',
    'B_LAST_ITEM',
    'B_LAST_ABILITY',
    'B_ATK_ABILITY',
    'B_DEF_ABILITY',
    'B_SCR_ACTIVE_ABILITY',
    'B_EFF_ABILITY',
    'B_TRAINER1_CLASS',
    'B_TRAINER1_NAME',
    'B_LINK_PLAYER_NAME',
    'B_LINK_PARTNER_NAME',
    'B_LINK_OPPONENT1_NAME',
    'B_LINK_OPPONENT2_NAME',
    'B_LINK_SCR_TRAINER_NAME',
    'B_PLAYER_NAME',
    'B_TRAINER1_LOSE_TEXT',
    'B_TRAINER1_WIN_TEXT',
    'B_26',
    'B_PC_CREATOR_NAME',
    'B_ATK_PREFIX1',
    'B_DEF_PREFIX1',
    'B_ATK_PREFIX2',
    'B_DEF_PREFIX2',
    'B_ATK_PREFIX3',
    'B_DEF_PREFIX3',
    'B_TRAINER2_CLASS',
    'B_TRAINER2_NAME',
    'B_TRAINER2_LOSE_TEXT',
    'B_TRAINER2_WIN_TEXT',
    'B_PARTNER_CLASS',
    'B_PARTNER_NAME',
    'B_BUFF3',
    'NAME_END',
    'SPECIAL_F7',
];
