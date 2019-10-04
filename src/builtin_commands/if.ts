import BuiltinCommand from "./builtin_command";

export default class If extends BuiltinCommand {
  render() {
    this.assertChildren()
        .assertParams(['eq', 'ge', 'gt', 'le', 'lt']);

    const condition = this.parameters[0];

    // make typescript happy
    if (typeof condition.value !== 'object') {
      return;
    }

    const { left, right } = condition.value;

    if (left.type === 'token') {
      this.output
        .addLine(this.param(left))
        .addLine(`compare VAR_RESULT, ${this.param(right)}`);
    } else {
      this.output
        .addLine(`compare ${this.param(left)}, ${this.param(right)}`);
    }

    this.output.addGoto({ type: 'code', if: condition.type });
  }
}