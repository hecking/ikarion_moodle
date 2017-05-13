"use strict"

# requires jQuery
window.ut = window.ut or {}
window.ut.tools = window.ut.tools or {}

class window.ut.tools.LanguageHandler

  constructor: (@localeFile = "locale/ALL_ALL.xml") ->
    console.log("Initializing LanguageHandler.")
    if gadgets?
      @gadgetPrefs = new gadgets.Prefs()
      console.log("... running inside OpenSocial, using host local: #{@gadgetPrefs.getLang()}}")
    else
      console.log("... running standalone, using locale: #{@localeFile}")
      @_initStandalone()
    @

  _initStandalone: () =>
    if (window.XMLHttpRequest)
      xhttp=new XMLHttpRequest()
    else # code for IE5 and IE6
      xhttp=new ActiveXObject("Microsoft.XMLHTTP");
    xhttp.open("GET", @localeFile,false);
    xhttp.send();
    bundle = xhttp.responseXML
    @standaloneBundle = {}
    $.each $("msg", bundle), (index, msg) =>
      key = $(msg).attr('name')
      value = $(msg).text()
      @standaloneBundle[key] = value
      console.log "added to bundle: #{key}: #{value}"
    @

  getMsg: (key) =>
    if key?
      if gadgets?
        return @gadgetPrefs.getMsg(key)
      else
        return @standaloneBundle[key]
    else
      throw "Cannot get a message string without a key."