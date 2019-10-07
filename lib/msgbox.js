"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Msgbox = /** @class */ (function () {
    function Msgbox() {
    }
    Msgbox.change = function (value, callback) {
        try {
            if (value) {
                this.current = value;
            }
            callback();
        }
        finally {
            this.current = 'MSGBOX_DEFAULT';
        }
    };
    Msgbox.current = 'MSGBOX_DEFAULT';
    return Msgbox;
}());
exports.default = Msgbox;
