import CommonTizen from "./tizen/common.tizen";
import { BaseInfoT, EventList, IUtilNative, ListenerEvent } from "./type";
import { PLATFORM_NAME } from "./utils/common";
import { getPlatformName } from "./utils/utils";
import CommonWebOS from "./webos/common.webos";
import EventEmitter from "eventemitter3";

export const eventEmitterNative = new EventEmitter();
// @ts-ignore

export class UtilNative implements IUtilNative {
  public baseInfo: BaseInfoT = {};
  private isLoadedData: boolean = false;
  public static _instance: any;
  public platformName: PLATFORM_NAME = getPlatformName();
  constructor() {
    this.platformName = getPlatformName();
    this.start();
  }

  public static getInstance(): IUtilNative {
    if (!this._instance) {
      this._instance = new UtilNative();
    }
    return this._instance;
  }

  // check keyboard isShowing
  public static isShowingKeyboard(): boolean {
    return window.webOS.keyboard.isShowing();
  }

  public async getBaseInfo(): Promise<any> {
    console.log("isloaded data", this.isLoadedData);
    if (this.isLoadedData) {
      return this.baseInfo;
    }
    await new Promise((resolve, reject) => {
      // @ts-ignore
      eventEmitterNative.on(EventList.LOADED_INFO, (data) => {
        console.log("🚀 ~ UtilNative ~ eventEmitterNative.on ~ data:", data);
        this.isLoadedData = true;
        resolve("success");
      });
    });
    console.log("🚀 ~ UtilNative ~ getBaseInfo ~ this.baseInfo", this.baseInfo);
    return this.baseInfo;
  }

  private onCursorStateChange = (callback: (data: any) => void) => {
    switch (this.platformName) {
      case PLATFORM_NAME.webOS:
        const newCallback = (data: any) => {
          this.baseInfo = {
            ...this.baseInfo,
            cursor: data,
          };
          callback(data);
        }
        CommonWebOS.addEventCursorStateChange(newCallback);
        break;
        case PLATFORM_NAME.tizen:
        console.error("event onCursorStateChange not support for tizen");
        break;
      default:
    }
  };
  private onKeyboardStateChange = (callback: (data: any) => void) => {
    switch (this.platformName) {
      case PLATFORM_NAME.webOS:
        const newCallback = (data: any) => {
          this.baseInfo = {
            ...this.baseInfo,
            keyboard: data,
          };
          callback(data);
        }
        CommonWebOS.addEventKeyBoardStateChange(newCallback);
        break;  
      case PLATFORM_NAME.tizen:
        console.error("event onKeyboardStateChange not support for tizen");
        break;
      default:
    }
  };
  private onNetworkStateChange = (callback: (data: any) => void) => {
    switch (this.platformName) {
      case PLATFORM_NAME.webOS:
        eventEmitterNative.on(ListenerEvent.NETWORK_CHANGE, (data) => {
          this.baseInfo = {
            ...this.baseInfo,
            connectionStatus: data,
          };
          callback(data);
        });
        break;
      case PLATFORM_NAME.tizen:
        const newCallback = (data: any) => {
          this.baseInfo = {
            ...this.baseInfo,
            connectionStatus: data,
          };
          callback(data);
        }
        CommonTizen.registerNetworkStateChangeListener(newCallback);
        break;
      default:
    }
  };

  public onEvent(event: ListenerEvent, callback: (e: any) => void) {
    switch (event) {
      //
      case ListenerEvent.NETWORK_CHANGE:
        this.onNetworkStateChange(callback);
        break;
      // logic use for webos TV not exact in browser
      case ListenerEvent.MOUSE_ENABLE:
        this.onCursorStateChange(callback);
        break;
      case ListenerEvent.STATUS_KEYBOARD_CHANGE:
        this.onKeyboardStateChange(callback);
        break;
      default:
        break;
    }
  }
  public offEvent(event: ListenerEvent, callback: (e: any) => void) {
    switch (this.platformName) {
      case PLATFORM_NAME.webOS:
        switch (event) {
          case ListenerEvent.MOUSE_ENABLE:
            // CommonWebOS.offEventCursorStateChange(callback);
            break;
          default:
            break;
        }
        break;
      case PLATFORM_NAME.tizen:
        switch (event) {
          case ListenerEvent.NETWORK_CHANGE:
            // CommonTizen.removeNetworkStateChangeListener();
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  private async start() {
    switch (this.platformName) {
      case PLATFORM_NAME.webOS:
        const data = await CommonWebOS.getCommonPlatformData();
        this.baseInfo = data;
        break;
      case PLATFORM_NAME.tizen:
        const dataTizen = await CommonTizen.getCommonPlatformData();
        this.baseInfo = dataTizen;
        break;
      default:
    }
    setTimeout(() => {
      eventEmitterNative.emit(EventList.LOADED_INFO, { isSuccess: true });
    }, 300);
  }
}
