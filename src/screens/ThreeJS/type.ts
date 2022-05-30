export const TRANSLATION_COEFF = 300;
export const ROTATION_COEFF = 8;
export const SCALE_COEFF = 10000000;

interface I_initialState {
  name: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

export enum actionType {
  TRANSLATE = "translate",
  HIDE = "hide",
  FIXED = "fixed",
  NOACTION = "noAction",
  TEXT = "text",
  COLOR = "color",
  ROTATE = "rotate",
  TRANSLATE_AND_ROTATE = "translateAndRotate",
  SCALE = "scale",
  BREAK = "break",
}

export interface Action {
  current: boolean;
  name: string;
  itemList: string[];
  argList: string[];
  isBlocker: boolean;
  type: string;
}

export interface Animation {
  current: boolean;
  name: string;
  type: string;
  time: string;
  refItemId: string;
  isBlocker: string;
  optionHidden: string;
  uid: string;
  argList: string[];
  itemList: string[];
  executed: any;
  startDate: number | undefined;
  end: boolean;
  lastExecuted: any;
  dateExecuted: any;
  position: any;
  initialPositionRotation: any;
  savedtransparent: number;
  savedopacity: number;
  objectA: any;
  objectB: any;
}
