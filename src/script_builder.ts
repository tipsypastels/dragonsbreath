import Builtins from "./builtins";
import SubscriptCollection from "./subscript_collection";

export default class ScriptBuilder {
  result: string[];

  constructor(private builtins: Builtins) {
    this.result = [];
  }

  addLine(text: string): this {
    this.result.push(text);
    return this;
  }

  addLineInSelfAndExternals(text: string): this {
    this.addLine(text);
    // TODO add an external line
    return this;
  }

  yield(subscripts?: SubscriptCollection): this {
    this.result.push(this.builtins.yield(subscripts))
    return this;
  }

  toString(): string {
    return this.result.join('\n');
  }
}