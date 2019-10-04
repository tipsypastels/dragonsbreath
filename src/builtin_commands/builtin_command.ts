import Line, { Parameter } from "../line";
import Transpiler from "../transpiler";
import CommandOutputBuilder from "../command_output_builder";

export type CommandResult = { toString(): string };

type ParamAssertionType =
  | string
  | string[]
  | { optional: string | string[] }

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

  assertParams(...types: ParamAssertionType[]) {
    let { command, parameters } = this;
    parameters || (parameters = []);

    let requiredTypes = types.filter(t => {
      return typeof t === 'string' || Array.isArray(t);
    });

    let rangeStr = requiredTypes.length === types.length
      ? requiredTypes.length
      : `${requiredTypes.length}..${types.length}`;

    if (parameters.length < requiredTypes.length) {
      this.error(`${command} requires ${rangeStr} parameters, got ${parameters.length}`);
    }

    if (parameters.length > types.length) {
      this.error(`${command} requires ${rangeStr} parameters, got ${parameters.length}`);
    }

    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      let param = parameters[i];
      let valid;

      if (typeof type === 'string') {
        valid = type === param.type;
      } else if (Array.isArray(type)) {
        valid = type.includes(param.type);
      } else if (typeof type.optional === 'string') {
        valid = !param || type.optional === param.type;
      } else {
        valid = !param || type.optional.includes(param.type);
      }

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