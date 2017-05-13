"use strict"

window.golab = window.golab or {}
window.golab.tools = window.golab.tools or {}
window.golab.tools = window.golab.tools or {}
window.golab.tools.configurationDefinition = window.golab.tools.configurationDefinition or {}

window.golab.tools.configurationDefinition["conceptmapper"] = {
  debug: {
      label: "Debug mode?"
      description: "Turns on/off verbose console messages."
      type: "boolean"
      value: "true"
      configurable: "true"
  }
  auto_load: {
    label: "Auto load?"
    description: "Automatically load the latest saved file?"
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
    #value: ["length", "mass", "time", "electric current", "thermodynamic temperature", "amount of substance", "luminous intensity"]
    value: ["mass", "fluid", "density", "volume", "weight", "immersed object", "pressure", "force", "gravity", "acceleration", "Archimedes' principle", "displacement", "equilibrium"]
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