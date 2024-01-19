export interface DeviceInfoT {
  brandName?: string;
  deviceName?: string;
  appId: string;
  manufacturer?: string;
  modelName?: string;
  version: string;
  uid?: string;
}
export interface ScreenT {
  width: number;
  height: number;
}
export interface ConnectionT {
  state?: NetworkStatus;
  type?: NetworkType;
  displayName?: string;
  ipAddress?: string;
  ipMac?: string;
}
export interface IUtilNative {
  getInstance?: () => IUtilNative;
  baseInfo: any;
  getBaseInfo: () => Promise<any>;
  onEvent: (event: ListenerEvent, callback: (e: any) => void) => void;
}
export const EventList = {
  LOADED_INFO: 'LOADED_INFO',
};
export enum ListenerEvent {
  NETWORK_CHANGE = 'NETWORK_CHANGE',
  MOUSE_ENABLE = 'MOUSE_ENABLE',
  STATUS_KEYBOARD_CHANGE = 'STATUS_KEYBOARD_CHANGE',
}
export enum NetworkStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
}
export enum NetworkType {
  WIFI= 'wifi',
  ETHERNET = 'ethernet',
  UNIDENTIFIED = 'Unidentified'
}
export type BaseInfoT = {
  deviceInfo?: DeviceInfoT;
  screen?: ScreenT;
  connectionStatus?: ConnectionT;
  keyboard?: {
    isKeyboardShow: boolean;
  };
  locale?: string;
  cursor?: {
    isCursorShow: boolean;
  }
}