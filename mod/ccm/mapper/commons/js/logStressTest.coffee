"use strict"

initialMetadata =  {
    "actor": {
      "objectType": "person",
      "id": "f25d7eff-8859-49ed-85e9-e7c1f92bc334",
      "displayName": "anonymized"
    },
    # describes the document/artefact/experiment
    "target": {
      "objectType": "dummy objectType",
      "id": "9383fbbe-e071-49b2-9770-46ddc4f8cd6e",
      "displayName": "dummy displayName"
    },
    # describes the application/tool
    "generator": {
      "objectType": "test",
      "url": "http://go-lab.gw.utwente.nl/experiments/...",
      "id": "04123e9e-14d0-447b-a851-805b9262d9a6",
      "displayName": "stress test tool"
    },
    # describes the context of an activity, e.g. an ILS
    "provider": {
      "objectType": "stresstest",
      "url": "http://go-lab.gw.utwente.nl/experiments/...",
      "id": "0f8184db-53ba-4868-9208-896c3d7c25bb",
      "displayName": "stresstest"
    }
  }

new golab.ils.metadata.MetadataHandler initialMetadata, (error, metadataHandler) ->

  # the actor needs to be set with information from e.g. a login-dialog
  # (username etc.)
  metadataHandler.setActor {
    "objectType": "person"
    "id": "f25d7eff-8859-49ed-85e9-e7c1f9212345"
    "displayName": "Stressor"
  }

  actionLogger = new ut.commons.actionlogging.ActionLogger metadataHandler
  #actionLogger.setLoggingTargetByName "console"
  #actionLogger.setLoggingTargetByName "consoleShort"
  # dufftown -> Duisburg
  actionLogger.setLoggingTargetByName "dufftown"

  for i in [1..1000]
    logObject = {
      "objectType": "stressObject",
      "id": ut.commons.utils.generateUUID(),
      "content": i
    }
    actionLogger.log("stress", logObject)