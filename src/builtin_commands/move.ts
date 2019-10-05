import BuiltinCommand from "./builtin_command";

export default class Move extends BuiltinCommand {
  render() {
    return this.output.addGoto({ type: 'movement', eventId: this.eventId });
  }

  get eventId() {
    this.assertChildren()
      .assertParams(['number', 'constant', 'token']);

    let [id] = this.parameters;

    if (id.type === 'token') {
      if (id.value === 'player') {
        id = { type: 'constant', value: 'EVENT_OBJ_ID_PLAYER' };
      } else {
        throw new SyntaxError('The parameter to the move command must be a number, a constant, or the token player');
      }
    }

    return this.param(id);
  }
}