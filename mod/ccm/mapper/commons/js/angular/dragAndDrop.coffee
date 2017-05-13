"use strict";

window.ut = window.ut || {}
ut.commons = ut.commons || {}

angular = window.angular

dropAllowedStateClass = "dropObjectOutSideDropArea"

startShowDropAllowedState = (element)->
  showDropNotAllowedState(element)

stopShowDropAllowedState = (element)->
  showDropAllowedState(element)

isDropped = (element)->
  !element.hasClass(dropAllowedStateClass)

showDropNotAllowedState = (element) ->
  element.addClass(dropAllowedStateClass) unless element.hasClass("ui-dialog")

showDropAllowedState = (element) ->
  element.removeClass(dropAllowedStateClass)

currentDragAndDropTransferObject = null

setDragAndDropTransferObject = (dragAndDropTransferObject)->
  currentDragAndDropTransferObject = dragAndDropTransferObject

getDragAndDropTransferObject = () ->
#  if (currentDragAndDropTransferObject)
#    console.log("found dragAndDropTransferObject!")
#  else
#    console.log("no dragAndDropTransferObject!")
  currentDragAndDropTransferObject

clearDragAndDropTransferObject = ->
  currentDragAndDropTransferObject = null
#  console.log("clearDragAndDropTransferObject")

collectDraggableInformation = (dropElement, element, attributes) ->
  dropObjectType = dropElement.attr("objectType")
  dropObjectId = dropElement.attr("objectId")
  dropAreaOffset = element.offset()
  objectOffset = dropElement.offset()
  objectDropLocation = {
    left: objectOffset.left - dropAreaOffset.left
    top: objectOffset.top - dropAreaOffset.top
  }
  info = {
    dropObjectType: dropObjectType
    dropObjectId: dropObjectId
    objectDropLocation: objectDropLocation
    dragAndDropTransferObject: getDragAndDropTransferObject()
  }
  if (attributes)
    dropTargetType = ut.commons.utils.getAttributeValue(attributes, "dropTargetType")
    if (dropTargetType)
      info.dropTargetType = dropTargetType
  info

dummy = {
  helper: null
  objectDraggingStarted: null
  objectDraggingStopped: null
  getDragAndDropTransferObject: null
  objectDroppedOutside: null
}

draggableDirective = () ->
  {
  restrict: "A"
  link: (scope, element, attrs)->
    dragOptions = {}
    addSpecifiedAttributeValue = (name, defaultValue)->
      lcName = name.toLowerCase()
      if (attrs[lcName])
        dragOptions[name] = attrs[lcName]
      else if (defaultValue)
        dragOptions[name] = defaultValue
    addSpecifiedAttributeValue("helper")
    addSpecifiedAttributeValue("revert")
    addSpecifiedAttributeValue("revertDuration")
    originalZIndex = null
    dragOptions.start = (event, ui)=>
      dropElement = angular.element(ui.helper)
      originalZIndex = dropElement.css("z-index")
      dragZIndex = 10
      dragZIndex += originalZIndex if typeof originalZIndex == "number"
      dropElement.css("z-index", dragZIndex)
      startShowDropAllowedState(dropElement)
      draggableInformation = collectDraggableInformation(dropElement, element)
      if (scope.objectDraggingStarted)
        scope.objectDraggingStarted(draggableInformation, dropElement)
        scope.$apply()
      if (scope.getDragAndDropTransferObject)
        setDragAndDropTransferObject(scope.getDragAndDropTransferObject(draggableInformation, dropElement))
    dragOptions.stop = (event, ui)=>
      dropElement = angular.element(ui.helper)
      dropped = isDropped(dropElement)
      dropElement.css("z-index", originalZIndex)
      stopShowDropAllowedState(dropElement)
      draggableInformation = collectDraggableInformation(dropElement, element)
      if (!dropped)
#          console.log("dropped outside drop area")
        if (scope.objectDroppedOutside)
          scope.objectDroppedOutside(draggableInformation, dropElement)
          scope.$apply()
      if (scope.objectDraggingStopped)
        scope.objectDraggingStopped(draggableInformation, dropElement)
      clearDragAndDropTransferObject()
    #      console.log("draggable stop")
    element.draggable(dragOptions)
    element.css("cursor", "move")
  }

ut.commons.golabUtils.directive("draggable", [draggableDirective])

dummy = {
  acceptObjectDrop: null
  objectDroppedInside: null
}

droppableDirective = () ->
  {
  restrict: "A"
  link: (scope, element, attrs)->
    objectEnter = (event, ui)->
      dropElement = angular.element(ui.helper)
      showDropAllowedState(dropElement)

    objectLeave = (event, ui)->
      dropElement = angular.element(ui.helper)
      showDropNotAllowedState(dropElement)

    acceptDrop = (draggableDirective)->
      # warning!: if draggable uses a clone, draggable is the orginal element, not the clone which is being dragged!
      if (scope.acceptObjectDrop)
        dropElement = angular.element(draggableDirective)
        scope.acceptObjectDrop(collectDraggableInformation(dropElement, element, attrs), dropElement, element)
      else
        true

    objectDropped = (event, ui)->
      dropElement = angular.element(ui.helper)
      if (scope.objectDroppedInside)
        dropResult = scope.objectDroppedInside(collectDraggableInformation(dropElement, element, attrs), dropElement,
          element)
        if (dropResult)
          event.stopPropagation()
      stopShowDropAllowedState(dropElement)
      scope.$apply()

    element.droppable({
      over: (event, ui)=>
        objectEnter(event, ui)
      out: (event, ui)=>
        objectLeave(event, ui)
      accept: (draggableDirective) ->
#        console.log("accept drop: " + acceptDrop(draggable))
        acceptDrop(draggableDirective)
      drop: (event, ui)->
        objectDropped(event, ui)
#        console.log("droppable dropped")
      tolerance: "pointer"
    })
  }

ut.commons.golabUtils.directive("droppable", [droppableDirective])
