export enum ButtonType {
  NUMBER,
  OPERATOR,
  SPECIAL,
  EQUAL,
}

export interface CalculatorButtonConfig {
  label: string;
  type: ButtonType;
  gridSpan?: number;
}

export interface ThemeVariables {
  '--special-color': string;
  '--operator-color': string;
  '--number-color': string;
  '--equal-bg': string;
  '--equal-bg-hover': string;
  '--equal-bg-active': string;
  '--equal-color': string;
  '--text-color-display': string;
  '--text-color-display-secondary': string;
  '--history-clear-color': string;
  '--history-clear-color-hover': string;
}

export interface Theme {
  id: string;
  name: string;
  background: string;
  variables: ThemeVariables;
}
