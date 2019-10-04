export interface Parameter {
  type: string;
  value: string | number | { left: Parameter, right: Parameter };
}

export default interface Line {
  number: number;
  signature: number[];
  command: string;
  parameters?: Parameter[];
  children?: Line[];
  bundlingGroup?: number;
}

export function lineIsDescendant(child: Line, ancestor: Line): boolean {
  return child.signature.includes(ancestor.number);
}