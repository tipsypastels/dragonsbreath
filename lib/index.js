"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var file_reader_1 = __importDefault(require("./file_reader"));
var transpiler_1 = __importDefault(require("./transpiler"));
var parser_1 = __importDefault(require("./parser"));
var fs_1 = __importDefault(require("fs"));
var file_merger_1 = __importDefault(require("./file_merger"));
function pipeThroughDragonsbreath(content) {
    return new transpiler_1.default().transpile(parser_1.default(content));
}
function run() {
    console.log("Running \u001B[36mDragonsbreath\u001B[0m v1.0.0 by \u001B[36mDakota\u001B[0m");
    new file_reader_1.default().compileAll(function (file, content) {
        var result;
        try {
            result = pipeThroughDragonsbreath(content);
            var resultPath = file.replace(/.dbr$/, '.inc');
            if (fs_1.default.existsSync(resultPath)) {
                var existingScripts = fs_1.default.readFileSync(resultPath, 'utf8');
                var merger = new file_merger_1.default(existingScripts, result);
                fs_1.default.writeFileSync(resultPath, merger.merge());
                console.log("Compiled file " + file + " to " + resultPath + ", merging with existing scripts");
            }
            else {
                fs_1.default.writeFileSync(resultPath, result);
                console.log("Compiled file " + file + " to " + resultPath);
            }
        }
        catch (e) {
            console.log("\u001B[31mFailed to compile file " + file + ". " + e + "\u001B[0m");
        }
    });
    console.log("\u001B[36mDragonsbreath\u001B[0m has finished processing your files.");
}
exports.run = run;
