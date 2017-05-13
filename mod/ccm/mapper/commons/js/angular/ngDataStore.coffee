"use strict";

window.ut = window.ut || {}
ut.commons = ut.commons || {}

angular = window.angular

dummy = {
  loadDataFromJson: null
}

datastoreSelectionDirective = (localStorageService) ->
  {
  restrict: "E"
  template: """
            <table width="100%" border="0">
                <tr>
                    <td width="1%">
                        {{categoryLabel | i_g4i18n}}
                    </td>
                    <td>
                        <select ng-model="selectedCategory"
                                ng-options="category for category in dataStore.getCategories()">
                        </select>
                    </td>
                    <td rowspan='2' width="1%" valign="middle" align="right">
                      <i class="fa fa-play fa-fw activeButton fontAweSomeButton"
                              ng-class='{disabledButton:disableLoadButton}'
                                   ng-click='loadSeletedResource()'></i>
                    </td>
                </tr>
                <tr>
                    <td>
                        {{dataLabel | i_g4i18n}}
                    </td>
                    <td>
                        <select ng-model="selectedData" ng-options="data.title for data in getDatas()">
                        </select>
                    </td>
                </tr>
            </table>
            """
  replace: true
  link: (scope, element,attrs)->
    dataStoreName = ut.commons.utils.getAttributeValue(attrs,"dataStoreName")
    if (dataStoreName==null)
      throw new Error("attribute dataStoreName is not defined")
    scope.categoryLabel = "Category"
    if (attrs["categorylabel"])
      scope.categoryLabel = attrs["categorylabel"]
    scope.dataLabel = "Data"
    if (attrs["datalabel"])
      scope.dataLabel = attrs["datalabel"]
    scope.disableLoadButton = true
    uploadLoadButtonStatus = ->
      scope.disableLoadButton = !scope.selectedCategory or !scope.selectedData
    selectedCategoryStoreName = "#{dataStoreName}_selectedCategory"
    selectedDataTitleStoreName = "#{dataStoreName}_selectedDataTitle"
    if (!scope[dataStoreName])
      throw new Error("cannot find data store, named '#{dataStoreName}' on the scope")
    scope.dataStore = scope[dataStoreName]
    scope.selectedCategory = localStorageService.get(selectedCategoryStoreName)
    scope.selectedData = ""
    categories = scope.dataStore.getCategories()
    if (scope.selectedCategory)
      if (categories.indexOf(scope.selectedCategory)<0)
        scope.selectedCategory = ""
    if (!scope.selectedCategory && categories.length==1)
      scope.selectedCategory = categories[0]
    if (scope.selectedCategory)
      selectedDataTitle = localStorageService.get(selectedDataTitleStoreName)
      if (selectedDataTitle)
        selectedData = scope.dataStore.getData(scope.selectedCategory, selectedDataTitle)
      if (!selectedData)
        datas = scope.dataStore.getDatas(scope.selectedCategory)
        if (datas.length==1)
          selectedData = datas[0]
      if (selectedData)
        scope.selectedData = selectedData
    else
      scope.selectedCategory = ""

    scope.getDatas = ->
      scope.dataStore.getDatas(scope.selectedCategory)

    uploadLoadButtonStatus()
    initialized = false
    scope.$watch("selectedCategory", ->
      localStorageService.set(selectedCategoryStoreName, scope.selectedCategory)
      if (initialized)
        scope.selectedData = ""
      else
        initialized = true
      uploadLoadButtonStatus()
    )
    scope.loadSeletedResource = ->
      if (scope.selectedCategory && scope.selectedData)
        console.log("load data: category '#{scope.selectedCategory}', data '#{scope.selectedData.title}'")
        scope.dataStore.sendLoadEvent(scope.selectedData)
    scope.$watch("selectedData", ->
      localStorageService.set(selectedDataTitleStoreName, scope.selectedData.title)
      uploadLoadButtonStatus()
    )
  }

ut.commons.golabUtils.directive("datastoreselection", ["localStorageService", datastoreSelectionDirective])
