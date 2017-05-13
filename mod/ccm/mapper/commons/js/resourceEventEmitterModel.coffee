"use strict";

window.ut = window.ut || {}
ut.commons = ut.commons || {}

class window.ut.commons.ResourceEventEmitterModel extends window.EventEmitter
  constructor: (@storageHandler)->
    @_id = null
    @_metadata = null
    @_content = null
    @_resource = null
    @_emitEvents = true
    @_debug = false

  getId: ->
    @_id

  getMetadata: ->
    @_metadata

  getResource: ->
    {
    id: @getId()
    metadata: @getMetadata()
    content: @getResourceContent()
    }

  loadFromResource: (resource) ->
    @_emitEvents = false
    @_id = resource.id
    @_metadata = resource.metadata
    @loadFromResourceContent(resource.content)
    @_resource = resource
    # copy resource content specific metadata
    @storageHandler.getMetadataHandler().setTarget(resource.metadata.target)
    @_emitEvents = true
    @emitModelLoaded()

  clear: ->
    @_id = null
    @_metadata = null
    @clearContent()
    @emitEvent("modelCleared")
    @emitModelChanged()

  hasResource: ->
    @getId()!=null

  getResourceContent: ->
    @_content

  loadFromResourceContent: (content)->
    @_content = content

  clearContent: ->
    @_content = null
    @emitEvent("contentCleared")
    @emitModelChanged()

  emitEvents: ->
    @_emitEvents

  emitEvent: (event, args)->
    if (@emitEvents())
      console.log("emitEvent(#{JSONR.stringify(arguments)})") if (@_debug)
      super(event, args)

  emitModelChanged: ->
    @emitEvent("modelChanged")

  emitModelLoaded: ->
    @emitEvent("modelLoaded")
    @emitModelChanged()

  addListeners: (events, listener)->
    for event in events
      @addListener(event, listener)

  createResource: (callback) ->
    content = @getResourceContent()
    @storageHandler.createResource(content, (error, resource)=>
      if (!error)
        @_resource = resource
        @_id = resource.id
        @_metadata = resource.metadata
      if (callback)
        callback(error, resource)
    )

  getResourceBundle: ()->
    id = @getId()
    content = @getResourceContent()
    resourceBundle = if (id)
      @storageHandler.getResourceBundle(content, id)
    else
      @storageHandler.getResourceBundle(content)
    @_resource = resourceBundle
    @_id = resourceBundle.id
    @_metadata = resourceBundle.metadata
    resourceBundle

  getDisplayName: (displayName) ->
    if (@_metadata)
      @_metadata.target.displayName
    else
      @storageHandler.getMetadataHandler().getTargetDisplayName()

  setDisplayName: (displayName) ->
    @storageHandler.getMetadataHandler().setTargetDisplayName(displayName)

  getResourceDescription: ->
    if (@_resource)
      @storageHandler.getResourceDescription(@_resource)
    else
      {
      id: @getId()
      title: @storageHandler.getMetadataHandler().getTarget().displayName
      tool: @storageHandler.getMetadataHandler().getGenerator().displayName
      modified: new Date(0)
      }
