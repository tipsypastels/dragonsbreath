import If from "./if";
import Line from "../line";
import Transpiler from "../transpiler";

export default class When extends If {
  constructor(line: Line, parentLine: Line, transpiler: Transpiler) {
    super({
      ...line,
      parameters: [{
        type: 'eq',
        value: {
          left: { type: 'it', value: 'it' },
          right: line.parameters[0],
        }
      }]
    }, parentLine, transpiler);
  }
}