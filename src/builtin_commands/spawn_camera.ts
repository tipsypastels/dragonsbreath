import BuiltinCommand from "./builtin_command";

export default class SpawnCamera extends BuiltinCommand {
  render() {
    this.output
      .addLine('special SpawnCameraObject')
      .yield()
      .addLine('special RemoveCameraObject');
  }
}