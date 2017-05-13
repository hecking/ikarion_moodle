"use strict";

@golab = @golab || {}
@golab.common = @golab.common || {}

replaceRegExps = for i in [0..10]
  new RegExp("\\{#{i}\\}", "g")

i_ = "i_"

class LanguageHandler
  constructor: ->

    # this function will handle things like string parameters etc.
  getMessage: (key, args...) ->
    message = ""
    if (typeof key != "undefined")
      if (typeof key != "string")
        key = key.toString()
      rawMessage = @getMsg(key)
      message = rawMessage
      if (message?)
        for arg,index in args
          message = message.replace(replaceRegExps[index], arg)
        if (message.match(replaceRegExps[index + 1]))
          console.log("g4i18n: missing argument(s) for key '#{key}', value '#{rawMessage}', but only #{arguments.length - 1} arguments given")
      else
        console.log("g4i18n: missing value for key '#{key}'")
        message = "???'#{key}'???"
    message

  getI_Message: (key, args...) ->
    if (key.toLowerCase().indexOf(i_) == 0)
      @getMessage(key.substr(i_.length), args...)
    else
      key

  getMsg: (key) ->
    console.error("this method must be overriden")

  getLanguage: () ->
    console.error("this method must be overriden")


class OpenSocialLanguageHandler extends LanguageHandler
  constructor: ->
    if (gadgets?)
      @gadgetPrefs = new gadgets.Prefs()
      console.log("... running inside OpenSocial, using host local: #{@gadgetPrefs.getLang()}")
    else
      throw "not running inside OpenSocial!"

  getMsg: (key) ->
    @gadgetPrefs.getMsg(key)

  getLanguage: () ->
    @gadgetPrefs.getLang()


loadFile = (fileName, readyHandler, errorHandler)->
  if (window.XMLHttpRequest)
    xhttp = new XMLHttpRequest()
  else # code for IE5 and IE6
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  xhttp.open("GET", fileName, true);
  xhttp.onload = =>
    if (xhttp.readyState == 4 && xhttp.status == 200)
#      console.log(xhttp.response)
      readyHandler(xhttp)
  xhttp.onreadystatechange = ->
#    console.log("new ready state: #{xhttp.readyState}, status: #{xhttp.status}")
    if (xhttp.readyState == 4 && xhttp.status != 200)
      errorHandler(xhttp)
  xhttp.send();

getErrorMessage = (xhttp, filePath, fileType) ->
  "problems loading #{fileType} file #{filePath}, error: #{xhttp.status} (#{xhttp.statusText})"

languagePath = "./languages/"
indexFile = "list.txt"
defaultLanguageFile = "ALL_ALL.xml"

class StandAloneLanguageHandler extends LanguageHandler
  constructor: (desiredLanguage, callback)->
    @languageMap = {}
    @languageFiles = {}
    @currentLanguage = null
    @loadLanguageFileIndex(=>
      @selectInitialLanguage(desiredLanguage, callback)
    , (errorMessage)=>
      console.error(errorMessage)
      callback(null, @)
    )

  loadLanguageFileIndex: (readyHandler, errorHandler)->
    indexFilePath = languagePath + indexFile
    loadFile(indexFilePath, (xhttp)=>
      lines = xhttp.responseText.split("\n")
      for line in lines when line.trim().length && line.trim() != indexFile
        languageParts = line.split("_")
        if (languageParts.length == 2)
          @languageFiles[languageParts[0]] = line.trim()
        else
          console.error("can't understand language file name #{line}")
      if (@languageFiles.length == 0)
        console.error("could not find any language files in the language index file")
      else if (!@languageFiles["ALL"])
        console.error("there is no ALL_*.xml file in the language index file")
      console.log("found langauge files: #{JSON.stringify(@languageFiles)}")
      readyHandler()
    , (xhttp)->
      errorHandler(getErrorMessage(xhttp, indexFilePath, "index"))
    )

  getCurrentLanguage: ->
    @currentLanguage

  getLanguages: ->
    for language,file of @languageFiles when language != "ALL"
      language

  selectInitialLanguage: (desiredLanguage, callback) =>
    if (@languageFiles.length == 0)
      @languageMap = {}
      setTimeout(callback, 0)
    else
      @setLanguage(desiredLanguage, callback)

  setLanguage: (language, callback)=>
    useLanguage = @getSimpleLanguage(language)
    if (@currentLanguage != useLanguage)
      if (!@languageFiles[useLanguage])
        if (@currentLanguage)
          return
        useLanguage = "ALL"
      #      console.log("loading language file for language #{useLanguage}")
      @loadLanguageFile(@languageFiles[useLanguage], useLanguage, callback)

  getSimpleLanguage: (language)->
    languageParts = language.split("-")
    languageParts[0]

  loadLanguageFile: (fileName, useLanguage, callback) ->
    languageFilePath = languagePath + fileName
    loadFile(languageFilePath, (xhttp)=>
      @parseLanguageFileContent(xhttp.responseText, languageFilePath, useLanguage)
      @currentLanguage = useLanguage
      callback(null, @)
    , (xhttp)->
      callback(getErrorMessage(xhttp, languageFilePath, "language"))
    )

  parseLanguageFileContent: (xmlContent, languageFilePath, language) ->
    @languageMap = {}
    nrOfKeys = 0
    startKeyString = "<msg name=\""
    endKeyString = "\">"
    endValueString = "</msg>"
    startKeyIndex = xmlContent.indexOf(startKeyString)
    while (startKeyIndex >= 0)
      startKeyIndex += startKeyString.length
      endKeyIndex = xmlContent.indexOf(endKeyString, startKeyIndex)
      if (endKeyIndex < 0)
        console.log("failed to find end of key")
        startKeyIndex = -1
      else
        endValueIndex = xmlContent.indexOf(endValueString, endKeyIndex)
        if (endValueIndex < 0)
          console.log("failed to find end of key")
          startKeyIndex = -1
        else
          key = xmlContent.slice(startKeyIndex, endKeyIndex).trim()
          value = xmlContent.slice(endKeyIndex + endKeyString.length, endValueIndex).trim()
          #          console.log("found: key=#{key}, value=#{value}")
          @languageMap[key] = value
          ++nrOfKeys
          startKeyIndex = xmlContent.indexOf(startKeyString, endValueIndex + endValueString.length)
    console.log("loaded #{nrOfKeys} keys from language file #{languageFilePath}, for language #{language}")

  getMsg: (key) ->
    @languageMap[key]

  getLanguage: () ->
    @currentLanguage


window.golab.createLanguageHandler = (desiredLanguage, callback) ->
  if (gadgets?)
    setTimeout(->
      callback(null, new OpenSocialLanguageHandler())
    , 0)
  else
    new StandAloneLanguageHandler(desiredLanguage, callback)