var path = ((window.location.href.match(/^(http.+\/)[^\/]+$/) != null) ? window.location.href.match(/^(http.+\/)[^\/]+$/)[1] : window.location);

requirejs.config({
    paths: {
        d3: path + 'd3/d3'
    }
});



var jsonData = concepts;

//Loads jQuery with requirejs.
require(['jquery'], function($) {

    //Creates the slide-panel.
    $(".wiki_headingtitle").append('<div id="flip"></div>');
    $(".wiki_headingtitle").append('<div id="panel" class="panel"></div>');

    $(document).ready(function(){
        $("#flip").click(function(){
            $("#panel").slideToggle("slow");
        });
    });

    $("#flip").text(strings)


    //Loads d3 with requirejs.
    require(['d3'], function(d3) {



        //Wigth and height of SVG-Object and hitbox radius of the nodes.
        var width = 1100, height = 700, radius = 9;

        //Creates a SVG-object on the slide-panel.
        var svg = d3.select('.panel').append('svg')
            .attr('width', width)
            .attr('height', height);

        //Creates the color scheme.
        var color = d3.scaleOrdinal(d3.schemeCategory20);

        //Creates the force-simulation.
        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(60))
            .force("charge", d3.forceManyBody().strength(function strength() { return -200;}))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("positionX", d3.forceX(0.2))
            .force("positionY", d3.forceY(0.2));


        //Creates link-object and bind it with the edges data.
        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(jsonData.data.edges)
            .enter().append("line")
            .attr("stroke", function(d) { return d.color; });

        //Creates node-object and bind it with nodes data.
        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(jsonData.data.nodes)
            .enter().append("circle")
            .attr("r", 10)
            .attr("fill", function(d) { return d.color; })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        //Creates text of nodes
        var text = svg.append("g").selectAll("text")
            .data(jsonData.data.nodes)
            .enter().append("text")
            .text(function(d) { return d.id; });

        node.append("title")
            .text(function(d) { return d.id; });


        //Binds nodes to the simualtion.
        simulation
            .nodes(jsonData.data.nodes)
            .on("tick", ticked);

        //Binds links to the simulation.
        simulation.force("link")
            .links(jsonData.data.edges);

        //This is what the simulation do by every tick.
        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function(d) {  return d.x = Math.max(radius, Math.min(width - radius, d.x));  })
                .attr("cy", function(d) {  return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

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