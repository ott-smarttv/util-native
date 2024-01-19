import { BaseInfoT, ConnectionT, DeviceInfoT, NetworkStatus, NetworkType } from "../type";
import {
  API_TIZEN,
  NetworkConnectionType,
} from "./constant.tizen";
import { ITizen } from "./type.tizen";

declare global {
  interface Window {
    tizen: ITizen;
    webapis: any;
  }
}
const formatDeviceInfo = async () => {
  const manufacturer = await window.tizen.systeminfo.getCapability(
    API_TIZEN.MANUFACTURER.base
  );
  const modelName = await window.tizen.systeminfo.getCapability(
    API_TIZEN.DEVICE_ID.base
  );
  const rawDataInfo: DeviceInfoT = {
    appId: await window.tizen.application.getCurrentApplication().appInfo.id,
    version: await window.tizen.systeminfo.getCapability(
      API_TIZEN.TIZEN_PLATFORM_VER.base
    ),
    uid: await window.webapis.appcommon.getUuid(),
    manufacturer,
    modelName,
    deviceName: await window.webapis.network.getTVName(),
    brandName: manufacturer,
  };
  console.log("rawDataInfo", rawDataInfo);
  return rawDataInfo;
};
const formatConnectionInfo = async () => {
  const activeConnectionType =
    await window.webapis.network.getActiveConnectionType();
  if (activeConnectionType === 1) {
    const connectionStatus: ConnectionT = {
      state:
        activeConnectionType === 0
          ? NetworkStatus.DISCONNECTED
          : NetworkStatus.CONNECTED,
      displayName: await window.webapis.network.getWiFiSsid(),
      ipAddress: await window.webapis.network.getIp(),
      type:
        (NetworkConnectionType as any)?.[activeConnectionType]?.name ||
        NetworkType.UNIDENTIFIED,
      ipMac: await window.webapis.network.getMac(),
    };
    return connectionStatus;
  }
  if (activeConnectionType === 3) {
    const connectionStatus: ConnectionT = {
      state:
        activeConnectionType === 0
          ? NetworkStatus.DISCONNECTED
          : NetworkStatus.CONNECTED,
      ipAddress: await window.webapis.network.getIp(),
      type:
        (NetworkConnectionType as any)?.[activeConnectionType]?.name ||
        NetworkType.UNIDENTIFIED,
      ipMac: await window.webapis.network.getMac(),
    };
    return connectionStatus;
  }
  return {
    state: NetworkStatus.DISCONNECTED,
    ipAddress: "0.0.0.0",
    type: NetworkType.UNIDENTIFIED,
  } as ConnectionT;
};
const getScreen = async () => {
  let display: any= null
  await new Promise((resolve) => {
    window.tizen.systeminfo.getPropertyValue(
      'DISPLAY',
      (res) => {
        display = res
        resolve('success');
      },
      (err) => {
        console.error(err);
        resolve(null);
      }
    );
  })
  return {
    width: display.resolutionWidth,
    height: display.resolutionHeight,
  }
}
export function registerNetworkStateChangeListener(
  callback: (value: any) => void
) {
  window.webapis.network.addNetworkStateChangeListener(async (value: any) => {
    if (value === 5) {
      callback({
        state: NetworkStatus.DISCONNECTED,
        ipAddress: "0.0.0.0",
        type: NetworkType.UNIDENTIFIED,
      })
    }
    const connectionStatus = await formatConnectionInfo();
    callback(connectionStatus);
  });
}
export function removeNetworkStateChangeListener() {
  window.webapis.network.removeNetworkStateChangeListener();
}
const getCommonPlatformData = async () => {
  const deviceInfo = await formatDeviceInfo();
  const connectionStatus = await formatConnectionInfo();
  return {
    deviceInfo,
    connectionStatus,
    screen: await getScreen(),
  } as BaseInfoT;
};
const CommonTizen = {
  getCommonPlatformData,
  registerNetworkStateChangeListener,
  removeNetworkStateChangeListener,
};
export default CommonTizen;
