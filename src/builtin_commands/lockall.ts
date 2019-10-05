import Lock from "./lock";

export default class LockAll extends Lock {
  get startingKword() {
    return 'lockall';
  }

  get endingKword() {
    return 'releaseall';
  }
}