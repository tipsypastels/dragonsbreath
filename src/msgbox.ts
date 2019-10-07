export default class Msgbox {
  static current: string = 'MSGBOX_DEFAULT';

  static change(value: string, callback: () => void)  {
    try {
      if (value) {
        this.current = value;
      }
      callback();
    } finally {
      this.current = 'MSGBOX_DEFAULT';
    }
  }
}