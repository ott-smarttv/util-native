export interface ITizen {
  application: {
    getCurrentApplication: () => DeviceInfoTizenT;
  };
  systeminfo: {
    getVersion: () => string;
    getCapability: (capability: string) => string;
    getPropertyValue: (property: string, successCallback: (value: any) => void, errorCallback: (error: any) => void) => void;
  }
}
export interface DeviceInfoTizenT {
  appInfo: {
    id: string
  }
}
