export interface DeviceInfoT {
  brandName?: string;
  deviceName?: string;
  appId: string;
  manufacturer?: string;
  modelName?: string;
  version: string;
  ipAddress?: string;
  uid?: string;
}
export interface ScreenT {
  width: number;
  height: number;
}
export interface ConnectionT {
  state: 'connected' | 'disconnected';
  type: 'wifi' | 'wired' | undefined;
  ssid?: string;
  displayName?: string;
  ipAddress?: string;
  onInternet?: boolean;
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
}