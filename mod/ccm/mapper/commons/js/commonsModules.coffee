"use strict";

@golab = @golab || {}
@golab.common = @golab.common || {}
@golab.common.resourceLoader = @golab.common.resourceLoader || {}

resourceModules = {
  "jquery-ui": [
    ["/libs/js/jquery-ui.custom.js",
     "/libs/js/jquery.ui.touch-punch.js",
     "/libs/css/jquery.ui.all.css",
     "/libs/js/socket.io.js",
     "/commons/css/golabJqueryUi.css"]
  ]
  "goLabUtils": [
    [ "/commons/js/angular/golabUtils.js",
      "/commons/css/golabUtils.css"]
  ]
  "createEnvironmentHandlers": [
    [ "/libs/js/jquery.cookie.js",
      "/libs/js/angular/localStorageModule.js",
      "/commons/js/ils.js",
      "/commons/js/MetadataHandler.js",
      "/commons/js/StorageHandler.js",
      "/commons/js/ActionLogger.js",
      "/commons/js/languageHandlers.js"
      "/commons/js/notificationClient.js"
      "/commons/js/createEnvironmentHandlers.js"
    ]
  ]
  "qunit": [
    ["/libs/js/qunit.js",
     "/libs/css/qunit.css"]
  ]
}

@golab.common.resourceLoader.addResourceModules(resourceModules)

resourcePaths = {
  angular: "/libs/js/angular/angular.js"
  jquery: "/libs/js/jquery.js"
  eventEmitter: "/libs/js/eventEmitter.js"
  "font-awesome": "/libs/font-awesome-4.0.3/css/font-awesome.css"

}

@golab.common.resourceLoader.addResourcePaths(resourcePaths)
