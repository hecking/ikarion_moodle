var path = ((window.location.href.match(/^(http.+\/)[^\/]+$/) != null) ? window.location.href.match(/^(http.+\/)[^\/]+$/)[1] : window.location);

requirejs.config({
    paths: {
        d3: path + 'd3/d3'
    }
});


    supergraph = supernetwork;
    conceptnetworks = concepts;
    conceptnetworks.pop();


   var nodes = supergraph.data.nodes,
    links = supergraph.data.edges,
       //Counter of the current revision.
    currentnetwork = conceptnetworks.length-1,
    durationtime = 2000;

var node = null;
var link = null;
var text = null;


//Loads jQuery with requirejs.
require(['jquery', 'jqueryui'], function($, jqui) {

    //Creates the slide-panel.
    $(".wiki_headingtitle").append('<div id="flip"></div>');
    $(".wiki_headingtitle").append('<div id="panel" class="panel"></div>');
    $(document).ready(function(){
        $("#flip").text(strings["conceptnetwork"]).click(function(){
            $("#panel").slideToggle("slow");
        });
    });

    $("#panel").append('<div id="network"></div>');
    $("#panel").append('<div id="networkButton"></div>');
    $("#panel").append('<div id="revisionDisplay" ><p id="revision"></p><p id="currentnetwork"></p><br></div>');

    $("#revision").text(strings["revision"] + ":");

    $("#currentnetwork").text(conceptnetworks.length-currentnetwork);



    //Loads d3 with requirejs.
    require(['d3'], function(d3) {


        //Width and height of SVG-Object and hitbox radius of the nodes.
        var width = 1100, height = 700, radius = 9;

        //Creates a SVG-object on the slide-panel.
        var svg = d3.select('#network').append('svg')
            .attr('width', width)
            .attr('height', height);

        //Creates buttons and slider.
        $("#networkButton").append('<button id="previous" onclick="previous()" ></button>');
        $("#networkButton").append('<button id="next" onclick="next()" ></button>');

        $("#panel").append('<div ><p id="duration"></p></div>');
        $("#duration").text(strings["animation_duration"]);

        $("#panel").append('<div id="slider" ></div>');
        $("#slider").append('<div id="custom-handle" class="ui-slider-handle"></div>');

        $('#previous').text(strings["previousrevision"]).prop('disabled', true);
        $('#next').text(strings["nextrevision"]);


        $( function() {
            var handle = $( "#custom-handle" );
            $( "#slider" ).slider({

                max: 5000,
                min: 100,
                value: 2000,
                step: 100,
                animate: "fast",
                change: function( event, ui ) {durationtime = $("#slider").slider("value");},
                create: function() {
                    handle.text( $( this ).slider( "value" ) );
                },
                create: function() {
                    handle.text( $( this ).slider( "value" ) / 1000 );
                },
                slide: function( event, ui ) {
                    handle.text( ui.value / 1000 );
                }
            });
        } );


        //Creates the color scheme.
        var color = d3.scaleOrdinal(d3.schemeCategory10);


        //Creates the force-simulation.
        var simulation = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(-170))
            .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(70))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("positionX", d3.forceX(0.2))
            .force("positionY", d3.forceY(0.2))
            .on("tick", ticked);


            link = svg.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link");
            node = svg.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");
            text = svg.append("g").selectAll("text");

        restart();

        updateNetwork();



        //Funktion to start or restart the simulation.
        function restart() {

            // Apply the general update pattern to the nodes.
            node = node.data(nodes).enter().append("circle").attr("fill", function(d) { return color(d.userid); })
                .call(function(node) { node.attr("r", 10); }).call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            // Apply the general update pattern to the links.
            link = link.data(links).enter().append("line").attr("stroke-width", 2).attr("stroke-opacity", 1).attr("stroke", function(d) { return color(d.userid); });

            // Apply the general update pattern to the text.
            text = text.data(nodes);
            text = text.enter().append("text").text(function(d) { return d.id; }).call(function(text) { text.attr("opacity", 1); });

            // Update and restart the simulation.
            simulation.nodes(nodes);
            simulation.force("link").links(links);
            simulation.alpha(1).restart();



        }







        //This is what the simulation do by every tick.
        function ticked() {
            node.attr("cx", function(d) {  return d.x = Math.max(radius, Math.min(width - radius, d.x));  })
                .attr("cy", function(d) {  return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            text
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; });


        }

        //Enables drag'n drop for nodes and heat up the simulation till it ends.
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }










    });






});



//Chooses the next conceptnetwork and manages the next-button.
function next() {


    if(currentnetwork > 0) {





        currentnetwork--;

        if(currentnetwork < conceptnetworks.length-1){

            require(['jquery', 'jqueryui'], function($, jqui) {
                $('#previous').prop('disabled', false);
            });
        }


        updateNetwork();

    }

    if(currentnetwork < 1) {

        require(['jquery', 'jqueryui'], function($, jqui) {
            $('#next').prop('disabled', true);
        });

    }

}

//Chooses the previous conceptnetwork and manages the previous-button.
function previous() {


    if (currentnetwork < conceptnetworks.length-1) {

        currentnetwork++;


        if(currentnetwork > 0){

            require(['jquery', 'jqueryui'], function($, jqui) {
                $('#next').prop('disabled', false);
            });
        }

        updateNetwork();

    }


    if (currentnetwork > conceptnetworks.length-2){

        require(['jquery', 'jqueryui'], function($, jqui) {
            $('#previous').prop('disabled', true);
        });


    }




}

//Makes the current chosen conceptnetwork visible to supergraph.
function updateNetwork() {

    require(['d3'], function(d3) {



        require(['jquery'], function($) {
            $("#currentnetwork").text(conceptnetworks.length-currentnetwork);
        });

        //Lets all nodes and edges disappear, if the current chosen conceptnetwork is empty.
        if (conceptnetworks[currentnetwork] == null){

            node.transition().duration(durationtime).attr("r", function(d){ return 0});

            link.transition().duration(durationtime).attr("stroke-width", function(d){return 0})
                .attr("stroke-opacity", function(d){return 0});

            text.transition().duration(durationtime).attr("opacity", function (d){return 0});


        }

        else {

            //Makes all current nodes visible. All others get invisible.
            node.transition().duration(durationtime).attr("r", function(d){
                var exists = false;

                conceptnetworks[currentnetwork].data.nodes.forEach(function(e) {

                    if(e.id == d.id)
                        exists = true;
                });

                if(exists)
                    return 10;
                else
                    return 0;

            });

            //Makes all current links visible. All others get invisible.
            link.transition().duration(durationtime).attr("stroke-width", function(d){

                var exists = false;

                conceptnetworks[currentnetwork].data.edges.forEach(function(e){

                    if (((e.source == d.source.id) && (e.target == d.target.id)) || ((e.source == d.target.id) && (e.target == d.source.id))) {
                        exists = true;
                    }
                });
                if(exists)
                    return 1.5;
                else
                    return 0;


            }).attr("stroke-opacity", function(d){

                var exists = false;

                conceptnetworks[currentnetwork].data.edges.forEach(function(e){

                    if (((e.source == d.source.id) && (e.target == d.target.id)) || ((e.source == d.target.id) && (e.target == d.source.id))) {
                        exists = true;
                    }
                });
                if(exists)
                    return 1;
                else
                    return 0;

            });

            //Makes all current text visible. All others get invisible.
            text.transition().duration(durationtime).attr("opacity", function (d) {
                var exists = false;

                conceptnetworks[currentnetwork].data.nodes.forEach(function(e){

                    if(e.id == d.id)
                        exists = true;

                });

                if(exists)
                    return 1;
                else
                    return 0;

            });

        }
    });
}






