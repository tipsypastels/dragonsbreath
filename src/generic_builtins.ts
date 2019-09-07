import { Line, Parameter } from "./parser";
import Transpiler from "./transpiler";

export default abstract class GenericBuiltins {
  constructor(
    private line: Line,
    private parentLine: Line,
    private transpiler: Transpiler,
  ) {}

  get command(): string {
    return this.line.command;
  }

  get parameters(): Parameter[] {
    return this.line.parameters;
  }

  get children(): Line[] {
    return this.line.children;
  }

  error(message: string) {
    this.transpiler.error(message);
  }
}