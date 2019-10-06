import BuiltinCommand from "./builtin_command";

export default class ChooseRandomly extends BuiltinCommand {
  render() {
    this.assertChildren();

    if (this.children.some(c => c.command !== 'option')) {
      this.error(`All the direct children of the choose_randomly command must be the option command`);
    }

    this.output
      .addLine(`random ${this.children.length}`)
      .addLine('switch VAR_RESULT')
      .yield();
  }
}