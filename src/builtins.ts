import Transpiler from "./transpiler";
import Line, { Parameter } from "./line";
import ScriptBuilder from "./script_builder";
import SubscriptCollection from "./subscript_collection";

type CommandResult = ScriptBuilder | string;

export default class Builtins {
  private build: ScriptBuilder;

  constructor(
    private line: Line,
    private parentLine: Line,
    private transpiler: Transpiler,
    private subscripts?: SubscriptCollection,
  ) {
    this.build = new ScriptBuilder(this);
  }

  get command(): string {
    return this.line.command;
  }

  get parameters(): Parameter[] {
    return this.line.parameters;
  }

  get children(): Line[] {
    return this.line.children;
  }

  yield(subscripts?: SubscriptCollection) {
    return this.transpiler.transpile(this.line.children, this.line, subscripts);
  }

  delegate() {
    return this.transpiler.formatLineAsDelegated(this.line);
  }

  error(message: string) {
    this.transpiler.error(message);
  }

  COMMAND_lock(): CommandResult {
    if (this.children) {
      return this.build
        .addLine('lock')
        .yield()
        .addLineInSelfAndExternals('release');
    } else {
      return this.delegate();
    }
  }

  COMMAND_script(): CommandResult {
    if (!this.children) {
      this.error('Cannot have an empty script');
    }

    if (!this.parameters || this.parameters.length !== 1) {
      this.error('Script commands must have exactly one parameter');
    }

    if (this.parameters[0].type !== 'token') {
      this.error(`The script name must be a token (received ${this.parameters[0].type})`);
    }

    const subscripts = new SubscriptCollection(this.line);

    return this.build
      .addLine(`${this.parameters[0].value}::`)
      .yield(subscripts)
      .addLine('end');
  }
}