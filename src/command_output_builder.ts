import BuiltinCommand from "./builtin_commands/builtin_command";
import Script, { Subscript, SubscriptType, subscriptIsChildOfLine } from "./builtin_commands/script";

export default class CommandOutputBuilder {
  result: string[];

  constructor(private command: BuiltinCommand) {
    this.result = [];
  }

  addLine(...lines: string[]): this {
    this.result.push(...lines);
    return this;
  }

  addLineIf(condition: any, ...lines: string[]): this {
    if (condition) {
      this.addLine(...lines);
    }
    return this;
  }

  addGotoYield(opts: { type: SubscriptType, if: string }): this {
    if (Script.current) {
      const subscriptName = Script.current
        .getSubscriptName(opts.type);

      // TODO need to support msgbox and applymovement here
      this.addLine(`goto_if_${opts.if} ${subscriptName}`);
      
      Script.current.subscripts.push({
        name: subscriptName,
        type: opts.type,
        texts: this.command.yield().split('\n'),
        sourceLine: this.command.line,
        sourceParentLine: this.command.parentLine,
      }); 
    }

    return this;
  }

  eachSubscript(callback: (subscript: Subscript) => void, { type }: { type?: SubscriptType } = {}): this {
    if (Script.current) {
      Script.current.subscripts.forEach(subscript => {
        if (type && subscript.type !== type) {
          return;
        }

        if (!subscriptIsChildOfLine(subscript, this.command.line)) {
          return;
        }
  
        callback(subscript);
      });
    }
    
    return this;
  }

  yield(): this {
    this.result.push(this.command.yield());
    return this;
  }

  toString() {
    return this.result.join('\n');
  }
}