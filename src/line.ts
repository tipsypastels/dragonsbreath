export interface Parameter {
  type: string;
  value: string | number | { left: Parameter, right: Parameter };
}

export default interface Line {
  command: string;
  parameters?: Parameter[];
  children?: Line[];
  bundlingGroup?: number;
}