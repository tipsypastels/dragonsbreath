import Line from "./line";

export type SubscriptType = 'script' | 'text' | 'movement';

export interface Subscript {
  type: SubscriptType;
  texts: string[];
}

export default class SubscriptCollection {
  subscripts: { [key: string]: Subscript }
  counter: number;

  constructor(private scriptLine: Line) {
    this.subscripts = {};
    this.counter = 0;
  }

  get mainScriptName() {
    return this.scriptLine.parameters[0].value;
  }

  add(subscript: Subscript): this {
    this.subscripts[this.generateName(subscript)] = subscript;
    return this;
  }

  private generateName(subscript: Subscript): string {
    const text = `_${this.mainScriptName}_${subscript.type.toUpperCase()}_${this.counter}`;
    this.counter++;
    return text;
  }
}