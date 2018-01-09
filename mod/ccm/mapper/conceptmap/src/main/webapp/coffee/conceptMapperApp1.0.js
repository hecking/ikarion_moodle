// Generated by CoffeeScript 1.6.3
(function() {
  "use strict";
  var conceptmapperLibsModule, conceptmapperScriptsModule, resourceLoader, conceptMapper;

  window.ut = window.ut || {};

  window.ut.tools = window.ut.tools || {};

  window.ut.tools.conceptmapper = window.ut.tools.conceptmapper || {};

  resourceLoader = this.golab.common.resourceLoader;

  resourceLoader.addResourcePaths({
    jquery: "../../../../libs/js/jquery2.1/jquery.js"
  });

  conceptmapperLibsModule = {
    conceptmapperLibs: [["font-awesome", "jquery", "jquery-ui"], ["../../../../commons/js/utils.js", "../../../../libs/css/jquery.contextmenu.css", "../../../../libs/js/jquery.contextmenu.js", "../../../../libs/js/jquery.autogrow-textarea.js", "../../../../libs/js/jquery.jsPlumb-1.4.1-all-fixed.js"], ["createEnvironmentHandlers"]]
  };
//["https://togetherjs.com/togetherjs-min.js"],
  resourceLoader.addResourceModules(conceptmapperLibsModule);

  conceptmapperScriptsModule = {
    conceptmapperScripts: [["css/conceptmap1.0.css", "coffee/ConceptMapper1.0.js"]]
  };

  resourceLoader.addResourceModules(conceptmapperScriptsModule);

  resourceLoader.addResourceModules({
    conceptmapper: [["conceptmapperLibs"], ["conceptmapperScripts"]]
  });


  window.ut.tools.conceptmapper.init = function() {
    console.log("Initializing ConceptMapper...");
    resourceLoader.orderedLoad([["conceptmapper"]]);
    return resourceLoader.ready(function() {
      return window.golab.common.createEnvironmentHandlers("conceptMap", "ut.tools.conceptmapper", resourceLoader.getDesiredLanguage(), function(metadataHandler, storageHandler, actionLogger, languageHandler, notificationClient) {
        var configuration;
        console.log("created environment handlers.");
        console.log("... all resources loaded, starting tool");
        configuration = window.golab.tools.configuration["conceptmapper"];
        actionLogger.setStorageHandler(storageHandler);
        return window.ut.tools.conceptmapper.conceptMapper = new window.ut.tools.conceptmapper.ConceptMapper(configuration, metadataHandler, storageHandler, actionLogger, languageHandler, notificationClient);
      });
    });
  };

}).call(this);

/*
//@ sourceMappingURL=conceptMapperApp1.0.map
*/