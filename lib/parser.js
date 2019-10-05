"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var bundling_logic_1 = require("./bundling_logic");
exports.INDENT = '  ';
var Memory = /** @class */ (function () {
    function Memory() {
        this.lines = [];
        this.chain = [];
    }
    Memory.prototype.push = function (line, indent) {
        var pushToChain = true;
        var lastLine = this.chain[this.chain.length - 1];
        if (lastLine && indent === lastLine.indent && bundling_logic_1.tryBundleLines(lastLine.line, line)) {
            pushToChain = false;
        }
        else if (indent < 1) {
            this.lines.push(line);
        }
        else {
            // find the last item in the chain whose indent is one less than this one and add it as a child
            var parentLine = __spreadArrays(this.chain).reverse().find(function (chainItem) {
                return indent === chainItem.indent + 1;
            });
            if (!parentLine) {
                throw new SyntaxError("Unexpected indent on line " + line.number);
            }
            line.signature = parentLine.line.signature.concat(line.number);
            parentLine.line.children || (parentLine.line.children = []);
            parentLine.line.children.push(line);
        }
        if (pushToChain) {
            this.chain.push({ line: line, indent: indent });
        }
    };
    Object.defineProperty(Memory.prototype, "length", {
        get: function () {
            return this.lines.length;
        },
        enumerable: true,
        configurable: true
    });
    return Memory;
}());
exports.Memory = Memory;
function getIndentDepth(lineText) {
    return /^(\s*)/.exec(lineText)[0]
        .length / exports.INDENT.length;
}
function parseLine(lineNo, lineText, memory) {
    if (lineText.length === 0 || /^[^\S]\n?$/.exec(lineText)) {
        return;
    }
    var indent = getIndentDepth(lineText);
    var strComma = Math.random() + "___StrComma___";
    lineText = lineText.replace(/^\s*/, '');
    var command = lineText.split(' ')[0];
    var parameters = lineText
        .slice(command.length + 1)
        // we don't want to break the quotes inside strings
        .replace(/"(.+?),(.+?)"/, function (_, p1, p2) { return "\"" + p1 + strComma + p2 + "\""; })
        .split(/\s*,\s*/)
        .map(function (word) { return word.replace(strComma, ','); })
        .map(parseExpression)
        .filter(function (expr) { return expr; });
    var line = {
        command: command,
        number: lineNo,
        signature: [lineNo]
    };
    var hasParams = parameters && parameters.length;
    hasParams && (line.parameters = parameters);
    memory.push(line, indent);
    return line;
}
exports.parseLine = parseLine;
function parseExpression(expr) {
    expr = expr.trim();
    if (!expr) {
        return;
    }
    var match;
    function matching(regex) {
        match = regex.exec(expr);
        return !!match;
    }
    function comparison() {
        var symbols = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            symbols[_i] = arguments[_i];
        }
        return new RegExp("^(.*)s*(?:" + symbols.join('|') + ")s*(.*)$");
    }
    function comparisonResult(type) {
        return { type: type,
            value: {
                left: parseExpression(match[1]),
                right: parseExpression(match[2]),
            }
        };
    }
    switch (true) {
        case matching(/^it$/): {
            return { type: 'it', value: 'it' };
        }
        case matching(/^\w+\s?:\s?(\w+)$/): {
            return parseExpression(match[1]);
        }
        case matching(/^(\d*\.?\d*)$/): {
            return { type: 'number', value: Number(match[0]) };
        }
        case matching(/^"(.*)"$/): {
            return { type: 'string', value: expr.slice(1, expr.length - 1) };
        }
        case matching(/^[A-Zx0-9_]+$/): {
            return { type: 'constant', value: expr };
        }
        case matching(/^[a-z0-9]+$/i): {
            return { type: 'token', value: expr };
        }
        case matching(comparison('==', '===', 'is', 'eq')): {
            return comparisonResult('eq');
        }
        // case matching(comparison('!=', '!==', 'isnt', 'neq')): {
        //   return comparisonResult('inequality');
        // }
        case matching(comparison('<', 'lt')): {
            return comparisonResult('lt');
        }
        case matching(comparison('>', 'gt')): {
            return comparisonResult('gt');
        }
        case matching(comparison('<=', 'le')): {
            return comparisonResult('le');
        }
        case matching(comparison('>=', 'ge')): {
            return comparisonResult('ge');
        }
        default: {
            throw new SyntaxError("Could not parse expression " + expr);
        }
    }
}
exports.parseExpression = parseExpression;
function parse(program) {
    var lines = program.split(/\n/);
    var memory = new Memory();
    for (var i = 0; i < lines.length; i++) {
        parseLine(i, lines[i], memory);
    }
    return memory.lines;
}
exports.default = parse;
