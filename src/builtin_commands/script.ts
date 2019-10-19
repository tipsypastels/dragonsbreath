import BuiltinCommand from "./builtin_command";
import Transpiler from "../transpiler";
import Line, { lineIsDescendant } from "../line";
import { capitalize } from "../utils";

export const DRAGONSBREATH_SCRIPT_MAGIC_COMMENT = 'Dbr-output';

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
      .addLine(`${this.parameters[0].value}:: @ ${DRAGONSBREATH_SCRIPT_MAGIC_COMMENT}`)
      .yield()
      .addLineIf(this.children[this.children.length - 1].command !== 'return', 'end');

    this.subscripts.forEach(subscript => {
      const shouldAddEndAfter =
        subscript.type === 'code'
          && !subscript.texts[subscript.texts.length - 1].match(/^\s*return\s*$/);

      this.output
        .addLine(`${subscript.name}:${subscript.type === 'code' ? ':' : ''} @ ${DRAGONSBREATH_SCRIPT_MAGIC_COMMENT}`)
        .addLine(...subscript.texts)
        .addLineIf(shouldAddEndAfter, 'end')
        .addLineIf(subscript.type === 'movement', 'step_end')
    }); 
  }

  getSubscriptName(type: SubscriptType): string {
    return `_${this.name}_Subscript_${capitalize(type)}_${this.subscripts.length}`;
  }
}