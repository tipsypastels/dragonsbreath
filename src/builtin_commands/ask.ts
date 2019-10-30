import Say from "./say";

export default class Ask extends Say {
  render() {
    this.assertParams('string');
    this.parameters.push({ type: 'constant', value: 'MSGBOX_YESNO' });
    return super.render();
  }
}