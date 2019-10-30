import BuiltinCommand from "./builtin_command";

export default class Option extends BuiltinCommand {
  render() {
    this.assertChildren();

    if (!this.parentLine || this.parentLine.command !== 'choose_randomly') {
      this.error('The option command must always be a direct child of the choose_randomly command');
    }

    return this.yield();
  }
}