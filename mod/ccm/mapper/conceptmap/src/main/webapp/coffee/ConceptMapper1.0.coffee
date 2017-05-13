"use strict"

window.ut = window.ut || {}
window.ut.tools = window.ut.tools|| {}
window.ut.tools.conceptmapper = window.ut.tools.conceptmapper || {}

class window.ut.tools.conceptmapper.ConceptMapper

  constructor: (@configuration, @metadataHandler, @storageHandler, @actionLogger, @languageHandler, @notificationClient) ->
    console.log("Initializing ConceptMapper1.0.")
    # set language strings
    $("#ut_tools_conceptmapper_toolbar_title").text(languageHandler.getMsg("ut_tools_conceptmapper_toolbar_title"))
    $("#ut_tools_conceptmapper_map_title").text(languageHandler.getMsg("ut_tools_conceptmapper_map_title"))
    $("#ut_tools_conceptmapper_concept_template_text p").text(languageHandler.getMsg("ut_tools_conceptmapper_concept_template_text"))
    $("#ut_tools_conceptmapper_concept_template_selector p").text(languageHandler.getMsg("ut_tools_conceptmapper_concept_template_selector"))
    $("#ut_tools_conceptmapper_concept_template_text").attr("title", languageHandler.getMsg("ut_tools_conceptmapper_concept_template_tooltip"))
    $("#ut_tools_conceptmapper_concept_template_selector").attr("title", languageHandler.getMsg("ut_tools_conceptmapper_concept_template_tooltip"))
    $("#ut_tools_conceptmapper_linkButton").attr("title", languageHandler.getMsg("ut_tools_conceptmapper_linkButton"))
    $("#ut_tools_conceptmapper_trashcan").attr("title", languageHandler.getMsg("ut_tools_conceptmapper_trashcan"))
    $("#ut_tools_conceptmapper_retrieve").attr("title", languageHandler.getMsg("ut_tools_conceptmapper_load_long"))
    $("#ut_tools_conceptmapper_store").attr("title", languageHandler.getMsg("ut_tools_conceptmapper_save_long"))

    @colorClasses = [
      "ut_tools_conceptmapper_blue",
      "ut_tools_conceptmapper_yellow",
      "ut_tools_conceptmapper_green",
      "ut_tools_conceptmapper_red",
      "ut_tools_conceptmapper_orange",
      "ut_tools_conceptmapper_grey"
    ]
    # keeps track of the current mode
    @LINK_MODE = "link_mode"
    @NODE_MODE = "node_mode"
    @mode = @NODE_MODE
    # flag to turn on/off logging, e.g. for loading
    @isCurrentlyLogging = true
    @sourceNode = undefined
    @targetNode = undefined
    @editingLabel = undefined
    @storage = undefined
    @configure(@configuration)
    @_init()
    # TODO what's the verb, here?
    logObject = {
      "objectType": "application",
      "id": @metadataHandler.getGenerator().id
    }
    #@_logAction("application_started", logObject)
    @_logAction("application_started", logObject)
    if @configuration["auto_load"].value is "true" then @_autoLoad()

    $("#ut_tools_conceptmapper_root").show()
    $("#ut_tools_conceptmapper_loadIcon").hide()

  _autoLoad: () =>
    @storageHandler.readLatestResource @metadataHandler.getTarget().objectType, (error, resource) =>
      if error?
        console.warn error.message
      else
        @setConceptMapFromResource(resource)

  configure: (newConfiguration) =>
    $.each newConfiguration, (id, settings) =>
      # overwrite @configuration with new settings
      @configuration[""+id].value = settings.value
      # for the following settings special actions are neccessary
      switch id
        when "actionlogging"
          @actionLogger.setLoggingTargetByName(settings.value)
        when "relations"
          # jsPlumb needs to be initialized again to have the correct default relation label
          @_initJsPlumb()
        when "textarea_concepts"
          $("#ut_tools_conceptmapper_toolbar_list").find(".ut_tools_conceptmapper_conceptTextarea").each (id, template) ->
            if settings.value is "false"
              $(template).hide()
            else
              $(template).show()
        when "combobox_concepts"
          $("#ut_tools_conceptmapper_toolbar_list").find(".ut_tools_conceptmapper_conceptSelector").each (id, template) ->
            if settings.value is "false"
              $(template).hide()
            else
              $(template).show()

  consumeNotification: (notification) =>
    if @configuration.debug.value is "true"
      console.log "ConceptMapper.consumeNotification: received notification: "
      console.log notification
    if notification.type is "prompt" and @configuration["show_prompts"].value is "true"
      $("#ut_tools_conceptmapper_dialog").text(notification.content.text)
      $("#ut_tools_conceptmapper_dialog").dialog {
        title: "Notification",
        resizable: false,
        modal: true,
        autoOpen: false,
        height: 300,
        closeOnEscape: false,
        dialogClass: "ut_tools_conceptmapper_dialog",
        buttons: {
          "Ok": () =>
            $("#ut_tools_conceptmapper_dialog").dialog("close")
        }
      }
      # open dialog now and remove focus from buttons
      $('#ut_tools_conceptmapper_dialog').dialog('open')
      $('.ui-dialog :button').blur()
    else if notification.type is "configuration"
      @configure(notification.content.configuration)
    else
      console.log "ConceptMapper: Notification wasn't a 'prompt' or prompting is disabled; doing nothing."

  _logAction: (verb, object) =>
    if @isCurrentlyLogging and @actionLogger
      @actionLogger.log(verb, object)

  _init: () =>
    # edge button
    $("#ut_tools_conceptmapper_linkButton").click () =>
      if @mode is @LINK_MODE
        @setMode(@NODE_MODE)
      else
        @setMode(@LINK_MODE)
    # load/save
    $("#ut_tools_conceptmapper_store").click @saveDialog
    $("#ut_tools_conceptmapper_retrieve").click @loadDialog
    # tooltips
    #$(".tiptip").tipTip {
    # defaultPosition: "right"
    #}
    @_initDnD()
    @_initJsPlumb()
    if @notificationClient?
      @notificationClient.register @notificationPremise, @consumeNotification
      console.log "ConceptMapper.init: notificationClient found and registered."
    else
      console.log "ConceptMapper.init: notificationClient not found."

  notificationPremise: (notification) =>
    # TODO do some filtering
    # return true only of e.g. targetId matches
    return true

  _initDnD: () =>
    # make the toolbar-concepts draggable
    $("#ut_tools_conceptmapper_toolbar .ut_tools_conceptmapper_concept").draggable({
      helper: "clone",
      cursor: "move",
      containment: "#ut_tools_conceptmapper_root"
    })
    $("#ut_tools_conceptmapper_map").bind 'dragover', (event) ->
      return false
    $("#ut_tools_conceptmapper_map").droppable()
    # handle the drop...
    $("#ut_tools_conceptmapper_map").bind 'drop', (event, ui) =>
      if (ui and $(ui.draggable).hasClass("ut_tools_hypothesis_condition"))
        return false
      else if (ui and $(ui.draggable).hasClass("ut_tools_conceptmapper_template"))
        if @configuration.debug.value is "true" then console.log("Concept template dropped. Clone and add to map.")
        if ($(ui.draggable).hasClass("ut_tools_conceptmapper_conceptTextarea"))
          @_createConcept(ut.commons.utils.generateUUID(), $(ui.draggable).text(), ui.position.left, ui.position.top, "ut_tools_conceptmapper_conceptTextarea")
        else if ($(ui.draggable).hasClass("ut_tools_conceptmapper_conceptSelector"))
          @_createConcept(ut.commons.utils.generateUUID(), $(ui.draggable).text(), ui.position.left, ui.position.top, "ut_tools_conceptmapper_conceptSelector")
      else if (event.originalEvent.dataTransfer)
        if @configuration.drop_external.value is "true"
          @_createConcept(ut.commons.utils.generateUUID(), event.originalEvent.dataTransfer.getData("Text"), event.originalEvent.clientX, event.originalEvent.clientY, "ut_tools_conceptmapper_conceptTextarea")
      return false
    # make the trashcan work
    $("#ut_tools_conceptmapper_trashcan").click @onClickHandlerTrashcan
    $("#ut_tools_conceptmapper_trashcan").droppable {
      accept: ".ut_tools_conceptmapper_concept",
      drop: (event, ui) =>
        @removeConcept(ui.draggable)
    }
    $("#ut_tools_conceptmapper_notification").click () =>
      notificationPrompt = {
        type: "prompt"
        content: {
          text: "The selection of pre-defined concepts has been changed."
        }
      }
      notificationConfiguration = {
        type: "configuration"
        content: {
          configuration: {
            concepts: {
              value: ["length", "mass", "time"]
            }
          }
        }
      }
      @consumeNotification(notificationPrompt)
      @consumeNotification(notificationConfiguration)
    $("#ut_tools_conceptmapper_settings").click () =>
      new ut.tools.conceptmapper.ConfigDialog @configuration, @configure

  _initJsPlumb: () =>
    jsPlumbDefaults = {
      Connector : [ "Bezier", { curviness:500 } ],
      ConnectorZIndex: 0,
      DragOptions : { cursor: "pointer", zIndex:2000 },
      PaintStyle : { strokeStyle:"#00b7cd" , lineWidth:4 },
      #EndpointStyle : { radius:5, fillStyle:"#00b7cd" },
      EndpointStyle : {},
      #HoverPaintStyle : {strokeStyle:"#92d6e3" },
      #EndpointHoverStyle : {fillStyle:"#92d6e3" },
      #EndpointHoverStyle : {},
      Anchor: [ "Perimeter", { shape:"Ellipse"} ],
      ConnectionOverlays: [
        [ "Arrow", { location:0.7 }, { foldback:0.7, fillStyle:"#00b7cd", width:20 }],
        [ "Label", { label: @configuration.relations.value[0], location:0.5, id:"label" }]
      ],
      Detachable:false,
      Reattach:false
    }
    jsPlumb.importDefaults jsPlumbDefaults
    jsPlumb.setRenderMode jsPlumb.SVG
    jsPlumb.unbind "jsPlumbConnection"
    jsPlumb.bind "jsPlumbConnection", (event) =>
      # new connection has been created
      event.connection.getOverlay("label").bind("click", @onClickHandlerConnectionLabel)
      # log
      object = {
        "objectType": "relation",
        "id": event.connection.id
        "content": event.connection.getOverlay("label").getLabel(),
        "source": event.connection.sourceId,
        "target": event.connection.targetId
      }
      @_logAction("add", object)

  initConceptMapDropHandler: () ->
    #decide whether the thing dragged in is welcome
    $("#ut_tools_conceptmapper_map").bind 'dragover', (ev) ->
      return false
    $("#ut_tools_conceptmapper_map").droppable()
    $("#ut_tools_conceptmapper_map").bind 'drop', (event, ui) ->
      if ui and $(ui.draggable).hasClass("ut_tools_hypothesis_condition")
        return false
      else if ui and $(ui.draggable).hasClass("ut_tools_conceptmapper_template")
        if @configuration.debug.value is "true" then console.log("Concept template dropped. Clone and add to map.")
      else if (event.originalEvent.dataTransfer)
        createConcept(ut.commons.utils.generateUUID(), event.originalEvent.dataTransfer.getData("Text"), event.originalEvent.clientX, event.originalEvent.clientY, "ut_tools_conceptmapper_conceptTextarea")
      return false

  setColor: (conceptId, colorClassName) =>
    if not conceptId?
      return
    else
      concept = $("##{conceptId}")
      if concept?
        if colorClassName?
          # remove the old color(s)
          for oldColor in @colorClasses
            concept.removeClass oldColor
          # set the new color
          concept.addClass colorClassName
        else
          concept.addClass "ut_tools_conceptmapper_blue"

  _createConcept: (id, conceptText, x, y, className, colorClassName) ->
    newConcept = $("<div>")
    newConcept.attr('id', id)
    newConcept.addClass("ut_tools_conceptmapper_concept")
    newConcept.append($('<p/>').html(nl2br(conceptText)))
    jsPlumb.draggable newConcept, {
      containment: "#ut_tools_conceptmapper_root",
      cursor: "move",
      revert: "invalid",
      iframeFix: true,
      delay: 50
    }
    newConcept.css('position', 'absolute');
    newConcept.css('top', y);
    newConcept.css('left', x);
    newConcept.addClass(className);
    if className is "ut_tools_conceptmapper_conceptTextarea"
      newConcept.click(@onClickHandlerInjectTextarea)
    else
      newConcept.click(@onClickHandlerInjectCombobox)
    $("#ut_tools_conceptmapper_map").append(newConcept)
    @setColor(id, colorClassName)
    if (@mode == @LINK_MODE) then @setConceptLinkMode(newConcept)
    else if (@mode == @LINK_MODE) then @setConceptNodeMode(newConcept)
    # logging
    logObject = {
      "objectType": "concept",
      "id": id,
      "content": conceptText
    }
    @_logAction("add", logObject)

  onClickHandlerInjectTextarea: (event) =>
    if @mode is @LINK_MODE
      # we are in link mode, delegate event
      @onClickEdgeHandler(event)
    #else if not $(event.target).is("div")
    else if $(event.target).is("p")
      # no textarea found -> replace paragraph with textarea
      @selectedConcept = $(event.currentTarget).attr("id")
      $p = $(event.target)
      # console.log $(event.currentTarget).attr("id")
      textarea = $('<textarea/>').val($p.text())
      @contentBeforeEdit = $p.text()
      textarea.autogrow()
      $p.replaceWith(textarea)
      textarea.on("blur", @onBlurHandlerInjectParagraph)
      @appendMenuButton(event.currentTarget)
      textarea.focus()

  appendMenuButton: (target) =>
    menuButton = $("<i class='fa fa-gear ut_tools_conceptmapper_menubutton'></i>")
    menu = []
    for color, index in @colorClasses
      colorItem = {
        '&nbsp': {
          className: color
          onclick: (menuItem,menu) =>
            # iterate over menuItems classes to find out which color to set
            classes = $(menuItem).attr('class').split(" ")
            for color in classes
              if $.inArray(color, @colorClasses) > -1
                @setColor(@selectedConcept, color)
                break
            return
        }
      }
      menu.push colorItem
    menu.push $.contextMenu.separator
    deleteItem = {}
    deleteItem[@languageHandler.getMsg("ut_tools_conceptmapper_delete")] = (menuItem,menu) =>
      @removeConcept $("##{@selectedConcept}")
      return
    menu.push deleteItem
    $(menuButton).contextMenu(menu, {leftClick: true, rightClick: true})
    $(target).append(menuButton)
    $(menuButton).show()

  onClickHandlerInjectCombobox: (event) =>
    if (@mode is @LINK_MODE)
      # we are in link mode, delegate event
      @onClickEdgeHandler(event)
    else if not $(event.target).is("div")
      # no input found -> replace paragraph with textarea
      @selectedConcept = $(event.currentTarget).attr("id")
      $p = $(event.target)
      inputField = $('<input/>').val($p.text())
      @contentBeforeEdit = $p.text()
      inputField.autocomplete {
        source: @configuration.concepts.value,
        minLength: 0
      }
      $p.replaceWith(inputField)
      inputField.blur(@onBlurHandlerInjectParagraph)
      inputField.autocomplete('search', '')
      @appendMenuButton(event.currentTarget)
      inputField.focus()

  onClickHandlerConnectionLabel: (label) =>
    if $("#"+label.canvas.id).find("input").length
      # the combobox has already been created,
      # open the search fields
      $("#"+label.canvas.id).find("input").autocomplete('search', '')
    else
      @editingLabel = label
      inputField = $('<input/>').val(@editingLabel.getLabel())
      @labelBeforeEdit = @editingLabel.getLabel()
      inputField.autocomplete {
        source: @configuration.relations.value,
        minLength: 0
      }
      # empty the div
      $("#"+label.canvas.id).text("")
      # and inject the input field / selector
      inputField.addClass("_jsPlumb_overlay")
      inputField.css("text-align","left")
      inputField.css("font-size", "medium")
      $("#"+label.canvas.id).append(inputField)
      inputField.blur(@onBlurHandlerInjectRelation)
      inputField.autocomplete('search', '')
      inputField.focus()
      jsPlumb.repaintEverything()

  onBlurHandlerInjectRelation: (event) =>
    newLabel = nl2br($(event.target).val())
    @editingLabel.setLabel(newLabel)
    $(event.target).parent().text(@editingLabel.getLabel())
    $(event.target).remove()
    # @editingLabel = null;
    # repaint the links, as the size of the concept element might have changed
    jsPlumb.repaintEverything()
    if newLabel isnt @labelBeforeEdit
      object = {
        "objectType": "relation",
        "id": @editingLabel.component.id
        "content": newLabel
      }
      @_logAction("update", object)
    @labelBeforeEdit = ""
    @editingLabel = undefined

  onBlurHandlerInjectParagraph: (event) =>
    # replace the input element (e.g. textArea) with paragraph
    inputElement = $(event.target)
    newContent = nl2br(inputElement.val())
    p = $('<p/>').html(newContent)
    inputElement.replaceWith(p)
    $(".ut_tools_conceptmapper_menubutton").remove()
    # repaint the links, as the size of the concept element might have changed
    jsPlumb.repaintEverything()
    # log
    if (newContent isnt @contentBeforeEdit)
      object = {
        "objectType": "concept",
        "id": p.parent().attr("id"),
        "content": newContent
      }
      @_logAction("update", object)
    @contentBeforeEdit = ""

  removeConcept: (concept) =>
    id = $(concept).attr("id")
    if id?
      @deleteConnectionsBetween(id)
      $(concept).fadeOut 300, =>
        $(concept).remove()
        # log
        object = {
          "objectType": "concept",
          "id": id
        }
        @_logAction("delete", object)

  onClickHandlerTrashcan: () =>
    $("#ut_tools_conceptmapper_dialog").text(@languageHandler.getMsg("ut_tools_conceptmapper_trash_question"))

    buttons = {}
    buttons[@languageHandler.getMsg("ut_tools_conceptmapper_yes")] = () =>
      @deleteAll()
      $("#ut_tools_conceptmapper_dialog").dialog("close")
    buttons[@languageHandler.getMsg("ut_tools_conceptmapper_no")] = () =>
      $("#ut_tools_conceptmapper_dialog").dialog("close")

    $("#ut_tools_conceptmapper_dialog").dialog {
      title: @languageHandler.getMsg("ut_tools_conceptmapper_trash_title")
      resizable: false
      modal: true
      autoOpen: false
      height: 110
      #position: position: { my: "center", at: "center"},
      closeOnEscape: false
      #open: (event, ui) ->
      #beforeclose: (event, ui) -> false
      dialogClass: "ut_tools_conceptmapper_dialog"
      buttons: buttons
    }
    # open dialog now and remove focus from buttons
    $('#ut_tools_conceptmapper_dialog').dialog('open')
    $('.ui-dialog :button').blur()

  deleteAll: () =>
    $.each $("#ut_tools_conceptmapper_map .ut_tools_conceptmapper_concept"), (index, concept) =>
      @removeConcept(concept)

  setMode: (newMode) ->
    if (newMode is @mode)
      # if the new mode is actually not new, do nothing...
      return
    else
      switch newMode
        when @NODE_MODE
          $("#ut_tools_conceptmapper_map").find(".ut_tools_conceptmapper_concept").each (index, concept) => @setConceptNodeMode(concept)
          $(".ut_tools_conceptmapper_template").removeClass("ut_tools_conceptmapper_lowLight")
          $("#ut_tools_conceptmapper_linkButton").removeClass("pressedButton")
          $("#ut_tools_conceptmapper_linkButton").addClass("activeButton")
          jsPlumb.unmakeEverySource()
          jsPlumb.unmakeEveryTarget()
          $(@sourceNode).removeClass("highlight_concept")
          $(@targetNode).removeClass("highlight_concept")
          @sourceNode = undefined
          @targetNode = undefined
          @mode = newMode
        when @LINK_MODE
          $("#ut_tools_conceptmapper_map").find(".ut_tools_conceptmapper_concept").each (index, concept) => @setConceptLinkMode(concept)
          # $("#ut_tools_conceptmapper_map").find(".ut_tools_conceptmapper_concept").draggable("disable")
          $(".ut_tools_conceptmapper_template").addClass("ut_tools_conceptmapper_lowLight")
          $("#ut_tools_conceptmapper_map").find(".ut_tools_conceptmapper_concept").css("opacity","1.0")
          $("#ut_tools_conceptmapper_linkButton").addClass("pressedButton")
          $("#ut_tools_conceptmapper_linkButton").removeClass("activeButton")
          @mode = newMode
        else
          console.log("ConceptMapper.setMode: unrecognized mode #{newMode} doing nothing.")

  setConceptNodeMode: (concept) =>
    $(concept).draggable("enable")

  setConceptLinkMode: (concept) =>
    $(concept).draggable("disable")
    jsPlumb.makeSource concept, {}
    jsPlumb.makeTarget concept, {
      dropOptions:{ hoverClass:"jsPlumbHover" },
      beforeDrop: (params) =>
        if (params.sourceId is params.targetId)
          if @configuration.debug.value is "true" then console.log "Creating edges between same source and target is disallowed."
          return false
        else
          if @connectionExists(params.sourceId, params.targetId)
            if @configuration.debug.value is "true" then console.log "An edge between concepts already exists -> delete it (instead of create a new one)."
            @deleteConnectionsBetween(params.sourceId, params.targetId)
            return false
          else
            if @configuration.debug.value is "true" then console.log "All conditions met, create a new edge."
            return true
    }

  onClickEdgeHandler: (event) =>
    if @sourceNode is undefined
      @sourceNode = event.currentTarget
      $(@sourceNode).toggleClass("highlight_concept")
    else
      if event.currentTarget is @sourceNode
        $(event.currentTarget).toggleClass("highlight_concept")
        @sourceNode = undefined
      else
        @targetNode = event.currentTarget
    if (@sourceNode isnt undefined) and (@targetNode isnt undefined)
      sourceId = $(@sourceNode).attr("id")
      targetId = $(@targetNode).attr("id")
      if @connectionExists(sourceId, targetId)
        @deleteConnectionsBetween(sourceId, targetId)
      else
        if @configuration.debug.value is "true" then console.log "Connection does not exist -> create."
        #connection = jsPlumb.connect({source:@sourceNode, target:@targetNode})
        connection = jsPlumb.connect({source:sourceId, target:targetId})
        #connection.getOverlay("label").setLabel(@configuration.relations[0])
      $(@sourceNode).removeClass("highlight_concept")
      $(@targetNode).removeClass("highlight_concept")
      @sourceNode = undefined
      @targetNode = undefined
      jsPlumb.repaintEverything()

  connectionExists: (sourceId, targetId) =>
    existingConnections = jsPlumb.getConnections {source:sourceId, target:targetId}
    existingConnections = existingConnections.concat jsPlumb.getConnections({source:targetId, target:sourceId})
    return existingConnections.length > 0

  deleteConnectionsBetween: (sourceId, targetId) =>
    connections = jsPlumb.getConnections({source:sourceId, target:targetId})
    connections = connections.concat jsPlumb.getConnections({source:targetId, target:sourceId})
    for connection in connections
      jsPlumb.detach(connection)
      #log
      object = {
        "objectType": "relation",
        "id": connection.id
      }
      @_logAction("delete", object)

  getConceptMapContentAsJSON: () =>
    conceptMap = {}
    # create the nodes
    concepts = []
    $.each $("#ut_tools_conceptmapper_map .ut_tools_conceptmapper_concept"), (index, node) =>
      concept = {}
      concept.x = $(node).offset().left
      concept.y = $(node).offset().top
      concept.content = $(node).find("p").text()
      concept.id = $(node).attr("id")
      if $(node).hasClass("ut_tools_conceptmapper_conceptSelector")
        concept.type = "ut_tools_conceptmapper_conceptSelector"
      else
        concept.type = "ut_tools_conceptmapper_conceptTextarea"
      for color in @colorClasses
        if $(node).hasClass color
          concept.colorClass = color
          break
      concepts.push(concept)
    conceptMap.concepts = concepts
    # create the edges
    relations = [];
    for connection in jsPlumb.getConnections()
      relation = {}
      relation.source = connection.sourceId
      relation.target = connection.targetId
      relation.id = connection.id
      relation.content = connection.getOverlay("label").getLabel()
      relations.push(relation)
    conceptMap.relations = relations
    conceptMap

  getConceptMapAsJSon: () ->
    conceptMap = {}
    conceptMap.meta = @meta
    # create the nodes
    concepts = []
    $.each $("#ut_tools_conceptmapper_map .ut_tools_conceptmapper_concept"), (index, node) ->
      concept = {}
      concept.x = $(node).offset().left
      concept.y = $(node).offset().top
      concept.content = $(node).find("p").text()
      concept.id = $(node).attr("id")
      if $(node).hasClass("ut_tools_conceptmapper_conceptSelector")
        concept.type = "ut_tools_conceptmapper_conceptSelector"
      else
        concept.type = "ut_tools_conceptmapper_conceptTextarea"
      concepts.push(concept)
    conceptMap.concepts = concepts
    # create the edges
    relations = [];
    for connection in jsPlumb.getConnections()
      relation = {}
      relation.source = connection.sourceId
      relation.target = connection.targetId
      relation.id = connection.id
      relation.content = connection.getOverlay("label").getLabel()
      relations.push(relation)
    conceptMap.relations = relations
    return conceptMap

  loadConceptMap: (resourceId) =>
    @storageHandler.readResource resourceId, (error, resource) =>
      if resource
        @setConceptMapFromResource(resource)
      else
        console.warn error

  setConceptMapFromResource: (resource) =>
    if resource.metadata.target.objectType is "conceptMap"
      @setConceptMapFromJSON(resource.content)
      @metadataHandler.setMetadata(resource.metadata)
    else
      alert("Could not load this resource.\nIs it really a concept map file?")

  loadDialog: () =>
    $("#ut_tools_conceptmapper_dialog").text(@languageHandler.getMsg("ut_tools_conceptmapper_load_question"))
    buttons = {}
    buttons[@languageHandler.getMsg("ut_tools_conceptmapper_load")] = () =>
      try
        if @debug then console.log "loading: #{$("#ut_tools_conceptmapper_select").val()}"
        @loadConceptMap $("#ut_tools_conceptmapper_select").val()
        @_logAction("load", @metadataHandler.getTarget())
      catch error
        console.log "error loading concept map: #{error}"
      finally
        $("#ut_tools_conceptmapper_dialog").dialog("close")
    buttons[@languageHandler.getMsg("ut_tools_conceptmapper_cancel")] = () =>
      $("#ut_tools_conceptmapper_dialog").dialog("close")
    $("#ut_tools_conceptmapper_dialog").dialog {
      title: @languageHandler.getMsg("ut_tools_conceptmapper_load_long")
      resizable: false,
      modal: true,
      autoOpen: false,
      height: 160,
      width: 400,
      closeOnEscape: false,
      dialogClass: "ut_tools_conceptmapper_dialog",
      buttons: buttons
    }
    selector = '<br><br><form><fieldset><label for="name">Name:&nbsp;&nbsp;</label><select id="ut_tools_conceptmapper_select" name="name">'
    # TODO check if there are resources at all
    @storageHandler.listResourceMetaDatas (error, metadatas) =>
      if error
        console.warn error
      else
        for entry in metadatas
          selector = selector + "<option value='#{entry.id}'>#{entry.metadata.target.displayName}</option>"
        selector = selector + '</fieldset></form>'
        $('#ut_tools_conceptmapper_dialog').append selector
        # open dialog now and remove focus from buttons
        $('#ut_tools_conceptmapper_dialog').dialog('open')
        $('.ui-dialog :button').blur()

  saveDialog: () =>
    $("#ut_tools_conceptmapper_dialog").text(@languageHandler.getMsg("ut_tools_conceptmapper_save_question"))
    buttons = {}
    buttons[@languageHandler.getMsg("ut_tools_conceptmapper_save")] = () =>
      @saveConceptMap $("#ut_tools_conceptmapper_name").val()
      $("#ut_tools_conceptmapper_dialog").dialog("close")
    buttons[@languageHandler.getMsg("ut_tools_conceptmapper_cancel")] = () =>
      $("#ut_tools_conceptmapper_dialog").dialog("close")
    $("#ut_tools_conceptmapper_dialog").dialog {
      title: @languageHandler.getMsg("ut_tools_conceptmapper_save_long")
      resizable: false,
      modal: true,
      autoOpen: false,
      height: 160,
      width: 400,
      closeOnEscape: false,
      dialogClass: "ut_tools_conceptmapper_dialog",
      buttons: buttons
    }
    $('#ut_tools_conceptmapper_dialog').append('<br><br><fieldset><label for="name">Name:&nbsp;&nbsp;</label><input type="text" id="ut_tools_conceptmapper_name" name="name" value="my concept map"></fieldset>')
    # open dialog now and remove focus from buttons
    $('#ut_tools_conceptmapper_dialog').dialog('open')
    $('.ui-dialog :button').blur()

  saveConceptMap: (name) =>
    @metadataHandler.setTargetDisplayName(name)
    map = @getConceptMapContentAsJSON()
    @storageHandler.createResource map, (error, resource) =>
      if error
        console.warn error
      else
        @_logAction("save", @metadataHandler.getTarget())

  setConceptMapFromJSON: (conceptMap) =>
    @isCurrentlyLogging = false
    # delete everything
    @deleteAll()
    #@meta = conceptMap.meta
    # create the nodes
    for concept in conceptMap.concepts
      @_createConcept(concept.id, concept.content, concept.x, concept.y, concept.type, concept.colorClass)
    # create the edges
    for relation in conceptMap.relations
      connection = jsPlumb.connect({source:relation.source, target:relation.target})
      connection.id = relation.id
      connection.getOverlay("label").setLabel(relation.content)
    @isCurrentlyLogging = true
    jsPlumb.repaintEverything()
