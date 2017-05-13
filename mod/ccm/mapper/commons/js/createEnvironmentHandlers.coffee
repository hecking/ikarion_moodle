"use strict";

@golab = @golab || {}
@golab.common = @golab.common || {}

if (false)
  document = document || {}
  document.URL = document.URL || {}
  window.location = window.location || {}

runningInGraasp = window.gadgets?

createEnvironmentHandlers = (documentType, toolName, desiredLanguage, callBack)->
  receivedMetadataHandler = null
  receivedLanguageHandler = null

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

  findDesiredLoggingTarget = ->
    if (runningInGraasp)
      "opensocial"
    else
      loggingTargetFromUrl = getParameterFromUrl("loggingTarget")
      if (loggingTargetFromUrl)
        loggingTargetFromUrl
      else
        "null"

  findDesiredNotificationServer = ->
    notificationServerFromUrl = getParameterFromUrl("notificationServer")
    if (notificationServerFromUrl)
      notificationServerFromUrl
    else
      null

  findDesiredStorageServer = ->
    storage = getParameterFromUrl("storageServer")
    if (storage)
      storage
    else
      null

  checkForReady = ->
    if (receivedMetadataHandler && receivedLanguageHandler)
      storageUrl = "local"
      desiredStorageUrl = findDesiredStorageServer()
      if (desiredStorageUrl)
        switch (desiredStorageUrl.toLocaleLowerCase())
          when "tomtest"
            storageUrl = "http://tomtest.gw.utwente.nl:8080"
          when "local"
          else
            storageUrl = desiredStorageUrl
      if (storageUrl=="local")
        storageHandler = new window.golab.ils.storage.LocalStorageHandler(receivedMetadataHandler)
      else
        storageHandler = new window.golab.ils.storage.MongoStorageHandler(receivedMetadataHandler, storageUrl)
      actionLogger = new window.ut.commons.actionlogging.ActionLogger(receivedMetadataHandler)
      notificationClient = new window.ude.commons.NotificationClient(receivedMetadataHandler, findDesiredNotificationServer())
      actionLogger.setLoggingTarget(findDesiredLoggingTarget())
      callBack(receivedMetadataHandler, storageHandler, actionLogger, receivedLanguageHandler, notificationClient)

  metadataHandlerCallback = (error, metadataHandler)->
    if (error)
      console.error("failed to create metadataHandler: #{error}")
    else
      receivedMetadataHandler = metadataHandler
      checkForReady()

  languageHandlerCallBack = (error, languageHandler)->
    if (error)
      console.error("failed to create languageHandler: #{error}")
      receivedLanguageHandler = "none"
      checkForReady()
    else
      receivedLanguageHandler = languageHandler
      checkForReady()

  # setting initial/default metadata
  metadata = {
    "actor":
      "objectType": "person"
      "id": "unknown"
      "displayName": "unknown"
    "target":
      "objectType": documentType
      "id": ut.commons.utils.generateUUID()
      "displayName": "unnamed #{documentType}"
    "generator":
      "objectType": "application",
      "url": window.location.href,
      "id": ut.commons.utils.generateUUID()
      "displayName": toolName
    "provider":
      "objectType": "ils",
      "url": window.location.href,
      "id": "unknown"
      "inquiryPhase": "unknown"
      "displayName": "unknown"
  }
  runningInGraasp = window.gadgets?
  if (runningInGraasp)
    new window.golab.ils.metadata.GoLabMetadataHandler(metadata, metadataHandlerCallback)
  else
    new window.golab.ils.metadata.LocalMetadataHandler(metadata, metadataHandlerCallback)
  window.golab.createLanguageHandler(desiredLanguage, languageHandlerCallBack)

@golab.common.createEnvironmentHandlers = createEnvironmentHandlers
