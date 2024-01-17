import { EventList, IUtilNative, ListenerEvent } from "./type";
import { PLATFORM_NAME } from "./utils/common";
import { getPlatformName } from "./utils/utils";
import CommonWebOS from "./webos/common.webos";
import EventEmitter from "eventemitter3";

export const eventEmitterNative = new EventEmitter();
// @ts-ignore
export class UtilNative implements IUtilNative {
  public static EventList = EventList;
  public baseInfo: any = {};
  private isLoadedData: boolean = false;
  public static _instance: any;

  constructor() {
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
  public onEvent(event: ListenerEvent, callback: (e: any) => void) {
    switch (event) {
      case ListenerEvent.NETWORK_CHANGE:
        eventEmitterNative.on(ListenerEvent.NETWORK_CHANGE, (data) => {
          this.baseInfo = {
            ...this.baseInfo,
            connectionStatus: data,
          }
          callback(data)
        });
        break;
      default:
        break;
    }
  }

  private async start() {
    const platformName = getPlatformName();
    console.log("🚀 ~ UtilNative ~ start ~ platformName:", platformName);
    switch (platformName) {
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
