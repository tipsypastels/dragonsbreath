import BuiltinCommand from "./builtin_command";

export default class ___Bundle___ extends BuiltinCommand {
  render() {
    switch(this.line.bundlingGroup) {
      case 0: {
        return this.output
          .addGoto({ 
            type: 'text', 
            lines: this.children.map(c => {
              return `.string ${this.param(c.parameters[0])}`
            }).join('\n'),
          });
      };
      default: {
        throw new TypeError(`Unknown bundling group ${this.line.bundlingGroup}`);
      }
    }
  }
}