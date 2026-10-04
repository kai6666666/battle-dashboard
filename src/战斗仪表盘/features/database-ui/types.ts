/**
 * database-ui 公共类型。
 */
export interface ThemeColors {
  bgNav: string;
  bgPanel: string;
  border: string;
  textMain: string;
  textSub: string;
  btnBg: string;
  btnHover: string;
  btnActiveBg: string;
  btnActiveText: string;
  accent: string;
  inputBg: string;
}

export type DatabaseThemeMap = Record<string, ThemeColors>;

export interface DatabaseStyleOptions {
  enabled?: boolean;
}

export interface DatabaseCssParams {
  S_POPUP: string;
  S_MAIN: string;
  S_VIS: string;
  S_ALL_WINDOWS: string;
  S_POPUP_MAIN: string;
  t: ThemeColors;
  stepperSpinFilter: string;
  stepperSpinOpacity: string;
  stepperColorScheme: string;
}
