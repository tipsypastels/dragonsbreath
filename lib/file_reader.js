"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var FileReader = /** @class */ (function () {
    function FileReader() {
        this.EXT = 'dbr';
        this.BASE = __dirname.replace(/\\(?:src|lib)$/, '');
    }
    FileReader.prototype.compileAll = function (callback) {
        return this.compileDir(this.BASE, callback);
    };
    FileReader.prototype.compileDir = function (dir, callback) {
        var results = [];
        var files = fs_1.default.readdirSync(dir) || [];
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            var fullPath = dir + '/' + file;
            if (fs_1.default.statSync(fullPath).isDirectory()) {
                results = __spreadArrays(results, this.compileDir(fullPath, callback));
            }
            else if (file.endsWith("." + this.EXT)) {
                if (callback) {
                    callback(fullPath, fs_1.default.readFileSync(fullPath, 'utf8'));
                }
                results = results.concat(fullPath);
            }
        }
        return results;
    };
    return FileReader;
}());
exports.default = FileReader;
