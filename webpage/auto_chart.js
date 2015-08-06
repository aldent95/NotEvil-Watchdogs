var vis = d3.select("#graph")
	.append("svg");

var wind = window;
var w = (screen.width * 0.75) - 15, 
	h = (screen.height * 0.8) - 15,
	r = 15,
	l = 80;

vis.attr("width", w)
	.attr("height", h);

var nodes = [{id: 0, x: 30, y: 30},
             {id: 1, x: 50, y: 50},
             {id: 2, x: 70, y: 70},
             {id: 3, x: 90, y: 90}]

var links = [
	{source: 0, target: 1},
	{source: 2, target: 1},
	{source: 1, target: 3},
	{source: 2, target: 3}
]

var svg = d3.select("body").append("svg")
	.attr("width", w)
	.attr("height", h);

svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
  .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 7+r)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

var force = d3.layout.force()
	.nodes(nodes)
	.links(links)
	.size([w, h])
	.charge(-500);

force.linkDistance(l);

var link = svg.selectAll(".link")
	.data(links)
	.enter().append("line")
	.attr("class", "link")
	.attr("marker-end", "url(#end)");


var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("circle")
    .attr("class", "node")
    .on("mouseover", function() {
    	d3.select(this)
    		.attr("class", "node_selected");
    })
    .on("mouseout", function() {
    	d3.select(this)
    		.attr("class", "node");
    })
    

force.on("tick", function() {
	node.attr("r", r)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
});

function redraw(){
	link = svg.selectAll(".link").data(links);

	link.enter().insert("line", ".node")
		.attr("class", "link")
		.attr("marker-end", "url(#end)")

	link.exit().remove();

	node = node.data(nodes);
	node.enter().append("circle")
		.attr("class", "node")
		.on("mouseover", function() {
    		d3.select(this)
    			.attr("class", "node_selected");
    	})
    	.on("mouseout", function() {
    		d3.select(this)
    			.attr("class", "node");
    	})

    node.exit().remove();

    force.start();
}

var count = 5;
function addRandom(){
	var xVal = Math.random() * w,
		yVal = Math.random() * h;
	nodes.push({id: count, x: xVal, y: yVal});
	var start = parseInt(Math.random()*(count-1));
	links.push({source: start, target: count});
	console.log(count + " start: "+start);
	count++;
}
force.start();

setTimeout(function(){
	nodes.push({id: 4, x: 500, y:70});
	links.push({source: 1, target: 4});
	redraw();
	setInterval(function(){
		addRandom();
		redraw();
	}, 2000);
}, 5000);




