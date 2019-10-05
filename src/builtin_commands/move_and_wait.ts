import Move from "./move";

export default class MoveAndWait extends Move {
  render() {
    const { eventId } = this;

    return this.output
      .addGoto({ type: 'movement', eventId })
      .addLine(`waitmovement ${eventId}`);
  }
}