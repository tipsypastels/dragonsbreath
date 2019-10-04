import BuiltinCommand from "./builtin_command";

export default class End extends BuiltinCommand {
  render() {
    throw new SyntaxError('Do not use the end command in Dragonsbreath - scripts are delimited by whitespace. End is automatically added to the final output');
  }
}