:"use strict"

window.ut = window.ut or {}
window.ut.tools = window.ut.tools or {}
window.ut.tools.conceptmapper = window.ut.tools.conceptmapper or {}
resourceLoader = @golab.common.resourceLoader

resourceLoader.addResourcePaths({
  jquery: "/libs/js/jquery2.1/jquery.js"
})

conceptmapperLibsModule = {
  conceptmapperLibs: [
    [
      "font-awesome",
      "jquery",
      "jquery-ui",
    ]
    [
      "../../../../commons/js/utils.js",
      "../../../../libs/css/jquery.contextmenu.css",
      "../../../../libs/js/jquery.contextmenu.js",
      "../../../../libs/js/jquery.autogrow-textarea.js",
      "../../../../libs/js/jquery.jsPlumb-1.4.1-all-fixed.js"
    ]
    [
      "createEnvironmentHandlers"
    ]
  ]
}
resourceLoader.addResourceModules(conceptmapperLibsModule)

conceptmapperScriptsModule = {
  conceptmapperScripts: [
    ["css/conceptmap1.0.css",
     "coffee/ConceptMapper1.0.js"
    ]
  ]
}
resourceLoader.addResourceModules(conceptmapperScriptsModule, "/moodle_plugin_ccm/conceptmap/src/main/webapp/")

resourceLoader.addResourceModules({
  conceptmapper: [
    ["conceptmapperLibs"],
    ["conceptmapperScripts"]
  ]
}
)

window.ut.tools.conceptmapper.init = () ->
  console.log "Initializing ConceptMapper..."
  resourceLoader.orderedLoad([["conceptmapper"]])
  #resourceLoader.flatLoad([["conceptmapper"]])
  resourceLoader.ready ->
    window.golab.common.createEnvironmentHandlers("conceptMap", "ut.tools.conceptmapper", resourceLoader.getDesiredLanguage(),
    (metadataHandler, storageHandler, actionLogger, languageHandler, notificationClient) ->
      console.log("created environment handlers.")
      console.log("... all resources loaded, starting tool")
      configuration = window.golab.tools.configuration["conceptmapper"]
      conceptMapper = new window.ut.tools.conceptmapper.ConceptMapper(configuration, metadataHandler, storageHandler, actionLogger, languageHandler, notificationClient)
    )
