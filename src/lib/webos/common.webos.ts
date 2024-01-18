import { ConnectionT, DeviceInfoT, ListenerEvent, ScreenT } from "../type";
import { PLATFORM_NAME } from "../utils/common";
import { getDeviceName } from "../utils/utils";
import { API_WEBOS, CURSOR_STATE } from "./constant.webos";
import { DeviceWebOST, IWebOS } from "./types.webos";
import { eventEmitterNative } from "..";

declare global {
  interface Window {
    webOS: IWebOS;
  }
}

const getDeviceInfo = async () => {
  const deviceInfo = await new Promise((resolve, reject) => {
    window.webOS.deviceInfo((device: DeviceWebOST) => {
      resolve(device);
    });
  });
  return deviceInfo;
};

const getSystemInfo = () => {
  return window.webOS.systemInfo();
};

const getSystemProperty = async () => {
  await window.webOS.service.request(API_WEBOS.SYSTEM_PROPERTY.base, {
    method: API_WEBOS.SYSTEM_PROPERTY.methods.getSystemInfo,
    parameters: {
      keys: ["modelName", "firmwareVersion", "UHD", "sdkVersion"],
    },
    onComplete: function (inResponse) {
      var isSucceeded = inResponse.returnValue;

      if (isSucceeded) {
        // To-Do something
        return inResponse;
      } else {
        console.log("Failed to get TV device information");
        // To-Do something
        return undefined;
      }
    },
  });
};

const getUid = async () => {
  let uid: any = {};

  await new Promise((resolve, reject) => {
    window.webOS.service.request("luna://com.webos.service.sm", {
      method: "deviceid/getIDs",
      parameters: { idType: ["LGUDID"] },
      onSuccess: function (result) {
        uid = result.idList[0].idValue;
        resolve("success");
      },
      onFailure: function (error) {
        console.log("Failed to get UID:", error);
        resolve('Failed');
      },
    });
  });
  return uid;
};

const getSystemTime = async () => {
  let systemTime: any = null
  new Promise((resolve, reject) => {
    window.webOS.service.request(API_WEBOS.SYSTEM_TIME.base, {
      method: API_WEBOS.SYSTEM_TIME.methods.getSystemTime,
      parameters: { subscribe: false },
      onComplete: function (inResponse) {
        var isSucceeded = inResponse.returnValue;
  
        if (isSucceeded) {
          // To-Do something
          systemTime = inResponse;
          resolve("success");
        } else {
          console.log("Failed to get TV device information");
          // To-Do something
          resolve("Failed")
        }
      },
    });
  })
  return systemTime
};

const getSystemSettings = async () => {
  const data: { countryInfo?: any; caption?: any; localeInfo?: any } = {};

  await new Promise((resolve, reject) => {
    window.webOS.service.request(API_WEBOS.SETTINGS_SERVICE.base, {
      method: API_WEBOS.SETTINGS_SERVICE.methods.getSystemSettings,
      parameters: {
        category: "option",
        keys: ["country", "smartServiceCountryCode2"],
      },
      onSuccess: function (inResponse) {
        data["countryInfo"] = inResponse;
        resolve("success");
        // To-Do something
      },
      onFailure: function (error) {
        console.log("Failed", error);
        resolve("Doned");
      },
    });
  });

  await new Promise((resolve, reject) => {
    window.webOS.service.request(API_WEBOS.SETTINGS_SERVICE.base, {
      method: API_WEBOS.SETTINGS_SERVICE.methods.getSystemSettings,
      parameters: {
        category: "caption",
        keys: ["captionEnable"],
      },
      onSuccess: function (inResponse) {
        data["caption"] = inResponse;
        resolve("success");
      },
      onFailure: function (error) {
        console.log("Failed", error);
        resolve("Doned");
      },
    });
  });

  await new Promise((resolve, reject) => {
    window.webOS.service.request(API_WEBOS.SETTINGS_SERVICE.base, {
      method: API_WEBOS.SETTINGS_SERVICE.methods.getSystemSettings,
      parameters: {
        keys: ["localeInfo"],
      },
      onSuccess: function (inResponse) {
        data["localeInfo"] = inResponse;
        resolve("success");
      },
      onFailure: function (error) {
        console.log("Failed", error);
        resolve("Doned");
      },
    });
  });

  return data;
};

const getConnectionStatus = async () => {
  let connectionStatus: any = {};
  await new Promise((resolve, reject) => {
    window.webOS.service.request(API_WEBOS.CONNECTION_MANAGER.base, {
      method: API_WEBOS.CONNECTION_MANAGER.methods.getStatus,
      parameters: { subscribe: true },
      onComplete: function (inResponse) {

        var isSucceeded = inResponse.returnValue;

        if (isSucceeded) {
          // To-Do something
          connectionStatus = mapDataConnectionStatus(inResponse);
          eventEmitterNative.emit(
            ListenerEvent.NETWORK_CHANGE,
            connectionStatus
          );
          resolve("success");
        } else {
          console.log("Failed to get TV device information");
          // To-Do something
        }
      },
    });
  });
  return connectionStatus;
};

const fetchAppId = () => {
  return window.webOS.fetchAppId();
};
const mapDataConnectionStatus = (connection: any) => {
  const networkConnection: [key: string, value: any] | undefined =
    Object.entries(connection).find(
      ([key, value]: [key: string, value: any]) => value.state === "connected"
    );
  if (networkConnection) {
    return {
      type: networkConnection[0],
      onInternet: networkConnection[1]?.onInternet === "yes",
      displayName: networkConnection[1]?.displayName,
      ipAddress: networkConnection[1]?.ipAddress,
      state: networkConnection[1]?.state,
    } as ConnectionT;
  }
  return {
    state: "disconnected",
  };
};

export const addEventCursorStateChange = (callback: (data: any) => void) => {
  document.addEventListener("keydown", (e) => {
    if (e.keyCode === CURSOR_STATE.CURSOR_SHOW) {
      callback({ isCursorShow: true });
    }
    if (e.keyCode === CURSOR_STATE.CURSOR_HIDE) {
      callback({ isCursorShow: false });
    }
  });
  document.addEventListener("cursorStateChange", (e: any) => {
    callback({ isCursorShow: e.detail.visibility });
  });
  document.addEventListener("focus", (e) => {
    callback({ isCursorShow: true });
  });
  document.addEventListener("blur", (e) => {
    callback({ isCursorShow: true });
  });
};
export const offEventCursorStateChange = (callback: (data: any) => void) => {
  document.removeEventListener("keydown", callback);
  document.removeEventListener("blur", callback);
  document.removeEventListener("focus", callback);
  document.removeEventListener("cursorStateChange", callback);
}
export const addEventKeyBoardStateChange = (callback: (data: any) => void) => {
  document.addEventListener("keyboardStateChange", (e: any) => {
    callback({ isKeyboardShow: e.detail.visibility });
  });
}

const getCommonPlatformData = async () => {
  const connectionStatus: ConnectionT = await CommonWebOS.getConnectionStatus();

  const deviceInfo: any = await CommonWebOS.getDeviceInfo();

  const appId = CommonWebOS.fetchAppId();
  const systemInfo = CommonWebOS.getSystemInfo();

  const uid = await CommonWebOS.getUid();

  let ipAddress = connectionStatus.ipAddress;

  // device info
  const rawDeviceInfo: DeviceInfoT = {
    brandName: deviceInfo.brandName,
    deviceName: getDeviceName(
      deviceInfo.brandName,
      PLATFORM_NAME.webOS,
      deviceInfo.modelName
    ),
    appId: appId,
    ipAddress: ipAddress,
    manufacturer: deviceInfo.manufacturer,
    modelName: deviceInfo.modelName,
    version: deviceInfo.version,
    uid,
  };

  // screen info
  const screen: ScreenT = {
    width: deviceInfo.screenWidth,
    height: deviceInfo.screenHeight,
  };

  // system info
  const rawSystemInfo = {
    country: systemInfo.country,
    timezone: systemInfo.timezone,
  };
  return {
    deviceInfo: rawDeviceInfo,
    screen,
    systemInfo: rawSystemInfo,
    connectionStatus,
  };
};
const CommonWebOS = {
  getDeviceInfo,
  getSystemInfo,
  fetchAppId,
  getConnectionStatus,
  getSystemProperty,
  getSystemSettings,
  getSystemTime,
  getCommonPlatformData,
  getUid,
  addEventCursorStateChange,
  offEventCursorStateChange,
  addEventKeyBoardStateChange,
};
export default CommonWebOS;
