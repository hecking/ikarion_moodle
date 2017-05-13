var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();
    var counter =0;




function init(Y,jsony,ivid,icourse){
    //init data

    //var json = JSON.parse(jsony);
    //end

    
    //init RGraph
    var rgraph = new $jit.RGraph({
        //Where to append the visualization
        injectInto: 'infovis',
        //Optional: create a background canvas that plots
        //concentric circles.
        
        //Add navigation capabilities:
        //zooming by scrolling and panning.
        Navigation: {
          enable: false,
          panning: false,
          zooming: 10
        },
        //Set Node and Edge styles.
        Node: {
            color: '#ddeeff'
        },
        
        Edge: {
          color: '#C17878',
          lineWidth:1.
        },

         onBeforeCompute: function(node){
            
            if(node.data.type == 'video'){
              if(node.data.description != null ||node.data.description != "" ){
                $jit.id('inner-details').innerHTML = '<h2 style="color: #000000;">'+node.name+'</h2><a href="'+node.data.urla+'" ><img style="padding:1px;border:1px solid #FFFFFF" src="'+node.data.url+'" width="80px" height="60px" alt="img" /></a><div style="color: #000000;">'+node.data.description+'</div>';

              }else{
                $jit.id('inner-details').innerHTML = '<h2 style="color: #000000;">'+node.name+'</h2><a href="'+node.data.urla+'" ><img style="padding:1px;border:1px solid #FFFFFF" src="'+node.data.url+'" width="80px" height="60px" alt="img" /></a><div style="color: #000000;">Placeholder</div>';
              }

            }
        },
        
        //Add the name of the node in the correponding label
        //and a click handler to move the graph.
        //This method is called once, on label creation.
        onCreateLabel: function(domElement, node){
            
            domElement.innerHTML = node.name;
            domElement.onclick = function(){
                rgraph.onClick(node.id, {onComplete: function() {
                        if(node.data.type == 'video'){
                         $.get("loadmore.php", {id:node.id,c:node.data.course}, function(data){
                          rgraph.loadJSON(data);
                          rgraph.refresh();
                        },"json");


                        }else if(node.data.type == 'tag'){
                         $.get("loadmoretags.php", {id:node.id,c:node.data.course}, function(data){
                          rgraph.loadJSON(data);
                          rgraph.refresh();
                        },"json");

                        }
                    }
                });
            };
            
            /*
            domElement.innerHTML = node.name;
            var style = domElement.style;
            style.fontSize = "0.8em";
            style.color = "#fff";
            style.cursor = "pointer";
            domElement.onclick = function() {
              rgraph.onClick(node.id, {
                  hideLabels: false
              });  
            };
            */
        },
        //Change some label dom properties.
        //This method is called each time a label is plotted.
        onPlaceLabel: function(domElement, node){
            var style = domElement.style;
            style.display = '';
            style.cursor = 'pointer';

            if (node._depth <= 1) {
                //style.fontSize = "0.8em";
                //style.color = "#ccc";
            
                var left = parseInt(style.left);
                var w = domElement.offsetWidth;
                var top = parseInt(style.top);
                if(node.data.type == 'video'){
                domElement.innerHTML = '<div style="color:#000000">'+node.name+'</div><img src="'+node.data.url+'" width="100px" height="75px" alt="img" />';
                style.left = (left + 0) + 'px';
                style.top = top - 10 + 'px';
                }else if(node.data.type =='tag'){
                domElement.innerHTML = '<div style="color:#FFFFFF;border-radius: 3px;background: #334455;display: inline-block;padding: 4px 12px;">'+node.name+'</div>';
                style.left = (left - 0) + 'px';
                style.top = (top - 10) + 'px';
              }
              style.color = "#ddd";
              style.fontSize = "1em";

            } else if(node._depth == 2){
                //style.fontSize = "0.7em";
                //style.color = "#494949";

                if(node.data.type == 'video'){
                domElement.innerHTML = '<div style="color:#000000">'+node.name+'</div><img src="'+node.data.url+'" width="80px" height="50px" alt="img" />';
                style.left = (left - 0) + 'px';
                style.top = top - 50 + 'px';
              }else if(node.data.type =='tag'){
                domElement.innerHTML = '<div style="border-radius: 3px;background: #334455;display: inline-block;margin-right: 3px;padding: 4px 12px;">'+node.name+'</div>';
                style.left = (left - 0) + 'px';
                style.top = (top -1) + 'px';
              }
              style.fontSize = "1em";
              style.color = "#ddd";
            
            } else {
                style.display = 'none';
            }





            var left = parseInt(style.left);
            var top = parseInt(style.top);
            var w = domElement.offsetWidth;
            var h = domElement.offsetHeight;

            style.left = (left - w / 2) + 'px';
            style.top = (top - h / 2) + 'px';
        }
    });
    //load JSON data
    //rgraph.loadJSON(json3);
    
    rgraph.loadJSON(JSON.parse(jsony));

     /*
    $.get("vloadmore.php", {id:ivid,c:icourse}, function(data){
                          rgraph.loadJSON(data);
                          
                          rgraph.refresh();
                        },"json"); 
    
   

    $.ajax({
    type: "GET",
    url: "loadmore.php",
    data: { id: ivid, c: icourse }}).done(function( data ) {
    rgraph.loadJSON(JSON.parse(data));
                          
    rgraph.refresh();
    });
  */
    rgraph.graph.eachNode(function(n) {
      var pos = n.getPos();
      pos.setc(-200, -200);
    });
    rgraph.compute('end');
    rgraph.fx.animate({
      modes:['polar'],
      duration: 2000
    });
    


    //end
    //append information about the root relations in the right column
    if(rgraph.graph.getNode(rgraph.root).data.description != null ||rgraph.graph.getNode(rgraph.root).data.description != "" ){
    $jit.id('inner-details').innerHTML = '<h2 style="color: #000000;">'+rgraph.graph.getNode(rgraph.root).name+'</h2><img style="border:0.5px solid #FFFFFF"  src="'+rgraph.graph.getNode(rgraph.root).data.url+'" width="80px" height="60px" alt="img" /><div style="color: #000000;">'+rgraph.graph.getNode(rgraph.root).data.description+'</div>';

    }else{
    $jit.id('inner-details').innerHTML = '<h2 style="color: #000000;">'+rgraph.graph.getNode(rgraph.root).name+'</h2><img style="border:0.5px solid #FFFFFF"  src="'+rgraph.graph.getNode(rgraph.root).data.url+'" width="80px" height="60px" alt="img" /><div style="color: #000000;">Placeholder</div>';

    }

    //$jit.id('inner-details').innerHTML = rgraph.graph.getNode(rgraph.root).data.relation;
}
