import Line, { Parameter } from "./line";
import { tryBundleLines } from "./bundling_logic";

export const INDENT = '  ';

export type Chain = ({ line: Line, indent: number })[];

export class Memory {
  lines: Line[];
  chain: Chain;

  constructor() {
    this.lines = [];
    this.chain = [];
  }

  push(line: Line, indent: number) {
    let pushToChain = true;
    const lastLine = this.chain[this.chain.length - 1];

    if (lastLine && indent === lastLine.indent && tryBundleLines(lastLine.line, line)) {
      pushToChain = false;  
    } else if (indent < 1) {
      this.lines.push(line);
    } else {
      // find the last item in the chain whose indent is one less than this one and add it as a child
      const parentLine = [...this.chain].reverse().find(chainItem => {
        return indent === chainItem.indent + 1;
      });

      if (!parentLine) {
        throw new SyntaxError(`Unexpected indent on line ${line.number}`);
      }

      line.signature = parentLine.line.signature.concat(line.number);

      parentLine.line.children || (parentLine.line.children = []);
      parentLine.line.children.push(line);
    }

    if (pushToChain) {
      this.chain.push({ line, indent });
    }
  }

  get length() {
    return this.lines.length;
  }
}

function getIndentDepth(lineText: string) {
  return /^(\s*)/.exec(lineText)[0]
    .length / INDENT.length;
}

export function parseLine(lineNo: number, lineText: string, memory: Memory) {
  if (lineText.length === 0 || /^[^\S]\n?$/.exec(lineText)) {
    return;
  }

  const indent = getIndentDepth(lineText);

  const strComma = `${Math.random()}___StrComma___`;

  lineText = lineText
    .replace(/^\s*/, '')
    .replace(/\r$/, '');

  const command = lineText.split(' ')[0];
  const parameters = lineText
    .slice(command.length + 1)
    // we don't want to break the quotes inside strings
    .replace(/"(.+?),(.+?)"/, (_, p1, p2) => `"${p1}${strComma}${p2}"`)
    .split(/\s*,\s*/)
    .map(word => word.replace(strComma, ','))
    .map(parseExpression)
    .filter(expr => expr);

  const line: Line = { 
    command, 
    number: lineNo, 
    signature: [lineNo] 
  };
    
  const hasParams = parameters && parameters.length;
  hasParams && (line.parameters = parameters);

  memory.push(line, indent);
  return line;
}

export function parseExpression(expr: string): Parameter {
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
      value: {
        left: parseExpression(match[1]), 
        right: parseExpression(match[2]), 
      }
    };
  }
  
  switch(true) {
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

    case matching(/^[a-z0-9_]+$/i): {
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
      throw new SyntaxError(`Could not parse expression ${expr}`);
    }
  }
}

export default function parse(program) {
  const lines = program.split(/\n/);
  const memory = new Memory();

  for (let i = 0; i < lines.length; i++) {
    parseLine(i, lines[i], memory);
  }

  return memory.lines;
}
