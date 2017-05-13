"use strict";

window.ut = window.ut || {}
ut.commons = ut.commons || {}

angular = window.angular

dummy = {
  objectType: null
  loadResource: null
  storageHandler: null
}

resourcesListDirective = ()->
  {
  restrict: "E"
  template: """
              <table class="resourceTable">
                <tbody>
                  <tr class="resourceTableHeader">
                    <th ng-click="changeSorting('title')">{{ titleLabel | i_g4i18n}}</th>
                    <th ng-click="changeSorting('tool')">{{ toolLabel | i_g4i18n}}</th>
                    <th ng-click="changeSorting('modified')">{{ dateLabel | i_g4i18n}}</th>
                  </tr>
                  <tr ng-repeat="resourceDescription in resourceDescriptions | orderBy:sort.column:sort.descending"
                      class="resourceTableRow" ng-class="{resourceTableRowSelected:selectedResourceId==resourceDescription.id}"
                      ng-click="resourceSelected(resourceDescription.id)" Xng-hide="hideContent">
                    <td>{{resourceDescription.title}}</td>
                    <td class="noWrap">{{resourceDescription.tool}}</td>
                    <td class="noWrap">{{resourceDescription.modified | date:"short"}}</td>
                  </tr>
                </tbody>
              </table>
            """
  replace: true
  scope: true
  link: (scope, element, attrs)->
    scope.hideContent = attrs["hidecontent"]=="true"
  }

ut.commons.golabUtils.directive("resourceslist", [resourcesListDirective])


resourceSelectionDirective = ()->
  {
  restrict: "E"
  template: """
            <div style="relative">
              <div class="resourceTableContent">
                <resourcesList></resourcesList>
              </div>
              <div class="resourceTableHeader">
                <resourcesList hideContent="true"></resourcesList>
              </div>
              <div class="pleaseWaitIcon" style="display: block" ng-show="retrievingResourceList"></div>
              <div class="dialogButtonRow">
                 <i class="fa fa-refresh fa-fw activeButton fontAweSomeButton dialogButton" ng-click='reload()' class=""></i>
                 <i class="fa fa-folder-open-o fa-fw activeButton fontAweSomeButton dialogButton" ng-class="{disabledButton: selectedResourceId==''}" ng-click='load()' class=""></i>
              </div>
            </div>
            """
  replace: true
  link: (scope, element, attrs)->
    resourceType = ""
    if (attrs["resourcetype"])
      resourceType = attrs["resourcetype"]
    i18nBaseKey = ""
    if (attrs["g4i18nbasekey"])
      i18nBaseKey = attrs["g4i18nbasekey"]
    if (i18nBaseKey)
      scope.titleLabel = "i_#{i18nBaseKey}.title"
      scope.toolLabel = "i_#{i18nBaseKey}.tool"
      scope.dateLabel = "i_#{i18nBaseKey}.date"
    else
      scope.titleLabel = "title"
      scope.toolLabel = "tool"
      scope.dateLabel = "date"
    scope.elem = element
    scope.retrievingResourceList = false
    scope.resourceDescriptions = []
    scope.selectedResourceId = ""
    updateResourceList = (metadatas)->
      filterResourceType = (metadata)->
        if (resourceType)
          metadata.target.objectType == resourceType
        else
          true
      scope.resourceDescriptions = for id,onlyMetadata of metadatas when filterResourceType(onlyMetadata.metadata)
        scope.storageHandler.getResourceDescription(onlyMetadata)
      scope.retrievingResourceList = false
#      console.log("found #{scope.resourceDescriptions.length} #{resourceType}")
      scope.$apply()

    updateResources = ->
      scope.retrievingResourceList = true
      scope.storageHandler.listResourceMetaDatas((error, onlyMetadatas)->
        if (error)
          alert("Problems with getting the list of resources:\n#{error}")
          scope.retrievingResourceList = false
        else
          updateResourceList(onlyMetadatas)
#          setTimeout(->
#            updateResourceList(onlyMetadatas)
#          , 2000)
      )

    scope.$watch("dialogBoxChangeCounter", () ->
      if (element.is(':visible'))
        updateResources()
    )

    scope.reload = ->
      updateResources()
    scope.resourceSelected = (id) ->
    scope.load = ->
      if (scope.selectedResourceId && scope.loadResource)
#        console.log("should now load #{scope.selectedResourceId}")
        scope.storageHandler.readResource(scope.selectedResourceId, (error, resource)->
          if (error)
            alert("Problems with reading the resource, with id #{scope.selectedResourceId}:\n#{error}")
          else
            if (resource)
              scope.loadResource(resource)
        )
    scope.resourceSelected = (id) ->
#      console.log("resourceSelected(#{id})")
      scope.selectedResourceId = id
  }

ut.commons.golabUtils.directive("resourceselection", [resourceSelectionDirective])
