import BuiltinCommand from "./builtin_command";

export default class Lock extends BuiltinCommand {
  render() {
    if (this.children) {
      return this.output
        .addLine('lock')
        .yield()
        .eachSubscript(
          s => s.texts.push('release'), { type: 'code' }
        )
        .addLine('release');
    } else {
      return 'lock';
    }
  }
}