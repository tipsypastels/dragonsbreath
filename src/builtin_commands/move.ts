import BuiltinCommand from "./builtin_command";
import MiscMovementCommand from "./misc_movement_command";

export default class Move extends BuiltinCommand {
  render() {
    return this.output.addGoto({ type: 'movement', eventId: this.eventId });
  }

  get eventId() {
    this.assertChildren()
      .assertParams(['number', 'constant', 'token']);

  if (this.children.some(c => MiscMovementCommand.all.indexOf(c.command) === -1)) {
    this.error('All children of the move command must be movement commands. You cannot use regular commands as children of move.');
  }

  let [id] = this.parameters;

    if (id.type === 'token') {
      switch(id.value) {
        case 'player': {
          id = { type: 'constant', value: 'EVENT_OBJ_ID_PLAYER' };
          break;
        }

        case 'camera': {
          id = { type: 'constant', value: 'EVENT_OBJ_ID_CAMERA' };
          break;
        }

        default: {
          throw new SyntaxError('The parameter to the move command must be a number, a constant, or the token player');
        }
      }
    }

    return this.param(id);
  }
}