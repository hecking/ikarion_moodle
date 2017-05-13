"use strict"

window.ut = window.ut || {}
ut.test = ut.test || {}

# function to be called from html (e.g. onLoad, gadgets.util.registerOnLoadHandler...)
ut.test.main = () ->
  if (typeof osapi is 'object')
    urlPrefix = "http://go-lab.gw.utwente.nl/sources/commons/test/opensocial/"
    console.log "running within opensocial container, using url prefix: #{urlPrefix}"
  else
    urlPrefix = ""

  head.load(
    "#{urlPrefix}../../../libs/bootstrap/css/bootstrap.min.css",
    "#{urlPrefix}../../../libs/font-awesome-4.0.3/css/font-awesome.min.css",
    "#{urlPrefix}css/main.css")
  head.js(
    "#{urlPrefix}../../js/jsChecker.js"
    "#{urlPrefix}../../js/utils.js",
    "#{urlPrefix}../../../libs/js/jquery-min.js",
    () =>
      # jquery is ready, load stuff that depends on jquery
      head.js(
        "#{urlPrefix}../../../libs/js/jquery-ui.custom.min.js"
        "#{urlPrefix}../../../libs/bootstrap/js/bootstrap.min.js",
      () =>
        console.log "all resources loaded, starting the app/gadget/whatever..."
        # add a font awesome icon to the page
        $("#ut_test_icon").append("<span class='fa-stack fa-5x'><i class='fa fa-camera fa-stack-1x'></i><i class='fa fa-ban fa-stack-2x text-danger'></i></span>")
        # add the nice gadget-resize trick
        ut.commons.utils.gadgetAutoResize()
      )
  )