import BuiltinCommand from "./builtin_command";

export default class End extends BuiltinCommand {
  render() {
    this.error(`Do not use the ${this.command} command in Dragonsbreath - scripts are delimited by whitespace. ${this.command} is automatically added to the final output`);
  }
}