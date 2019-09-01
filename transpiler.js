const BUILTINS = require('./builtins');
const { capitalize } = require('./utils');

let currentScript;

const { parse } = require('./parser');

class Externals {
  static getName(currentScript, type = 'script') {
    this.counters[type]++;
    return `_${currentScript}_${capitalize(type)}_${this.counters[type]}`;
  }

  constructor() {
    this.list = [];
  }

  add(content) {
    this.list.push(content);
  }

  format() {
    return trimOutput(this.list.flat()).join("\n");
  }
}
Externals.counters = { text: 0, script: 0 };

if (!Array.prototype.flat) {
  Array.prototype.flat = function() {
    return this.reduce((acc, val) => acc.concat(val), []);
  };
}

function trimOutput(out) {
  if (typeof out === 'string') {
    out = out.split("\n");
  } else {
    out = out.flat();
  }

  return out
    .map(l => l.trim())
    .filter(l => l);
}

function transpileBuiltin(line, number, parentLine, externals) {
  if (!BUILTINS[line.command]) {
    return;
  }

  const builtinUtils = {
    line,
    parentLine,
    command: line.command,
    parameters: line.parameters,
    children: line.children,

    currentScript,
    setCurrentScript: (script) => currentScript = script,
    
    transpile: (children) => transpile(children, line, externals),
    transpileParameter,

    addExternal: ext => externals.add(ext),
    getExternalName: (script, type) => Externals.getName(script, type),
    
    error(message) {
      throw new SyntaxError(`(line ${number}) ${message}`);
    },
  }

  return BUILTINS[line.command](builtinUtils);
}

function transpileParameter(parameter) {
  switch(parameter.type) {
    case 'string': {
      return `"${parameter.value}"`;
    }

    case 'it': {
      return 'VAR_RESULT';
    }

    default: {
      return parameter.value;
    }
  }
}

function transpileDelegated({ command, parameters, children }) {
  if (children) {
    console.warn(`Command "${command}" was passed children, but is not a builtin command. Commands delegated to pokeemerald cannot have children. They will be ignored in the final output.`)
  }

  return [
    command,
    parameters ? parameters.map(transpileParameter).join(', ') : '',
  ].join(' ');
}

function transpileLine(...args) {
  const output = transpileBuiltin(...args)
    || transpileDelegated(...args);

  return trimOutput(output);
}

function transpile(lines, parentLine = null, externals = new Externals()) {
  const mainScript = lines.map((l, i) => transpileLine(l, i, parentLine, externals))
    .flat()
    .join("\n");

  // only add in the externals when there is no parent line (we're at the top level) or they'll get mixed in everywhere when you call transpile recursively
  const externalScript = parentLine ? '' : externals.format();
  return `${mainScript}\n${externalScript}`;
}

console.log(transpile(parse(`
script MyScript
  checkplayergender
  if it is FEMALE
    hello
  else
    goodbye
`)));

module.exports = { transpile };