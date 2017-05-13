"use strict"

console.log("Warning: The StorageHandler in
 /client/commons/js/StorageHandlerFactory.coffee is deprecated.
 Use the StorageHandler in StorageHandler.coffee instead.");

window.golab = window.golab || {}
window.golab.ils = window.golab.ils || {}
window.golab.ils.storage = window.golab.ils.storage || {}
window.golab.ils.storage.memory = window.golab.ils.storage.memory || {}

###
  Superclass for all storage handlers
###
class window.golab.ils.storage.StorageHandler

  constructor: (metadataHandler) ->
    console.log "Initializing StorageHandler."
    @_debug = true
    try
      metadataHandler.getMetadata()
      @metadataHandler = metadataHandler
    catch error
      throw "StorageHandler needs a MetadataHandler at construction!"

  getMetadataHandler: ->
    @metadataHandler

  getResourceDescription: (resource)->
    {
    id: resource.id
    title: resource.metadata.target.displayName
    tool: resource.metadata.generator.displayName
    modified: new Date(resource.metadata.published)
    }

  getResourceBundle: (content) =>
    resource = {}
    resource.id = ut.commons.utils.generateUUID()
    # cloning the objects!
    resource.metadata = JSON.parse(JSON.stringify(@metadataHandler.getMetadata()))
    resource.metadata.published = new Date().toISOString()
    resource.content = JSON.parse(JSON.stringify(content))
    resource

  ###
    Reads a resource with a given id.
    Returns a json object {id, metadata{}, content{}}
    Returns undefined if resourceId cannot be found
  ###
  readResource: (resourceId) ->
    throw "Abstract function - implement in subclass."

  ###
    Creates a resource with the given content.
    Returns a json object {id, metadata{}, content{}}
    Returns undefined if something went wrong
  ###
  createResource: (content) =>
    throw "Abstract function - implement in subclass."

  ###
    Updates an existing resource with new content.
    Returns a json object {id, metadata{}, content{}}
    Returns undefined if something went wrong
  ###
  updateResource: (resourceId, content) ->
    throw "Abstract function - implement in subclass."

  ###
    Lists all existing resources
    Returns an array with existing resourceId's
  ###
  listResourceIds: () ->
    throw "Abstract function - implement in subclass."

  ###
    Lists the metadata of all existing resources
    Returns an array with existing metadatas: [ {id: 123, metadata: {...}}, ... ]
  ###
  listResourceMetaDatas: () ->
    throw "Abstract function - implement in subclass."


###
  Implementation of an object storage handler
###
class window.golab.ils.storage.ObjectStorageHandler extends window.golab.ils.storage.StorageHandler
  constructor: (metadataHandler, storeObject) ->
    super
    if ( typeof storeObject != "object")
      throw "you must pass on an object to store the resources"
    @storeObject = storeObject
    console.log "Initializing ObjectStorageHandler."
    @

  readResource: (resourceId) ->
    if @storeObject[resourceId]
      if @_debug then console.log "MemoryStorage: readResource #{resourceId}"
      # cloning!
      return JSON.parse(JSON.stringify(@storeObject[resourceId]))
    else
      if @_debug then console.log "MemoryStorage: readResource #{resourceId} not found."
      return undefined

  createResource: (content) =>
    try
      # create resource with id, metadata and content
      resource = @getResourceBundle(content)
      if @storeObject[resource.id]
        if @_debug then console.log "MemoryStorage: resource already exists! #{resource.id}"
        return undefined
      else
        @storeObject[resource.id] = resource
        if @_debug then console.log "MemoryStorage: resource created: #{resource}"
        if @_debug then console.log resource
        return resource
    catch error
      if @_debug then console.log "MemoryStorage: resource NOT created: #{error}"
      return undefined

  updateResource: (resourceId, content) ->
    if @storeObject[resourceId]
      # create resource with id, metadata and content
      resource = @getResourceBundle(content)
      @storeObject[resourceId] = resource
      console.log "MemoryStorage: updateResource #{resourceId}"
      return resource
    else
      console.log "MemoryStorage: updateResource failed, resource doesn't exist: #{resourceId}"
      return undefined

  listResourceIds: () ->
    id for id, resource of @storeObject

  _listResourceMetaDatas: () ->
    metadatas = {}
    for id, resource of @storeObject
      metadatas[id] = JSON.parse(JSON.stringify(resource.metadata))
    metadatas

  listResourceMetaDatas: () ->
    metadatas = []
    for id, resource of @storeObject
      metadatas.push {
        id: id
        metadata: JSON.parse(JSON.stringify(resource.metadata))
      }
    metadatas

###
  Implementation of a memory storage handler, which is a subclass of the object storage handler.
###
class window.golab.ils.storage.MemoryStorageHandler extends window.golab.ils.storage.ObjectStorageHandler
  constructor: (metadataHandler)->
    super(metadataHandler, {})
    console.log "Initializing MemoryStorageHandler, debug: #{@_debug}."
    @

###
  Implementation of a local (browser) storage handler.
###
goLabLocalStorageKey = "_goLab_"
class window.golab.ils.storage.LocalStorageHandler extends window.golab.ils.storage.StorageHandler
  constructor: (metadataHandler) ->
    super
    console.log "Initializing LocalStorageHandler."
    @

  readResource: (resourceId) ->
    if localStorage[goLabLocalStorageKey + resourceId]
      if @_debug then console.log "LocalStorageHandler: readResource #{resourceId}"
      return JSON.parse(localStorage[goLabLocalStorageKey + resourceId])
    else
      if @_debug then console.log "LocalStorageHandler: readResource #{resourceId} not found."
      return undefined

  createResource: (content) =>
    try
    # create resource with id, metadata and content
      resource = @getResourceBundle(content)
      resourceId = resource.id
      if localStorage[goLabLocalStorageKey + resourceId]
        if @_debug then console.log "LocalStorageHandler: resource already exists! #{resource.id}"
        return undefined
      else
        localStorage[goLabLocalStorageKey + resourceId] = JSON.stringify(resource)
        if @_debug then console.log "LocalStorageHandler: resource created: #{resource}"
        if @_debug then console.log resource
        return resource
    catch error
      if @_debug then console.log "LocalStorageHandler: resource NOT created: #{error}"
      return undefined

  updateResource: (resourceId, content) ->
    if localStorage[goLabLocalStorageKey + resourceId]
      # create resource with id, metadata and content
      resource = @getResourceBundle(content)
      localStorage[goLabLocalStorageKey + resourceId] = JSON.stringify(resource)
      console.log "LocalStorageHandler: updateResource #{resourceId}"
      return resource
    else
      console.log "LocalStorageHandler: updateResource failed, resource doesn't exist: #{resourceId}"
      return undefined

  isGoLabKey: (key) ->
    key.indexOf(goLabLocalStorageKey) == 0

  listResourceIds: () ->
    id for id, resourceString of localStorage when @isGoLabKey(id)

  _listResourceMetaDatas: () ->
    metadatas = {}
    for id, resourceString of localStorage when @isGoLabKey(id)
      resource = JSON.parse(resourceString)
      metadatas[resource.id] = {
        id: resource.id
        metadata: resource.metadata
      }
    metadatas

  listResourceMetaDatas: () ->
    metadatas = []
    for id, resourceString of localStorage when @isGoLabKey(id)
      resource = JSON.parse(resourceString)
      metadatas.push {
        id: resource.id
        metadata: resource.metadata
      }
    metadatas
