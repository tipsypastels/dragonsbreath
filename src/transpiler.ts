import Line, { Parameter } from "./line";
import BUILTIN_COMMAND_DICT from "./builtin_commands/dictionary";
import stringSubstitutions from "./string_substitutions";

export default class Transpiler {
  transpile(lines: Line[], parentLine?: Line): string {
    return lines.map(
      (l, i) => this.transpileLine(i, l, parentLine)
    ).join('\n')./* yes this is intended*/split('\n').map(l => {
      if (l.match(/^[A-z0-9_]+::?/)) {
        return l.trim();
      }
      return `  ${l.trim()}`;
    }).join('\n');
  }

  error(message: string) {
    throw new SyntaxError(message);
  }

  // public because the transpiler can call it
  formatLineAsDelegated(line: Line): string {
    let string = line.command;

    if (line.parameters) {
      string += ` ${line.parameters.map(this.transpileParameter).join(', ')}`
    }

    return string;
  }

  transpileLine(lineNo: number, line: Line, parentLine?: Line): string {
    const method = line.command;

    if (method in BUILTIN_COMMAND_DICT) {
      return new BUILTIN_COMMAND_DICT[method](line, parentLine, this)
        .callRender();
    } else {
      return this.formatLineAsDelegated(line);
    }
  }

  transpileParameter(parameter: Parameter): string {
    switch(parameter.type) {
      case 'string': {
        return stringSubstitutions(`"${parameter.value}"`);
      }

      case 'it': {
        return 'VAR_RESULT';
      } 

      default: {
        return parameter.value.toString();
      }
    }
  }
}