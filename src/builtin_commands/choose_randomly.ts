import BuiltinCommand from "./builtin_command";

export default class ChooseRandomly extends BuiltinCommand {
  render() {
    this.assertChildren();

    this.output
      .addLine(`random ${this.children.length}`)
      .addLine('switch VAR_RESULT')
      .yieldEachLine((result, idx, b) => {
        b.addGoto({
          idx,
          type: 'code',
          style: 'switch',
          lines: result,
        });
      });
  }
}