/**
 * Represents the device information for a WebOS device.
 */
export type DeviceWebOST = {
  modelName: string;
  version: string;
  versionMajor: string;
  versionMinor: string;
  versionDot: string;
  sdkVersion: string;
  screenWidth: number;
  screenHeight: number;
  uhd: boolean;
  uhd8K: boolean;
  oled: boolean;
  ddrSize: string;
  hdr10: boolean;
  dolbyVision: boolean;
  dolbyAtmos: boolean;
  brandName: string;
  manufacturer: string;
  mainboardMaker: string;
  platformBizType: string;
  tuner: boolean;
};

/**
 * Represents the WebOS interface.
 */
export interface IWebOS {
  /**
   * Retrieves the device information for a WebOS device.
   * @param callback - The callback function that receives the device information.
   */
  deviceInfo: (callback: (device: DeviceWebOST) => void) => void;

  /**
   * Represents the system properties of a WebOS device.
   */
  
  systemInfo: () => ({
    country: string;
    smartServiceCountry: string;
    timezone: string;
  });

  /**
   * Retrieves the application ID of the WebOS app.
   * @returns The application ID.
   */
  fetchAppId: () => string;

  /**
   * Represents the keyboard functionality of a WebOS device.
   */
  keyboard: {
    /**
     * Checks if the keyboard is currently showing on the WebOS device.
     * @returns A boolean indicating whether the keyboard is showing or not.
     */
    isShowing: () => boolean;
  };
  service: {
    request: (
      url: string,
      options: {
        method: string;
        parameters: {
          [key: string]: any;
        };
        onComplete?: (inResponse: any) => void;
        onSuccess?: (inResponse: any) => void;
        onFailure?: (inResponse: any) => void;
      }
    ) => void;
  };
}
