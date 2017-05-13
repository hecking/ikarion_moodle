"use strict"

window.golab = window.golab or {}
window.golab.tools = window.golab.tools or {}
window.golab.tools = window.golab.tools or {}
window.golab.tools.configuration = window.golab.tools.configuration or {}

window.golab.tools.configuration["conceptmapper"] = {
  debug: {
      type: "boolean"
      value: "true"
  }
  auto_load: {
    type: "boolean"
    value: "true"
  }
  actionlogging: {
    type: "string"
    #value: "consoleShort"
    value: "console"
    #value: "dufftown"
    #value: "opensocial"
  }
  show_prompts: {
    type: "boolean"
    value: "true"
  }
  textarea_concepts: {
    type: "boolean"
    value: "true"
  }
  combobox_concepts: {
    type: "boolean"
    value: "true"
  }
  drop_external: {
    type: "boolean"
    value: "true"
  }
  concepts: {
    type: "array"
    value: ["length", "mass", "time", "electric current", "thermodynamic temperature", "amount of substance", "luminous intensity"]
  }
  relations: {
    type: "array"
    value: ["is a", "is part of", "has", "leads to", "influences", "increases", "decreases"]
  }
}