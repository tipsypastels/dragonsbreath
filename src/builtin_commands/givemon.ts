import BuiltinCommand from "./builtin_command";

export default class GiveMon extends BuiltinCommand {
  render() {
    this.assertParams(
      'constant', 
      'number', 
      { optional: 'constant' },
    );

    let [species, level, item] = this.parameters;
    
    let outputParams = [
      this.param(species),
      this.param(level),
      item ? this.param(item) : 'ITEM_NONE',
    ].join(', ');

    this.output.addLine(`givemon ${outputParams}`);
  }
}