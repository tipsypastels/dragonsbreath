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

  const strComma = `${Math.random()}___StrComma___`;

  line = line.replace(/^\s*/, '');
  const command = line.split(' ')[0];
  const parameters = line
    .slice(command.length + 1)
    // we don't want to break the quotes inside strings
    .replace(/"(.+?),(.+?)"/, (_, p1, p2) => `"${p1}${strComma}${p2}"`)
    .split(/\s*,\s*/)
    .map(word => word.replace(strComma, ','))
    .map(parseExpression)
    .filter(expr => expr);

  const lineData = { command };
  if (parameters && parameters.length) {
    lineData['parameters'] = parameters;
  }

  memory.push(number, lineData, indent);
  return lineData;
}

function parseExpression(expr) {
  expr = expr.trim();

  if (!expr) {
    return;
  }

  let match;

  function matching(regex) {
    match = regex.exec(expr);
    return !!match;
  }

  function comparison(...symbols) {
    return new RegExp(`^(.*)\s*(?:${symbols.join('|')})\s*(.*)$`);
  }

  function comparisonResult(type) {
    return { type, 
      left: parseExpression(match[1]), 
      right: parseExpression(match[2]), 
    };
  }
  
  switch(true) {
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
      return comparisonResult('equality');
    }

    case matching(comparison('!=', '!==', 'isnt', 'neq')): {
      return comparisonResult('inequality');
    }

    case matching(comparison('<', 'lt')): {
      return comparisonResult('lessThan');
    }

    case matching(comparison('>', 'gt')): {
      return comparisonResult('greaterThan');
    }

    case matching(comparison('<=', 'le')): {
      return comparisonResult('lessThanOrEq');
    }

    case matching(comparison('>=', 'ge')): {
      return comparisonResult('greaterThanOrEq');
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