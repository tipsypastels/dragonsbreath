import BuiltinCommand from "./builtin_command";

export default class ShowPortrait extends BuiltinCommand {
  render() {
    if (this.children) {
      this.output
        .addLine(this.delegate())
        .yield()
        .addLine('hideportrait');
    } else {
      return this.delegate();
    }
  }
}