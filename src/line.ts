interface ParameterBasics { type: string }
interface ParameterStandard extends ParameterBasics {
  value: string | number;
}
interface ParameterConditional extends ParameterBasics {
  left: Parameter;
  right: Parameter;
}
export type Parameter = ParameterStandard | ParameterConditional;

export default interface Line {
  type: 'command' | 'bundle';
  command: string;
  parameters?: Parameter[];
  children?: Line[];
  bundlingGroup?: number;
}