import BuiltinCommand from "./builtin_command";
import Transpiler from "../transpiler";
import Line, { lineIsDescendant } from "../line";
import { capitalize } from "../utils";

export type SubscriptType = 'code' | 'text' | 'movement';

export interface Subscript {
  name: string;
  type: SubscriptType;
  texts: string[];
  sourceLine: Line;
  sourceParentLine: Line;
}

/**
 * Does a subscript belong to a given line or any of its children
 */
export function subscriptIsChildOfLine(subscript: Subscript, line: Line): boolean {
  return lineIsDescendant(subscript.sourceLine, line);
}

export default class Script extends BuiltinCommand {
  static current: Script;

  subscripts: Subscript[];

  constructor(
    line: Line,
    parentLine: Line,
    transpiler: Transpiler,
  ) {
    super(line, parentLine, transpiler);
    this.subscripts = [];

    Script.current = this;
  }

  get name(): string {
    return this.param(this.parameters[0]);
  }

  render() {
    this.assertChildren()
        .assertParams('token');

    this.output
      .addLine(`${this.parameters[0].value}::`)
      .yield()
      .addLine('end');

    this.subscripts.forEach(subscript => {
      this.output
        .addLine('\n')
        .addLine(`${subscript.name}:${subscript.type === 'code' ? ':' : ''}`)
        .addLine(...subscript.texts)
        .addLineIf(subscript.type === 'code', 'end')
        .addLineIf(subscript.type === 'movement', 'step_end')
        .addLine('\n');
    }); 
  }

  getSubscriptName(type: SubscriptType): string {
    return `_${this.name}_Subscript_${capitalize(type)}_${this.subscripts.length}`;
  }
}