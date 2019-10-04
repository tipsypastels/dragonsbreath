import BuiltinCommand from "./builtin_command";
import Msgbox from "../msgbox";

export default class UsingMsgbox extends BuiltinCommand {
  render() {
    this.assertChildren()
        .assertParams('constant');

    Msgbox.current = this.parameters[0].value as string;
    return this.yield();
  }
}