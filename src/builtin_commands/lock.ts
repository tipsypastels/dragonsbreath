import BuiltinCommand from "./builtin_command";

export default class Lock extends BuiltinCommand {
  render() {
    if (this.children) {
      return this.output
        .addLine(this.startingKword)
        .yield()
        .eachSubscript(
          s => s.texts.push(this.endingKword), { type: 'code' }
        )
        .addLine(this.endingKword);
    } else {
      return this.startingKword;
    }
  }

  get startingKword() {
    return 'lock';
  }

  get endingKword() {
    return 'release';
  }
}