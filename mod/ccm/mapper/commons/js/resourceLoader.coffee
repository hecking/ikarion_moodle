"use strict";

###
  The resource loader can load resources at runtime. It is a wrapper around HeadJS and adds a kind of module definition system.

  If a path starts with a "/", it is assumed to be referencing the client root of the Twente Go-Lab directory setup.
  Only these paths, will be adjusted as needed. The resource loader support the following adjustments:
  - if running in shindig, the path adjusted to point to the correct path at the server where the gadget is fetched from
  - if the gadget path contains "/build/":
    - the "/build/" in the gadget path is the base url
    - its "flattens" the Twente Go-Lab directory setup, meaning it expects at the base url:
	  - the commons and libs directories
	  - the scripts, js, styles and css directories, with the files from all referenced labs, tools and web modules
	- these changes match the creation of production build version of a lab or tool, as defined in the gulpfile.js in the client root.

  After this file has been loaded, the resource loader can be referenced by: window.golab.common.resourceLoader. The resource loader is a JavaScript object with the following properties:

  addResourcePaths: function(paths:Object, prefix: String): void

	Adds one or more name/path combinations. This makes it possible to specify angular in your modules instead of using the path to angular.

	paths: Object
		The keys of the path objects are the names and the values are the paths. The Value is string.

	prefix: String
		The prefix is an optional parameter.
		The prefix will be placed before the paths.


  addResourceModules: function(modules: Object, prefix: String): void

	Adds one or more modules.

	modules: Object
		The keys of the modules objects are the names and the values are the definitions of the modules.
		THe definition of a module is of type (String[])[].
		The elements in the String[] can be:
		- the name of a resource path (as defined with addResourcePaths)
		- the name of a module (as defined with addResourceModules)
		- the path of a resource

	prefix: String
		The prefix is an optional parameter.
		The prefix will be placed before the paths.

  orderedLoad: function(resources: (String[])[]): void

	Will load the resources in the specified sequence. The elements in the String[] will be loaded parallel.
	The elements in the String[] can be:
	- the name of a resource path (as defined with addResourcePaths)
	- the name of a module (as defined with addResourceModules)
	- the path of a resource
	Any duplicate resources will only be loaded once.
	When all resources are loaded, the callback function (given to the ready function) will be called.

  flatLoad: function(resources: (String[])[]): void

	The flatLoad will do the same thing as the orderedLoad, except it will load all resources in parallel.

  ready: function(callback: function(): void): void

	The callback function will be called when the all resources are loaded by the orderLoad or flatLoad function

  getDesiredLanguage: function(): String

	Returns the desired language, selected as follows:
	If it is running inside shindig, the language as set in the open social container.
	If it is running outside shindig:
		1. the language specified in the url through the lang= option
		2. the language of the browser

  getBaseUrl: function(): String

	Returns the absolute url of the client directory in Twente Go-Lab directory setup

  getRootUrl: function(): String

	Returns the absolute url of the directory of the gadget html/xml file

  getIncludeUrl: function(path: String): String

	Returns the absolute url the resource referenced by path. If the gadget is running in shindig and IE9, the shindig proxy will be used.

	path: String
		The path to the resource. It is assumed to be relative to the root url.

###

@golab = @golab || {}
@golab.common = @golab.common || {}

head = window["head"]

buildPath = "/build/"
subPaths = ["/commons/", "/libs/", "/labs/", "/tools/", "/web/"]
minifiyPaths = ["/libs/"]
productPaths = ["/labs/", "/tools/", "/web/"]
productionSubPaths = ["/scripts/", "/js/", "/styles/", "/css/"]

loadCssFilesOneByOne = false
if (head.browser.ie && head.browser.version < 10)
  loadCssFilesOneByOne = true
loadCssFilesOneByOne = true

#console.log("loadCssFilesOneByOne: " + loadCssFilesOneByOne)

debug = false
showRealLoadList = debug || false

runningInGraasp = window.gadgets?
productionVersion = false

baseUrl = ""
rootUrl = ""

setBaseUrls = ->
  findBaseUrl = (url)->
#    console.log("findBaseUrl(#{url})")
    lastIndex = url.length
    buildPathIndex = url.lastIndexOf(buildPath)
    if (buildPathIndex >= 0)
      productionVersion = true
      lastIndex = buildPathIndex + buildPath.length - 1
    else
      for subPath in subPaths
        subPathLastIndex = url.lastIndexOf(subPath)
        if (subPathLastIndex >= 0)
          lastIndex = Math.min(subPathLastIndex, lastIndex)
    if (lastIndex < url.length)
      url.substr(0, lastIndex)
    else
      "http://go-lab.gw.utwente.nl/sources"

  findRootUrl = (rawUrl) ->
    questionMarkIndex = rawUrl.indexOf("?")
    url = if (questionMarkIndex>=0)
      rawUrl.substring(0,questionMarkIndex)
    else
      rawUrl
    lastSlashIndex = url.lastIndexOf("/")
    if (lastSlashIndex>=0)
      url.substring(0,lastSlashIndex)
    else
      url

  myUrl = if runningInGraasp
    window.gadgets.util.getUrlParameters().url
  else
    location.href
  baseUrl = findBaseUrl(myUrl)
  rootUrl = findRootUrl(myUrl)
  console.log("myUrl: #{myUrl}") if debug
  console.log("baseUrl: #{baseUrl}") if debug
  console.log("rootUrl: #{rootUrl}") if debug

setBaseUrls()

getIncludeUrl = (path)->
  includeUrl = rootUrl + path
  console.log("getIncludeUrl('#{path}'): #{includeUrl}") if debug
  includeUrl

if (runningInGraasp && head.browser.ie && head.browser.version < 10)
  portPart = window.location.port
  if (portPart)
    portPart = ":" + portPart
  shindigProxy = "#{window.location.protocol}//#{window.location.host}#{portPart}/gadgets/proxy/"
  console.log("shindigProxy: #{shindigProxy}") if debug

  getIncludeUrl = (path)->
    lastSlashIndex = path.lastIndexOf("/")
    fileName = if (lastSlashIndex >= 0)
      path.substr(lastSlashIndex+1)
    else
      path
    includeUrl = shindigProxy + fileName + "?container=default&url=" + rootUrl + path
    console.log("getIncludeUrl('#{path}'): #{includeUrl}") if true
    includeUrl

resourcePaths = {}
resourceModules = {}
loadedResources = {}

loadedResourceList = []

addPathPrefix = (paths, prefix)->
  if (prefix)
    if (Array.isArray(paths))
      for path in paths
        addPathPrefix(path, prefix)
    else if (typeof paths == "object")
      prefixedPaths = {}
      for key,path of paths
        prefixedPaths[key] = addPathPrefix(path, prefix)
      prefixedPaths
    else
      prefix + paths
  else
    paths

addResourcePaths = (paths, prefix)->
  prefixedPaths = addPathPrefix(paths, prefix)
  for key,value of prefixedPaths
    resourcePaths[key] = value
  console.log("resourcePaths: #{JSON.stringify(resourcePaths)}") if debug

addResourceModules = (modules, prefix)->
  prefixedModules = addPathPrefix(modules, prefix)
  for key,value of prefixedModules
    resourceModules[key] = value
  console.log("resourceModules: #{JSON.stringify(resourceModules)}") if debug

makeRealPath = (path) ->
  if (productionVersion)
    for productPath in productPaths
      if (path.indexOf(productPath) == 0)
        for productionSubPath in productionSubPaths
          lastIndex = path.lastIndexOf(productionSubPath)
          if (lastIndex >= 0)
            localPath = path.substring(lastIndex)
            return baseUrl + localPath
  for subPath in subPaths
    if (path.indexOf(subPath) == 0)
      if (productionVersion && subPath in minifiyPaths)
        lastJsIndex = path.lastIndexOf(".js")
        if (lastJsIndex >= 0)
          path = path.substring(0, lastJsIndex) + ".min.js"
      return baseUrl + path
  path

makeRealPaths = (paths) ->
  if (Array.isArray(paths))
    for path in paths
#      console.log("path: #{path} -> #{makeRealPath(path)}")
      makeRealPath(path)
  else
#    console.log("path: #{paths} -> #{makeRealPath(paths)}")
    makeRealPath(paths)

cleanupResourcesToLoad = (resourcesToLoad)->
  realfilesToLoad = []
  for resource in resourcesToLoad
    if (loadedResources[resource])
      console.log("allready loaded: #{resource}") if debug
    else if (resourcePaths[resource])
      realfilesToLoad.push(resourcePaths[resource])
    else
      realfilesToLoad.push(resource)
  realfilesToLoad

registerLoadedResources = (filesToLoad)->
  for file in filesToLoad
    loadedResources[file] = true
    loadedResourceList.push(file)

orderedLoad = (resourcesList) ->
  console.log("orderedLoad(#{JSON.stringify(resourcesList)})") if debug
  if (resourcesList.length)
    resourcesToLoad = resourcesList[0]
    nextResourcesList = if (resourcesList.length > 1)
      resourcesList.slice(1)
    else
      []
    startLoadMillis = Date.now()
    loadNextResources = ->
      usedLoadMillis = Date.now() - startLoadMillis
      console.log("loaded: #{resourcesToLoad} in #{usedLoadMillis} ms.") if debug
      orderedLoad(nextResourcesList)

    resourcesToLoad = cleanupResourcesToLoad(resourcesToLoad)
    if (resourcesToLoad.length)
      registerLoadedResources(resourcesToLoad)
      realFilePaths = makeRealPaths(resourcesToLoad)
      console.log("loading: #{JSON.stringify(resourcesToLoad)}") if debug
      console.log("real paths: #{JSON.stringify(realFilePaths)}") if debug
      head.load(realFilePaths, loadNextResources)
    else
      loadNextResources()


createLoadList = (resourcesList)->
  loadList = []
  for resources in resourcesList
    list = []
    for resource in resources
      if (resourceModules[resource])
        resourceList = createLoadList(resourceModules[resource])
        if (resourceList.length == 1)
          for res in resourceList[0]
            list.push(res)
        else
          loadList = loadList.concat(resourceList)
      else
        list.push(resource)
    if (list.length)
      loadList.push(list)
  console.log("loadList: #{JSON.stringify(loadList)}") if debug
  loadList

removeDuplicatesFromLoadList = (resourcesList)->
  listedResources = {}
  cleanedLoadList = []
  for resources in resourcesList
    list = []
    for resource in resources
      if (!listedResources[resource])
        list.push(resource)
        listedResources[resource] = true
    #        console.log("added: #{resource}")
    #      else
    #        console.log("allready done: #{resource}")
    if (list.length)
      cleanedLoadList.push(list)
  cleanedLoadList

cssExtension = ".css"
makeLoadCssFilesOneByOne = (resourceList) ->
  isCssResource = (resource) ->
    cssIndex = resource.toLowerCase().lastIndexOf(".css")
    cssIndex == resource.length - cssExtension.length
  loadList = []
  for resources in resourceList
    noCssResourceList = []
    for resource in resources
      if (isCssResource(resource))
        loadList.push([resource])
      else
        noCssResourceList.push(resource)
    if (noCssResourceList.length)
      loadList.push(noCssResourceList)
  loadList

limitNrOfParallelResources = (resourceList) ->
  maxNrOfParallelResources = 16
  loadList = []
  for resources in resourceList
    nrOfResourcesCopied = 0
    while nrOfResourcesCopied < resources.length
      nrOfResourcesToCopy = Math.min(maxNrOfParallelResources, resources.length - nrOfResourcesCopied)
      loadList.push(resources.slice(nrOfResourcesCopied, nrOfResourcesCopied + nrOfResourcesToCopy))
      nrOfResourcesCopied += nrOfResourcesToCopy
  loadList

countResources = (resourceList)->
  count = 0
  for resources in resourceList
    count += resources.length
  count

printLoadList = (header, resourcesList) ->
  console.log(header)
  for list,index in realResourceList
    console.log(" #{index + 1}: [ (#{list.length} resources)")
    for item in list
      console.log("     #{item}")
    console.log("    ]")

startLoadMillis = Date.now()

realResourceList = []
startOrderedLoad = (resources)->
  loadList = createLoadList(resources)
  loadList = removeDuplicatesFromLoadList(loadList)
  if (loadCssFilesOneByOne)
    loadList = makeLoadCssFilesOneByOne(loadList)
  realResourceList = limitNrOfParallelResources(loadList)
  if (showRealLoadList)
    printLoadList("The real resource list:", realResourceList)
  console.log("Start ordered loading #{countResources(realResourceList)} files in #{realResourceList.length} steps")
  orderedLoad(realResourceList)

printFilesLoaded = ->
  console.log("Loaded #{loadedResourceList.length} files:")
  for file,index in loadedResourceList
    console.log(" #{index + 1}: #{file}")

flattenResourceList = (resourceList)->
  loadList = []
  for resources in resourceList
    for resource in resources
      loadList.push(resource)
  [loadList]

startFlatLoad = (resources)->
  loadList = createLoadList(resources)
  loadList = removeDuplicatesFromLoadList(loadList)
  realResourceList = flattenResourceList(loadList)
  if (loadCssFilesOneByOne)
    realResourceList = makeLoadCssFilesOneByOne(realResourceList)
  if (showRealLoadList)
    printLoadList("The real resource list:", realResourceList)
  console.log("Start flat loading #{countResources(realResourceList)} files in #{realResourceList.length} steps")
  orderedLoad(realResourceList)

ready = (callback)->
  head.ready(->
    usedLoadMillis = Date.now() - startLoadMillis
    nrOfResourcesToLoad = countResources(realResourceList)
    difference = nrOfResourcesToLoad - loadedResourceList.length
    if (difference)
      console.error("did not load all resources, missed #{difference} resources")
      if (!showRealLoadList)
        printLoadList("The real resource list:", realResourceList)
    console.log("Loaded #{loadedResourceList.length} files, in #{usedLoadMillis} ms.")
    if (debug || difference)
      printFilesLoaded()
    callback()
  )

getParameterFromUrl = (key) ->
  lcKey = key.toLowerCase()
  parameter = null
  queryPart = location.search.trim().toLowerCase()
  if (queryPart && queryPart[0] == "?")
    parts = queryPart.substring(1).split("&")
    for part in parts
      partParts = part.split("=")
      if (partParts.length == 2 && partParts[0] == lcKey)
        parameter = partParts[1]
  parameter

getBrowserLanguage = ->
#  if (navigator.userLanguage)
#    console.log("navigator.userLanguage: #{navigator.userLanguage}")
#  if (navigator.browserLanguage)
#    console.log("navigator.browserLanguage: #{navigator.browserLanguage}")
  if (navigator.userLanguage)
    navigator.userLanguage
  else if navigator.language
    navigator.language
  else
    "en"

findDesiredLanguage = ->
  if (runningInGraasp)
    gadgetPrefs = new gadgets.Prefs()
    gadgetPrefs.getLang()
  else
    language = getParameterFromUrl("lang")
    if (language)
      language
    else
      getBrowserLanguage()

getSimpleLanguage = (language)->
  languageParts = language.split("-")
  languageParts[0]

desiredLanguage = findDesiredLanguage()

@golab.common.resourceLoader = {
  addResourcePaths: addResourcePaths
  addResourceModules: addResourceModules
  orderedLoad: startOrderedLoad
  flatLoad: startFlatLoad
#  printFilesLoaded: printFilesLoaded
  ready: ready
  getDesiredLanguage: ()->
    desiredLanguage
  getBaseUrl: ()->
    baseUrl
  getRootUrl: ()->
    rootUrl
  getIncludeUrl: getIncludeUrl
}

