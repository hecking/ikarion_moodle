"use strict";

@golab = @golab || {}
@golab.common = @golab.common || {}

if (false)
  document = document || {}
  document.URL = document.URL || {}
  window.location = window.location || {}

createEnvironmentHandlers = (documentType, toolName, desiredLanguage, callBack)->
  recievedMetadataHandler = null
  recievedLanguageHandler = null

  checkForReady = ->
    if (recievedMetadataHandler && recievedLanguageHandler)
      storageHandler = new window.golab.ils.storage.LocalStorageHandler(recievedMetadataHandler)
      actionLogger = new window.ut.commons.actionlogging.ActionLogger(recievedMetadataHandler)
      notificationClient = new window.ude.commons.NotificationClient(recievedMetadataHandler)
      callBack(recievedMetadataHandler, storageHandler, actionLogger, recievedLanguageHandler, notificationClient)

  metadataHandlerCallback = (error, metadataHandler)->
    if (error)
      console.error("failed to create metadataHandler: #{error}")
    else
      recievedMetadataHandler = metadataHandler
      checkForReady()

  languageHandlerCallBack = (error, languageHandler)->
    if (error)
      console.error("failed to create languageHandler: #{error}")
      recievedLanguageHandler = "none"
      checkForReady()
    else
      recievedLanguageHandler = languageHandler
      checkForReady()

  new window.golab.ils.metadata.GoLabMetadataHandler({
      # setting initial/default metadata
      "actor":
        "objectType": "person"
        "id": "user_123"
        "displayName": "Jon Doe"
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
        "id": ut.commons.utils.generateUUID()
        "inquiryPhase": "unknown"
        "displayName": "unknown"
    }, metadataHandlerCallback)
  window.golab.createLanguageHandler(desiredLanguage, languageHandlerCallBack)

@golab.common.createEnvironmentHandlers = createEnvironmentHandlers
