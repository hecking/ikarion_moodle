"use strict"

window.ut = window.ut || {}
window.ut.tools = window.ut.tools|| {}
window.ut.tools.conceptmapper = window.ut.tools.conceptmapper || {}

class window.ut.tools.conceptmapper.ConfigDialog

  constructor: (currentConfiguration, configurationCallback) ->
    #TODO take existing dialog or create new one
    if $(document.body).find("#ut_tools_conceptmapper_ConfigDialog").length is 0
      # create a new element to contain the dialog
      $dialogElement = $("<div id='ut_tools_conceptmapper_ConfigDialog'/>")
      $dialogElement.hide()
      $(document.body).append $dialogElement
    else
      # take the existing dialog element
      $dialogElement = $(document.body).find("#ut_tools_conceptmapper_ConfigDialog")
      $dialogElement.empty()
    $fieldset = $("<fieldset/>")
    # put together the dialog from the settings
    $.each currentConfiguration, (id, setting) =>
      $input
      if setting.type is "boolean"
        $input = $("<input type='checkbox' name='#{id}'> #{setting.label}</input>")
        if setting.value is "true"
          $input.attr("checked", "checked")
        $fieldset.append $input
      else if setting.type is "array" or setting.type is "string"
        $input = $("<input type='text' name='#{id}'></input>")
        $input.val setting.value
        $fieldset.append "<label for='#{id}'>#{setting.label}</label>"
        $fieldset.append $input
      else
        $input = $("<input type='text' name='#{id}'></input>")
        $fieldset.append "<label for='#{id}'>#{setting.label}</label>"
        $fieldset.append $input
      $input.attr("title", "#{setting.description}.")
      if setting.configurable is "false"
        $input.attr("readonly", true)
      $fieldset.append "<br/>"
    $form = $("<form/>")
    $form.append $fieldset
    $dialogElement.append($form)
    # show the dialog on screen
    $("#ut_tools_conceptmapper_ConfigDialog").dialog {
      title: "Tool configuration",
      resizable: false,
      modal: true,
      autoOpen: true,
      #height: 300,

    #position: position: { my: "center", at: "center"},
      closeOnEscape: false,
    #open: (event, ui) ->
    #beforeclose: (event, ui) -> false
      dialogClass: "ut_tools_conceptmapper_dialog",
      buttons: {
        "Ok": () =>
          #$fieldset.find("input[type='checkbox']").each (index, input) =>
          #  console.log $(input).is(':checked')
          #  currentConfiguration["#{$(input).attr('name')}"].value = $(input).is(':checked').toString()
          $.each currentConfiguration, (id, settings) =>
            #console.log "id: #{id}, value: #{settings.value}"
            if settings.type is "boolean"
              $fieldset.find("input[name='#{id}']").each (index, input) =>
                currentConfiguration["#{id}"].value = $(input).is(':checked').toString()
            if settings.type is "array"
              $fieldset.find("input[name='#{id}']").each (index, input) =>
                currentConfiguration["#{id}"].value = $(input).val().split(",")
            if settings.type is "string"
              $fieldset.find("input[name='#{id}']").each (index, input) =>
                currentConfiguration["#{id}"].value = $(input).val()

          configurationCallback(currentConfiguration)
          $("#ut_tools_conceptmapper_ConfigDialog").dialog("close")

        "Cancel": () =>
          $("#ut_tools_conceptmapper_ConfigDialog").dialog("close")
      }
    }


#-----------------------------------------------------
window.ut.tools.conceptmapper.defaultConfiguration = {

  debug: {
      label: "Debug mode?"
      description: "Turns on/off verbose console messages."
      type: "boolean"
      value: "true"
      configurable: "true"
  }
  actionlogging: {
    label: "actionlogging"
    description: "Configures the action logging target."
    type: "string"
    value: "consoleShort"
    #value: "console"
    #value: "dufftown"
    #value: "opensocial"
    configurable: "true"
  }
  show_prompts: {
    label: "Show prompts?"
    description: "Are incoming prompts and notifications shown as a pop-up message?"
    type: "boolean"
    value: "true"
    configurable: "true"
  }
  textarea_concepts: {
    label: "Show text input?"
    description: "Is the user allowed to freely create and edit new concepts?"
    type: "boolean"
    value: "true"
    configurable: "true"
  }
  combobox_concepts: {
    label: "Show combobox input?"
    description: "Is the combobox node with pre-defined concepts available?"
    type: "boolean"
    value: "true"
    configurable: "true"
  }
  drop_external: {
    label: "Drag'n'drop external concepts?"
    description: "Is it possible to drag highlighted text as new concepts from other applications?"
    type: "boolean"
    value: "true"
    configurable: "true"
  }
  concepts: {
    label: "Available concepts"
    description: "A list with pre-defined concepts to select from in the combobox."
    type: "array"
    value: ["length", "mass", "time", "electric current", "thermodynamic temperature", "amount of substance", "luminous intensity"]
    configurable: "true"
  }
  relations: {
    label: "Available relations"
    description: "A list with pre-defined relations to select from."
    type: "array"
    value: ["is a", "is part of", "has", "leads to", "influences", "increases", "decreases"]
    configurable: "true"
  }
}