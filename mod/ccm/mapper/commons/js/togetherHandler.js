window.ut = window.ut || {};

window.ut.tools = window.ut.tools || {};

window.ut.tools.conceptmapper = window.ut.tools.conceptmapper || {};

var TogetherJSConfig_getUserName = function () {return window.ut.tools.conceptmapper.conceptMapper.metadataHandler.getName();};

/*
  Only send the map some time after initialization, to avoid sending empty or wrong maps
*/
TogetherJS.hub.on("togetherjs.hello",function(){
    console.log("Received hello message, sending map...");
    if(TogetherJS.running && window.ut.tools.conceptmapper.conceptMapper.init && window.ut.tools.conceptmapper.conceptMapper.readyForMessages){
        var conceptMap, _ref, concept, _len, _i;
        conceptMap = window.ut.tools.conceptmapper.conceptMapper.getConceptMapContentAsJSON();
        TogetherJS.send({
            type: 'loadMap',
            conceptMap: conceptMap
        });
        console.log("map sent.")
    }
});

/*
  Ignore messages until one delete+load cycle complete
  only load if the maps are different
*/
TogetherJS.hub.on("loadMap", function(msg){
    if(window.ut.tools.conceptmapper.conceptMapper.readyForMessages){
      var myMap = JSON.stringify(window.ut.tools.conceptmapper.conceptMapper.getConceptMapContentAsJSON());
      var yourMap = JSON.stringify(msg.conceptMap);
      if(myMap != yourMap){
          console.log("Received map is different, loading...");
          window.ut.tools.conceptmapper.conceptMapper.readyForMessages = false;
          window.ut.tools.conceptmapper.conceptMapper.setConceptMapFromJSON(msg.conceptMap);
      }else{
        console.log("Received map is identical.");
      }
    }
});

TogetherJS.hub.on("addConcept", function(msg){
    window.ut.tools.conceptmapper.conceptMapper._createConcept(msg.id,msg.text,msg.x,msg.y,msg.className,msg.colorName);
});

TogetherJS.hub.on('updateConcept',function(msg){
    if(window.ut.tools.conceptmapper.conceptMapper.conceptExists(msg.conceptid)){
        var concept,x,y;
        concept = $('#' + msg.conceptid);
        console.log("Received coordinates are:\n" + "x: " + msg.xpos + "\n" + "y: " + msg.ypos); //use actionlogger here
        concept.css('position', 'absolute');
        concept.css('top', msg.ypos);
        concept.css('left', msg.xpos);
        jsPlumb.repaintEverything();
    }
});

TogetherJS.hub.on("addRelation", function(msg){
    var connection;
    connection = jsPlumb.connect({
        source: msg.sourceId,
        target: msg.targetId
    });
});

TogetherJS.hub.on("deleteExistingRelation", function(msg){
    window.ut.tools.conceptmapper.conceptMapper.deleteConnectionsBetween(msg.sourceId, msg.targetId);
});

TogetherJS.hub.on("updateColor", function(msg){
    window.ut.tools.conceptmapper.conceptMapper.setColor(msg.id, msg.color);
});

TogetherJS.hub.on("updateText", function(msg){
    var p = $('<p/>').html(msg.content);
    $("#" + msg.id).find("p").replaceWith(p);
});

TogetherJS.hub.on("removeConcept", function(msg){
    var concept = $("#" + msg.id);
    window.ut.tools.conceptmapper.conceptMapper.removeConcept(concept);
});

TogetherJS.hub.on("deleteAll", function(){
    window.ut.tools.conceptmapper.conceptMapper.deleteAll();
});

TogetherJS.hub.on("updateRelation", function(msg){

    console.log("Receiving update of relation.");

    var connection = jsPlumb.getConnections({
        source: msg.sourceId,
        target: msg.targetId
    })[0];

    connection.getOverlay("label").setLabel(msg.content)

});