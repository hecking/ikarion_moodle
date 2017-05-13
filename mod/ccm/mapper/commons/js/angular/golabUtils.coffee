"use strict";

window.ut = window.ut || {}
ut.commons = ut.commons || {}

angular = window.angular

ut.commons.golabUtils = angular.module('golabUtils', [])

ut.commons.golabUtils.factory("browser",->
  # from http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
  testCSS = (prop)->
    prop of document.documentElement.style;
  # At least Safari 3+: "[object HTMLElementConstructor]"
  isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0
  browser = {
    isOpera: !!(window.opera && window.opera.version)  # Opera 8.0+
    isFirefox: testCSS('MozBoxSizing')                 # FF 0.8+
    isSafari: isSafari
    isChrome:  !isSafari && testCSS('WebkitTransform')  # Chrome 1+
    isIE: false || testCSS('msTransform')  # At least IE6
    isWebKit: testCSS('WebkitTransform')
  }
#  console.log("browser: " + JSON.stringify(browser))
  browser
)

getCssPixelValue = (element,cssName) ->
  value = element.css(cssName)
  parseInt(value)

ut.commons.golabUtils.factory("errorHandler", [ ->
  start = (actionLogger) ->
    window.onerror = (message, url ,line) ->
      showAlert = false
      showAlert = head.mobile
      if (showAlert)
        alert("Error: " + message + "\nurl: " + url + "\nline #: " + line)

      if (actionLogger)
        object = {
          objectType: "error"
          id:window.location.href
          content: {
            message: message
            url: url
            line: line
          }
        }
        actionLogger.log(actionLogger.verbs.error, object)

      suppressErrorAlert = false
      # If you return true, then error alerts (like in older versions of
      # Internet Explorer) will be suppressed.
      suppressErrorAlert
    console.log("Installed error handler")
  {
    start: start
  }
])



golabContainerDirective = ($timeout, languageHandler) ->
  {
  restrict: "E"
  scope: {
    containertitle: "@"
  }
  template: """
            <div class="golabContainer">
              <div class="golabContainerHeader">
                <img ng-src="{{minimizeImage}}" class="golabContainerMinimizeButton activeButton"
                  ng-click="toggleMinimize()" ng-show="showMinimize"/>
                <span class="golabContainerTitle">{{containertitle | i_g4i18n}}</span>
              </div>
              <div class="golabContainerContent">
                <div ng-transclude></div>
              </div>
            </div>
            """
  replace: true
  transclude: true
  link: (scope, element, attrs)->
    sizeComponentSelector = ut.commons.utils.getAttributeValue(attrs,"sizeComponent","")
    if (sizeComponentSelector)
      sizeComponent = element.find(sizeComponentSelector)
      if (sizeComponent && sizeComponent.length)
        if (sizeComponent.prop("tagName")=="TEXTAREA")
          sizeComponent.css("resize","none")
        scope.element = element
        oldHeight = element.height()
        adjustHeight = (newHeight)->
          #          console.log("#{scope.containertitle}.height(): #{newHeight}")
          sizeComponent.height(sizeComponent.height()+newHeight-oldHeight)
          oldHeight = newHeight
        $timeout(->
          currentHeight = element.height()
          if (oldHeight!=currentHeight)
            adjustHeight(currentHeight)
        ,200)
    scope.showMinimize = false
    scope.minimizeImage = ""
    minimizeDirection = ut.commons.utils.getAttributeValue(attrs,"minimize","").toLowerCase()
    minimizeClassExtension = ""
    minimizeVertical = false
    switch minimizeDirection
      when ""
        minimizeClassExtension = ""
      when "vertical"
        minimizeClassExtension = "Vertical"
        minimizeVertical = true
      when "horizontal"
        minimizeClassExtension = "Horizontal"
      else
        console.log("unknown minimize value: #{minimizeDirection}")
    if (minimizeClassExtension)
      scope.showMinimize = true
      golabContainer = element
      golabContainerHeader = golabContainer.find(".golabContainerHeader")
      golabContainerContent = golabContainer.find(".golabContainerContent")
      golabContainerTitle = golabContainer.find(".golabContainerTitle")
      minimized = false
      minimizeImage = "#{ut.commons.utils.commonsImagesPath}minimize.png"
      unminimizeImage = "#{ut.commons.utils.commonsImagesPath}unminimize.png"
      scope.minimizeImage = minimizeImage
      headerHeight = golabContainerHeader.height()
      contentHeight = golabContainerContent.height()
      containerHeight = golabContainer.height()
      scope.toggleMinimize = ->
        if (minimized)
          element.removeClass("golabContainerMinimized#{minimizeClassExtension}")
          golabContainerContent.removeClass("golabContainerContentMinimized")
          if (minimizeVertical)
            golabContainerTitle.removeClass("golabContainerTitleVertical")
            golabContainer.height(containerHeight)
          scope.minimizeImage = minimizeImage
        else
          containerHeight = golabContainer.height()
          element.addClass("golabContainerMinimized#{minimizeClassExtension}")
          golabContainerContent.addClass("golabContainerContentMinimized")
          if (minimizeVertical)
            contentHeight = golabContainerContent.height()
            golabContainerTitle.addClass("golabContainerTitleVertical")
            newContainerHeight = headerHeight+golabContainerTitle.width() - 1 +
              getCssPixelValue(golabContainerTitle,"padding-left")+getCssPixelValue(golabContainerTitle,"padding-right")
#            console.log("newContainerHeight: #{newContainerHeight}")
            golabContainer.height(newContainerHeight)
          scope.minimizeImage = unminimizeImage
        minimized = !minimized
  }

ut.commons.golabUtils.directive("golabcontainer", ["$timeout", "languageHandler", golabContainerDirective])

dummy = {
  dialogBoxes: []
  $root: null
}

dialogBoxDirective = ($timeout, languageHandler) ->
  {
  restrict: "E"
#  scope: {
#    title: "@"
#  }
  template: """
            <div ng-transclude class="dialogBoxContent"></div>
            """
  replace: true
  transclude: true
  link: (scope, element, attrs)->
    if (!scope.dialogBoxes)
      throw new Error("there must be a dialogBoxes property on the scope in order to use the dialogBox tag")
    if (!attrs["id"])
      throw new Error("id atrribute must be specified for dialogBox tag")
    id = attrs["id"]
    if (scope.dialogBoxes[id])
      throw new Error("duplicate id attribute (#{id}) of dialogBox tag")
    dialogBoxObject = {}
    scope.dialogBoxes[id] = dialogBoxObject

    dialogOptions = {
      beforeClose: (event, ui)->
        # make sure dialog elements are hided
        if (typeof scope["beforeCloseDialogBox"] == "function")
          scope.beforeCloseDialogBox(id)
        $timeout(->
          element.dialog("close")
        ,0)
    }
    addSpecifiedAttributeValue = (name, defaultValue)->
      lcName = name.toLowerCase()
      if (attrs[lcName])
        dialogOptions[name] = attrs[lcName]
      else if (defaultValue)
        dialogOptions[name] = defaultValue
    addSpecifiedAttributeValue("modal",true)
    addSpecifiedAttributeValue("title")
    addSpecifiedAttributeValue("resizable")
    addSpecifiedAttributeValue("width")
    addSpecifiedAttributeValue("height")

    if (dialogOptions.title)
      dialogOptions.title = languageHandler.getI_Message(dialogOptions.title)

    element.hide()

    if (typeof scope.$root.dialogBoxChangeCounter == "undefined")
      scope.$root.dialogBoxChangeCounter = 0
    incrementDialogBoxChangeCounter = ->
      scope.$root.dialogBoxChangeCounter++

    dialogBoxObject.show = ()->
#      console.log("dialogBox directive: show dialog #{id}")
      element.dialog(dialogOptions)
      incrementDialogBoxChangeCounter()
    dialogBoxObject.close = ()->
      console.log("dialogBox directive: close dialog #{id}")
      element.dialog("close")
      incrementDialogBoxChangeCounter()
  }

ut.commons.golabUtils.directive("dialogbox", ["$timeout", "languageHandler", dialogBoxDirective])

dummy = {
  questionParams: {}
  dialogBoxId: ""
  answer: ""
  okLabel: ""
  questionOkAnswer: null
  questionCancelAnswer: null
}

askQuestionDirective = ($timeout, languageHandler, $rootScope) ->
  $rootScope.askQuestion = {

  }
  {
  restrict: "E"
  template: """
            <div>
              <div ng-show='questionParams.question'>{{questionParams.question}}</div>
              <input ng-model="askQuestion.questionParams.answer" ng-show="showInput"/>
              <div class="dialogButtonRow">
                <button class="dialogButton" ng-click="ok()">{{okLabel}}</button>
                <button class="dialogButton" ng-click="cancel()">{{cancelLabel}}</button>
              </div>
            </div>
            """
  replace: true
  transclude: false
  link: (scope, element, attrs)->
    askQuestionOptions = {}
    addSpecifiedAttributeValue = (name, defaultValue)->
      lcName = name.toLowerCase()
      if (attrs[lcName])
        askQuestionOptions[name] = attrs[lcName]
      else if (defaultValue)
        askQuestionOptions[name] = defaultValue
    addSpecifiedAttributeValue("ok")
    addSpecifiedAttributeValue("cancel")
    if (askQuestionOptions.ok)
      askQuestionOptions.ok = languageHandler.getI_Message(askQuestionOptions.ok)
    if (askQuestionOptions.cancel)
      askQuestionOptions.cancel = languageHandler.getI_Message(askQuestionOptions.cancel)
    scope.okLabel = askQuestionOptions.ok
    scope.cancelLabel = askQuestionOptions.cancel
    scope.showInput = true
    updateState = ->
#      console.log("updateState #{JSON.stringify(scope.askQuestion.questionParams)}")
      if (scope.askQuestion.questionParams)
        if (typeof scope.askQuestion.questionParams.answer != "string")
          scope.showInput = false
        if (scope.askQuestion.questionParams.okLabel)
          scope.okLabel = scope.askQuestion.questionParams.okLabel
        if (scope.askQuestion.questionParams.cancelLabel)
          scope.cancelLabel = scope.askQuestion.questionParams.cancelLabel

    scope.elem = element
    scope.$watch("dialogBoxChangeCounter", () ->
#      console.log("dialogBoxChangeCounter changed")
      if (element.is(':visible'))
        updateState()
    )
    closeDialogBox = ->
      if (scope.askQuestion.questionParams.dialogBoxId)
        scope.dialogBoxes[scope.askQuestion.questionParams.dialogBoxId].close()
    scope.ok = ->
#      console.log("OK: #{scope.askQuestion.questionParams.answer}")
      if (scope.askQuestion.questionParams.questionOkAnswer)
        scope.askQuestion.questionParams.questionOkAnswer(scope.askQuestion.questionParams.answer)
      closeDialogBox()
    scope.cancel = ->
#      console.log("cancel: #{scope.askQuestion.questionParams.answer}")
      if (scope.askQuestion.questionParams.questionCancelAnswer)
        scope.askQuestion.questionParams.questionCancelAnswer()
      closeDialogBox()

  }

ut.commons.golabUtils.directive("askquestion", ["$timeout", "languageHandler", "$rootScope", askQuestionDirective])

g4i18nFilter = (languageHandler)->
  (key)->
#    console.log("key: #{key}")
    languageHandler.getMessage(arguments...)

ut.commons.golabUtils.filter("g4i18n",["languageHandler", g4i18nFilter])

i_g4i18nFilter = (languageHandler)->
  (key)->
#    console.log("key: #{key}")
    languageHandler.getI_Message(arguments...)

ut.commons.golabUtils.filter("i_g4i18n",["languageHandler", i_g4i18nFilter])

g4i18nDirective = (languageHandler) ->
  {
  restrict: "A"
  link: (scope, element, attrs)->
    key = attrs["g4i18n"]
    element.text(languageHandler.getMessage(key))
  }

ut.commons.golabUtils.directive("g4i18n",["languageHandler", g4i18nDirective])

durationFilter = ()->
  (millis)->
    numTo2DigitsString = (num)->
      if (num < 10)
        "0" + num
      else
        "" + num
    seconds = Math.floor(millis / 1000)
    hours = Math.floor(seconds / (60 * 60))
    secondsLeft = seconds - 60 * 60 * hours
    minutes = Math.floor(secondsLeft / 60)
    secondsLeft -= minutes * 60
    if (hours == 0)
      "#{minutes}:#{numTo2DigitsString(secondsLeft)}"
    else
      "#{hours}:#{numTo2DigitsString(minutes)}:#{numTo2DigitsString(secondsLeft)}"

ut.commons.golabUtils.filter("duration",[durationFilter])

