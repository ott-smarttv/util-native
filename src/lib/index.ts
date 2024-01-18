import { EventList, IUtilNative, ListenerEvent } from "./type";
import { PLATFORM_NAME } from "./utils/common";
import { getPlatformName } from "./utils/utils";
import CommonWebOS, { addEventCursorStateChange } from "./webos/common.webos";
import EventEmitter from "eventemitter3";

export const eventEmitterNative = new EventEmitter();
// @ts-ignore
export class UtilNative implements IUtilNative {
  public static EventList = EventList;
  public baseInfo: any = {};
  private isLoadedData: boolean = false;
  public static _instance: any;
  public timeoutActiveMouse: any;
  public platformName: PLATFORM_NAME = getPlatformName();
  constructor() {
    this.platformName = getPlatformName();
    (async () => {
      await this.start();
    })();
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
    if (this.isLoadedData) {
      return this.baseInfo;
    }
    await new Promise((resolve, reject) => {
      // @ts-ignore
      eventEmitterNative.on(EventList.LOADED_INFO, (data) => {
        this.isLoadedData = true;
        resolve("success");
      });
    });
    return this.baseInfo;
  }

  private onCursorStateChange = (callback: (data: any) => void) => {
    switch (this.platformName) {
      case PLATFORM_NAME.webOS:
        addEventCursorStateChange(callback);
        break;
      default:
    }
  };

  public onEvent(event: ListenerEvent, callback: (e: any) => void) {
    console.log('callback', callback)
    switch (event) {
      //
      case ListenerEvent.NETWORK_CHANGE:
        eventEmitterNative.on(ListenerEvent.NETWORK_CHANGE, (data) => {
          this.baseInfo = {
            ...this.baseInfo,
            connectionStatus: data,
          };
          callback(data);
        });
        break;
      // logic use for webos TV not exact in browser
      case ListenerEvent.MOUSE_ENABLE:
        this.onCursorStateChange(callback);
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
            CommonWebOS.offEventCursorStateChange(callback)
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
        console.log("abc", data);
        this.baseInfo = data;
        break;
      default:
    }
    console.log("success");
    eventEmitterNative.emit(EventList.LOADED_INFO, { isSuccess: true });
  }
}
