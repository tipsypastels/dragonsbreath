import BuiltinCommand from "./builtin_command";
import Msgbox from "../msgbox";

export default class Say extends BuiltinCommand {
  render() {
    this.assertParams('string', { optional: 'constant' });
    const [text, msgbox] = this.parameters;

    if (msgbox) {
      Msgbox.current = msgbox.value as string;
    }

    this.output.addGoto({ 
      type: 'text', 
      lines: `.string ${this.param(text)}`
    });
  }
}