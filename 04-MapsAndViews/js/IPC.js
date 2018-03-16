let serviceList = [mapService, donutService, barService]

let IPCMain = {
  /**
   * Main IPC component
   *
   * IPC will be initialed by external call.
   * Init IPC will also trigger the services initialization.
   *
   * @constructor
   */
  init: function () {
    serviceList.forEach(v => v.init())
  },
  /**
   * Service data injection
   *
   * IPC receive message from services and call injectData
   * process of each service. This keeps the lifecycle of
   * services.
   *
   * @param params
   */
  send: function (params) {
    serviceList.forEach(v => v.injectData(params))
  }
}