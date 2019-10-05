"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dictionary_1 = __importDefault(require("./builtin_commands/dictionary"));
// import BUILTINS from "./builtins";
// import { capitalize } from "./utils";
// let currentScript;
// class Externals {
//   // eh we're rewriting this anyways
//   counters: any;
//   list: any;
//   static getName(currentScript, type = 'script') {
//     (this as any).counters[type]++;
//     return `_${currentScript}_${capitalize(type)}_${(this as any).counters[type]}`;
//   }
//   constructor() {
//     this.list = [];
//   }
//   add(content) {
//     this.list.push(content);
//   }
//   format() {
//     return trimOutput(this.list.flat()).join("\n");
//   }
// }
// (Externals as any).counters = { text: 0, script: 0 };
// if (!('flat' in Array.prototype)) {
//   Array.prototype['flat'] = function() {
//     return this.reduce((acc, val) => acc.concat(val), []);
//   };
// }
// function trimOutput(out) {
//   if (typeof out === 'string') {
//     out = out.split("\n");
//   } else {
//     out = out.flat();
//   }
//   return out
//     .map(l => l.trim())
//     .filter(l => l);
// }
// function transpileBuiltin(line, number, parentLine, externals) {
//   if (!BUILTINS[line.command]) {
//     return;
//   }
//   const builtinUtils = {
//     line,
//     parentLine,
//     command: line.command,
//     parameters: line.parameters,
//     children: line.children,
//     currentScript,
//     setCurrentScript: (script) => currentScript = script,
//     transpile: (children) => transpile(children, line, externals),
//     transpileParameter,
//     addExternal: ext => externals.add(ext),
//     getExternalName: (script, type) => Externals.getName(script, type),
//     error(message) {
//       throw new SyntaxError(`(line ${number}) ${message}`);
//     },
//   }
//   return BUILTINS[line.command](builtinUtils);
// }
// function transpileParameter(parameter) {
//   switch(parameter.type) {
//     case 'string': {
//       return `"${parameter.value}"`;
//     }
//     case 'it': {
//       return 'VAR_RESULT';
//     }
//     default: {
//       return parameter.value;
//     }
//   }
// }
// function transpileDelegated({ command, parameters, children }) {
//   if (children) {
//     console.warn(`Command "${command}" was passed children, but is not a builtin command. Commands delegated to pokeemerald cannot have children. They will be ignored in the final output.`)
//   }
//   return [
//     command,
//     parameters ? parameters.map(transpileParameter).join(', ') : '',
//   ].join(' ');
// }
// function transpileLine(...args) {
//   const output = transpileBuiltin(...args)
//     || transpileDelegated(...args);
//   return trimOutput(output);
// }
// function transpile(lines, parentLine = null, externals = new Externals()) {
//   const mainScript = lines.map((l, i) => transpileLine(l, i, parentLine, externals))
//     .flat()
//     .join("\n");
//   // only add in the externals when there is no parent line (we're at the top level) or they'll get mixed in everywhere when you call transpile recursively
//   const externalScript = parentLine ? '' : externals.format();
//   return `${mainScript}\n${externalScript}`;
// }
// module.exports = { transpile };
var Transpiler = /** @class */ (function () {
    function Transpiler() {
        this.currentScript = null;
    }
    Transpiler.prototype.transpile = function (lines, parentLine) {
        var _this = this;
        return lines.map(function (l, i) { return _this.transpileLine(i, l, parentLine); }).join('\n');
    };
    Transpiler.prototype.error = function (message) {
        throw new SyntaxError(message);
    };
    // public because the transpiler can call it
    Transpiler.prototype.formatLineAsDelegated = function (line) {
        var string = line.command;
        if (line.parameters) {
            string += " " + line.parameters.map(this.transpileParameter).join(', ');
        }
        return string;
    };
    Transpiler.prototype.transpileLine = function (lineNo, line, parentLine) {
        var method = line.command;
        if (method in dictionary_1.default) {
            return new dictionary_1.default[method](line, parentLine, this)
                .callRender();
        }
        else {
            return this.formatLineAsDelegated(line);
        }
    };
    Transpiler.prototype.transpileParameter = function (parameter) {
        switch (parameter.type) {
            case 'string': {
                return "\"" + parameter.value + "\"";
            }
            case 'it': {
                return 'VAR_RESULT';
            }
            default: {
                return parameter.value.toString();
            }
        }
    };
    return Transpiler;
}());
exports.default = Transpiler;
