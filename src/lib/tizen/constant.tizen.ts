import { NetworkStatus, NetworkType } from "../type"

export const API_TIZEN = {
  DEVICE_ID: {
    base: "http://tizen.org/system/tizenid",
  },
  DEVICE_NAME: {
    base: 'http://tizen.org/system/model_name'
  },
  MANUFACTURER: {
    base: "http://tizen.org/system/manufacturer"
  },
  TIZEN_PLATFORM_VER: {
    base:  "http://tizen.org/feature/platform.version"
  }
}
export const NetworkState = {
  4: {
    name:NetworkStatus.CONNECTED,
  },
  5: {
    name: NetworkStatus.DISCONNECTED
  }
}
export const NetworkConnectionType = {
  3: {
    name: NetworkType.ETHERNET
  },
  1: {
    name: NetworkType.WIFI
  }
}