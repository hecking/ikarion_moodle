"use strict"

window.ut ?= {}
window.ut.commons ?= {}
window.ut.commons.actionlogging ?= {}

class window.ut.commons.actionlogging.ActionLogger

  constructor: () ->
    console.log("Initializing ActionLogger")
    console.log("...setting default logging target: nullLogging.")
    # the defaults...
    @loggingTarget = @nullLogging
    @actorId = "unknownActorId"
    @target = {
      "objectType": "unknownType",
      "id": "00000000-0000-0000-0000-000000000000",
      "displayName": "unnamed"
    }
    @generator = {
        "objectType": "unknownType",
        "url": "unknown",
        "id": "00000000-0000-0000-0000-000000000000"
    }
    @provider = {
        "objectType": "unknownType",
        "id": "00000000-0000-0000-0000-000000000000"
    }

  setActorId: (newActorId) ->
    @actorId = newActorId

  setLoggingTarget: (newLoggingTarget) ->
    @loggingTarget = newLoggingTarget

  setTarget: (newTarget) =>
    @target = newTarget

  setGenerator: (newGenerator) =>
    @generator = newGenerator

  setProvider: (newProvider) =>
    @provider = newProvider

  setLoggingTargetByName: (newLoggingTargetName) ->
    console.log "ActionLogger: setting logging target (by name) to #{newLoggingTargetName}"
    if newLoggingTargetName is "null" then @loggingTarget = @nullLogging
    else if newLoggingTargetName is "console" then @loggingTarget = @consoleLogging
    else if newLoggingTargetName is "consoleShort" then @loggingTarget = @consoleLoggingShort
    else if newLoggingTargetName is "dufftown" then @loggingTarget = @dufftownLogging
    else if newLoggingTargetName is "opensocial" then @loggingTarget = @opensocialLogging
    else
      console.log "ActionLogger: unknown logging target, setting to 'null'"
      @loggingTarget = @nullLogging

  log: (verb, object) =>
    # building ActivityStream object
    activityStreamObject = {}
    activityStreamObject.published = new Date().toISOString()
    # building actor object
    actorObject = {}
    actorObject.id = @actorId;
    actorObject.objectType = "person"
    activityStreamObject.actor = actorObject
    # attaching verb
    activityStreamObject.verb = verb
    # attaching object
    activityStreamObject.object = object
    # attaching target
    activityStreamObject.target = @target
    #attaching generator
    activityStreamObject.generator = @generator
    #attaching provder
    activityStreamObject.provider = @provider
    # ...and send it away
    @loggingTarget(activityStreamObject)

  nullLogging: (action) ->
    return

  consoleLogging: (activityStreamObject) ->
    console.log JSON.stringify(activityStreamObject, undefined, 2)

  consoleLoggingShort: (activityStreamObject) ->
    console.log "ActionLogger: #{activityStreamObject.verb} #{activityStreamObject.object.objectType}, id: #{activityStreamObject.object.id}"

  opensocialLogging: (activityStreamObject) ->
    if osapi isnt undefined
      logObject = {
        "userId": "@viewer",
        "groupId": "@self",
        activity: activityStreamObject
      }
      console.log "ActionLogger: logging to Graasp: #{activityStreamObject.verb} #{activityStreamObject.object.objectType}, id: #{activityStreamObject.object.id}"
      osapi.activitystreams.create(logObject).execute (response) ->
        if response.id isnt undefined
          console.log "ActionLogger: sucessfully logged via osapi, response.id: #{response.id}"
        else
          console.log "ActionLogger: something went wrong when logging via osapi:"
          console.log response
    else
      console.log "ActionLogger: can't log, osapi is undefined."

  dufftownLogging: (activityStreamObject) ->
    console.log "ActionLogger: logging to go-lab.collide.info: #{activityStreamObject.verb} #{activityStreamObject.object.objectType}, id: #{activityStreamObject.object.id}"
    $.ajax({
      type: "POST",
      #url: "http://dufftown.inf.uni-due.de/activity",
      url: "http://go-lab.collide.info/activity",
      data: JSON.stringify(activityStreamObject),
      contentType: "application/json",
      success: (responseData, textStatus, jqXHR) ->
        console.log("POST actionlog success, response: #{responseData.statusText}")
      error: (responseData, textStatus, errorThrown) ->
        console.log("POST actionlog failed, response: #{responseData.statusText}")
    })