"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var file_reader_1 = __importDefault(require("./file_reader"));
var transpiler_1 = __importDefault(require("./transpiler"));
var parser_1 = __importDefault(require("./parser"));
var fs_1 = __importDefault(require("fs"));
function pipeThroughDragonsbreath(content) {
    console.log(require('util').inspect(parser_1.default(content), { depth: null }));
    return new transpiler_1.default().transpile(parser_1.default(content));
}
new file_reader_1.default().compileAll(function (file, content) {
    var result;
    try {
        result = pipeThroughDragonsbreath(content);
    }
    catch (e) {
        console.log("\u001B[31mFailed to compile file " + file + ". " + e + "\u001B[0m");
    }
    fs_1.default.writeFileSync(file.replace(/.dbr$/, '.inc'), result);
});
