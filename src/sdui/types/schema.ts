export type ActionType = 
  | 'NAVIGATE'
  | 'OPEN_BOTTOM_SHEET'
  | 'API_CALL'
  | 'UPDATE_STATE'
  | 'TOGGLE_SELECTION';

export interface ActionDefinition {
  type: ActionType;
  payload?: {
    screen?: string;
    params?: Record<string, any>;
    title?: string;
    content?: string;
    key?: string;
    value?: any;
    url?: string;
    method?: string;
    [key: string]: any;
  };
}

export interface SDUINodeStyle {
  margin?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  padding?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  flex?: number;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  height?: number | string;
  width?: number | string;
  elevation?: number;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
  shadowOffset?: { width: number; height: number };
  [key: string]: any;
}

export interface SDUINode {
  id?: string;
  type: string;
  props?: Record<string, any>;
  style?: SDUINodeStyle;
  action?: ActionDefinition;
  actions?: ActionDefinition[];
  children?: SDUINode[];
  condition?: {
    stateKey: string;
    equals?: any;
    notEquals?: any;
  };
}

export interface SDUIPageSchema {
  version: string;
  minSupportedClientVersion?: string;
  pageId: string;
  title?: string;
  meta?: {
    author?: string;
    updatedAt?: string;
    experimentGroup?: string;
  };
  initialState?: Record<string, any>;
  page: SDUINode[];
}
