"use strict";

window.ut = window.ut || {}
ut.commons = ut.commons || {}

#    prevent EventEmitter not defined warning in Intellij
EventEmitter = window.EventEmitter

class ut.commons.DataStore extends EventEmitter
  constructor: ()->
    @datas = {}

  addData: (category, data) ->
    @datas[category] ?= []
    if (typeof data.title == "undefined" && data.metadata.target.displayName)
      data.title = data.metadata.target.displayName
    @datas[category].push data

  getDatas: (category) ->
    @datas[category] ?= []

  getData: (category, title) ->
    for data in @getDatas(category)
      if data.title == title
        return data
    null

  getCategories: ()->
    for id,array of @datas
      id

  sendLoadEvent: (data)->
    @emitEvent("loadData",[data])
