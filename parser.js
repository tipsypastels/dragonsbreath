const INDENT = '  ';

class Memory {
  constructor() {
    this.lines = [];
    this.chain = [];
  }

  push(number, line, indent) {
    if (indent < 1) {
      this.lines.push(line);
    } else {
      // find the last item in the chain whose indent is one less than this one and add it as a child
      const parentLine = this.chain.reverse().find(chainItem => {
        return indent === chainItem.indent + 1;
      });

      if (!parentLine) {
        throw new SyntaxError(`Unexpected indent on line ${number}`);
      }

      parentLine.line.children || (parentLine.line.children = []);
      parentLine.line.children.push(line);
    }

    this.chain.push({ number, line, indent });
  }

  get length() {
    return this.lines.length;
  }
}

function getIndentDepth(line) {
  return /^(\s*)/.exec(line)[0]
    .length / INDENT.length;
}

function parseLine(number, line, memory) {
  if (line.length === 0 || /^[^\S]\n?$/.exec(line)) {
    return;
  }

  const indent = getIndentDepth(line);

  line = line.replace(/^\s*/, '');
  const command = line.split(' ')[0];
  const parameters = line
    .slice(command.length + 1)
    .split(/\s*,\s*/)
    .map(parseExpression)
    .filter(expr => expr);

  const lineData = { command };
  if (parameters && parameters.length) {
    lineData['parameters'] = parameters;
  }

  memory.push(number, lineData, indent);
}

function parseExpression(expr) {
  expr = expr.trim();

  if (!expr) {
    return;
  }
  
  let match;

  function type(regex) {
    match = regex.exec(expr);
    return !!match;
  }
  
  switch(true) {
    case type(/^(\d*\.?\d*)$/): {
      return { type: 'number', value: Number(match[0]) };
    }

    case type(/^"(.*)"$/): {
      return { type: 'string', value: expr.slice(1, expr.length - 1) };
    }

    case type(/^[a-z0-9]+$/i): {
      return { type: 'token', value: expr };
    }

    case type(/^(.*)\s*(?:==|is|eq)\s*(.*)$/): {
      return { 
        type: 'equality', 
        left: parseExpression(match[1]),
        right: parseExpression(match[2])
      };
    }

    default: {
      throw new SyntaxError(`Could not parse expression ${expr}`);
    }
  }
}

function parse(program) {
  const lines = program.split(/\n/);
  const memory = new Memory();

  for (let i = 0; i < lines.length; i++) {
    parseLine(i, lines[i], memory);
  }

  return memory.lines;
}

module.exports = { parse, parseLine, parseExpression };