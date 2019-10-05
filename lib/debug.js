"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
function p(x) {
    console.log(util_1.inspect(x, { depth: null }));
    return x;
}
exports.default = p;
