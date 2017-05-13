"use strict"

window.ut or= {}
window.ut.commons or= {}
window.ut.commons.persistency or= {}

class window.ut.commons.persistency.FileStorage

  constructor: () ->
    console.log("Initializing ut.commons.persistency.FileStorage.")

  storeAsFile: (jsonObject, filename) ->
    # create a blob (html5) from jsonObject
    blob = new Blob([JSON.stringify(jsonObject)], {type: 'text/json'});
    if navigator.appName.indexOf("Internet Explorer") isnt -1
      # Internet Explorer: save blob as download (to be confirmed by user)
      window.navigator.msSaveBlob(blob, filename)
    else
      # other browsers: save blob as download (to be confirmed by user)
      link = document.createElement("a")
      link.download = filename
      window.URL = window.webkitURL or window.URL
      link.href = window.URL.createObjectURL(blob)
      # the link has to be in the DOM for some browsers to be clickable
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

  getFileFromDialog: (callback) ->
    input = document.createElement("input")
    input.type = "file"
    input.addEventListener "change", () ->
      file = this.files[0]
      if file
        callback undefined, file
      else
        callback "ut.commons.persistency.FileStorage: no file selected.", undefined
    # IE would not trigger the "click" on an element that's not in the DOM
    # -> add invisible element, click, remove
    input.style.display = "none"
    document.body.appendChild(input)
    input.click()
    document.body.removeChild(input)

  getJSonObjectFromDialog: (callback) ->
    @getFileFromDialog (errorMsg, file) ->
      if errorMsg
        # getting a file failed, returning the error message
        callback errorMsg, undefined
      else
      # we got a file, is it JSon?
        try
          reader = new FileReader()
          reader.onload = (e) ->
            try
              jsonObject = JSON.parse(e.target.result)
              callback(undefined, jsonObject)
            catch exception
              callback "ut.commons.persistency: could not parse json.", undefined
          reader.readAsText(file)
        catch exception
          callback "ut.commons.persistency: could not read.", undefined