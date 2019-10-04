import Line, { Parameter } from "../line";
import Transpiler from "../transpiler";
import CommandOutputBuilder from "../command_output_builder";

export type CommandResult = { toString(): string };

export default abstract class BuiltinCommand {
  protected output: CommandOutputBuilder;
  
  constructor(
    public line: Line,
    public parentLine: Line,
    protected transpiler: Transpiler,
  ) {
    this.output = new CommandOutputBuilder(this);
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

  yield(): string {
    return this.transpiler.transpile(this.line.children, this.line);
  }

  delegate(): string {
    return this.transpiler.formatLineAsDelegated(this.line);
  }

  error(message: string) {
    this.transpiler.error(message);
  }

  param(param: Parameter) {
    return this.transpiler.transpileParameter(param);
  }

  assertParams(...types: (string | string[])[]) {
    let { command, parameters } = this;
    parameters || (parameters = []);

    if (parameters.length !== types.length) {
      this.error(`${command} requires ${types.length} parameters, got ${parameters.length}`);
    }

    for (let i = 0; i < types.length; i++) {
      const valid = Array.isArray(types[i])
        ? types[i].includes(parameters[i].type)
        : types[i] === parameters[i].type;

      if (!valid) {
        this.error(`Parameter ${i + 1} of ${command} must be ${types[i]}, got ${parameters[i].type}`);
      }
    }

    return this;
  }

  assertChildren() {
    if (!this.children) {
      this.error(`Cannot have an empty ${this.command}`);
    }

    return this;
  }

  callRender(): string {
    return (this.render() || this.output).toString();
  }

  abstract render(): CommandResult | void;
}