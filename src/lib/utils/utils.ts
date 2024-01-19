import { PLATFORM_NAME } from "./common";

export const userAgentContains = (key: PLATFORM_NAME) => {
  const userAgent = window.navigator.userAgent || "";
  return userAgent.toLowerCase().includes(key.toLowerCase());
};
export const getDeviceName = (
  brandName: string,
  platform: PLATFORM_NAME,
  modelName: string
) => {
  return `${brandName} ${platform}-${modelName}`;
};
export const getPlatformName = () => {
  if (userAgentContains(PLATFORM_NAME.webOS)) {
    return PLATFORM_NAME.webOS;
  }
  if (userAgentContains(PLATFORM_NAME.tizen)) {
    return PLATFORM_NAME.tizen;
  }
  if (userAgentContains(PLATFORM_NAME.sony)) {
    return PLATFORM_NAME.sony;
  }
  if (userAgentContains(PLATFORM_NAME.panasonic)) {
    return PLATFORM_NAME.panasonic;
  }
  if (userAgentContains(PLATFORM_NAME.tivo)) {
    return PLATFORM_NAME.tivo;
  }
  if (userAgentContains(PLATFORM_NAME.toshiba)) {
    return PLATFORM_NAME.toshiba;
  }
  if (userAgentContains(PLATFORM_NAME.apple)) {
    return PLATFORM_NAME.apple;
  }
  if (userAgentContains(PLATFORM_NAME.ios)) {
    return PLATFORM_NAME.ios;
  }
  if (userAgentContains(PLATFORM_NAME.android)) {
    return PLATFORM_NAME.android;
  }
  // fallback
  return PLATFORM_NAME.browser;
};
const request = new XMLHttpRequest();

const checkOnlineStatus = (stopAfterMs = 500) => {
  let stopApiCallTimer: any;

  try {
    if (stopAfterMs) {
      stopApiCallTimer = setTimeout(() => {
        request.abort();
        // setNetworkConnection(false);
      }, stopAfterMs);
    }

    // Ping Google :)
    request.open('GET', 'http://connectivitycheck.gstatic.com/generate_204', true);

    request.onload = () => {
      if (stopApiCallTimer) clearTimeout(stopApiCallTimer);
      // setNetworkConnection(request?.status >= 200 && request?.status < 300);
    };

    request.onerror = () => {
      if (stopApiCallTimer) clearTimeout(stopApiCallTimer);
      // setNetworkConnection(false);
    };

    request.send();
  } catch (e) {
    if (stopApiCallTimer) clearTimeout(stopApiCallTimer);
    request.abort();
    // setNetworkConnection(false);
  }
};
