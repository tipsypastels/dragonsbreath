import BuiltinCommand from "./builtin_commands/builtin_command";
import Script, { Subscript, SubscriptType, subscriptIsChildOfLine } from "./builtin_commands/script";
import Msgbox from "./msgbox";

type Goto = 
  | { type: 'code', if: string, lines?: string }
  | { type: 'text', lines: string };

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

  addGoto(opts: Goto): this {
    if (Script.current) {
      /**
       * order matters here - if you get the name before yielding, all children that use subscripts will also have the same numeric subscript id, because we're fetching the name first and only pushing the line on after. so always yield before getting the name
       */
      const yieldedLines = (opts.lines || this.command.yield())
      .split('\n');

      const subscriptName = Script.current
        .getSubscriptName(opts.type);

      let lineName;
      switch(opts.type) {
        case 'code': {
          lineName = `goto_if_${opts.if} ${subscriptName}`;
          break;
        };
        case 'text': {
          lineName = `msgbox ${subscriptName}, ${Msgbox.current}`;
          break;
        };
        // TODO support applymovement
      }

      this.addLine(lineName);
      
      Script.current.subscripts.push({
        name: subscriptName,
        type: opts.type,
        texts: yieldedLines,
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