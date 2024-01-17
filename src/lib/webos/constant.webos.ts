
export const API_WEBOS = {
  SYSTEM_PROPERTY: {
    base: 'luna://com.webos.service.tv.systemproperty',
    methods: {
      getSystemInfo: 'getSystemInfo', // model, version, etc
    }
  },
  SYSTEM_TIME: {
    base: 'luna://com.palm.systemservice',
    methods: {
      getSystemTime: 'time/getSystemTime',  // time, timezone, etc
    }
  },
  SETTINGS_SERVICE: {
    base: 'luna://com.webos.settingsservice',
    methods: {
      getSystemSettings: 'getSystemSettings', // country, language, etc
    }
  },
  CONNECTION_MANAGER: {
    base: 'luna://com.palm.connectionmanager',
    methods: {
      getStatus: 'getStatus', // wifi, wired, bluetooth, etc
    }
  }
}