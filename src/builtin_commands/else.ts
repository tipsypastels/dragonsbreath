import BuiltinCommand from "./builtin_command";

export default class Else extends BuiltinCommand {
  render() {
    return this.yield();
  }
}