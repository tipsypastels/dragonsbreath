import BuiltinCommand from "./builtin_command";

export default class GiveMon extends BuiltinCommand {
  render() {
    this.assertParams(
      'constant', 
      'number', 
      { optional: 'constant' },
      { optional: 'constant' },
      { optional: 'constant' },
      { optional: 'number' },
    );

    let [species, level, item, unk1, unk2, unk3] = this.parameters;
    
    let outputParams = [
      this.param(species),
      this.param(level),
      item ? this.param(item) : 'ITEM_NONE',
      unk1 ? this.param(unk1) : '0x0',
      unk2 ? this.param(unk2) : '0x0',
      unk3 ? this.param(unk3) : '0',
    ].join(', ');

    this.output.addLine(`givemon ${outputParams}`);
  }
}