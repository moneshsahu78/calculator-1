import { ButtonType, CalculatorButtonConfig } from './types';

export const calculatorButtons: CalculatorButtonConfig[] = [
  { label: 'AC', type: ButtonType.SPECIAL },
  { label: '⌫', type: ButtonType.SPECIAL },
  { label: '%', type: ButtonType.SPECIAL },
  { label: '÷', type: ButtonType.OPERATOR },
  { label: '7', type: ButtonType.NUMBER },
  { label: '8', type: ButtonType.NUMBER },
  { label: '9', type: ButtonType.NUMBER },
  { label: '×', type: ButtonType.OPERATOR },
  { label: '4', type: ButtonType.NUMBER },
  { label: '5', type: ButtonType.NUMBER },
  { label: '6', type: ButtonType.NUMBER },
  { label: '−', type: ButtonType.OPERATOR },
  { label: '1', type: ButtonType.NUMBER },
  { label: '2', type: ButtonType.NUMBER },
  { label: '3', type: ButtonType.NUMBER },
  { label: '+', type: ButtonType.OPERATOR },
  { label: '0', type: ButtonType.NUMBER, gridSpan: 2 },
  { label: '.', type: ButtonType.NUMBER },
  { label: '=', type: ButtonType.EQUAL },
];