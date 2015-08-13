var w = (window.innerWidth * 0.75) - 15, 
	h = (window.innerHeight * 0.8),
	r = 15, //circle default radius
	l = 80, //edge length
	logW = (screen.width * 0.2) - 15;

var vis = d3.select("#graph")
	.append("svg");

vis.attr("width", w)
	.attr("height", h);

var count = 5, maxNodes = 7;	//for testing
var	selectedNode;

var nodes = [{id: 0, size: 1, x: 30, y: 30},
             {id: 1, size: 1, x: 50, y: 50},
             {id: 2, size: 1, x: 70, y: 70},
             {id: 3, size: 1, x: 90, y: 90}]

var links = [ 
	{source: 0, target: 1, weight: 1},
	{source: 2, target: 1, weight: 1},
	{source: 1, target: 3, weight: 1},
	{source: 2, target: 3, weight: 1}
]

//set up base svgs and divs
var svg = d3.select("body").append("svg")
	.attr("class", "chart")
	.attr("float", "left");

d3.select(window).on("resize", resize);

var log = d3.select("body").append("div")
	.attr("width", logW)
	.attr("height", h)
	.attr("class", "logOut");

//create the definition for the arrow head to go on the end of edges
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

//initialise the forceLayout
var force = d3.layout.force()
	.nodes(nodes)
	.links(links)
	.size([w, h])
	.charge(-500);

force.linkDistance(l);


//set up the initial nodes and edges
var link = svg.selectAll(".link")
	.data(links)
	.enter().append("line")
	.attr("class", "link")
	.attr("marker-end", "url(#end)");

var node = svg.selectAll("g")
    .data(nodes)
    .enter()
    .append("g");
node.attr("class", "node")
    .append("circle")
    	.attr("class", "circle")
    	.attr("fill", "#ccc")
    	.attr("r", r)
  		.on("mouseover", function(d) {
  			d3.select(".node_selected").attr("class", "circle");
    		d3.select(this).attr("class", "node_selected");
    		updateLogOut(d);
    	})
  		.call(force.drag)

node.append("text")
  		.attr("x", 20)
  		.attr("dy", ".35em")
  		.text(function(d){return d.id});

/*
	Updates the graph every frame while force is  running
*/
force.on("tick", function() {
	//move the nodes/labels
	node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	//move the edges
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
});

/*
	Updates the automoata with any new/removed data.
	issues: If a nodes data changes it may not change it
*/
function redraw(){
	//update edges
	link = svg.selectAll(".link").data(links);
	link.enter().insert("line", ".node")
		.attr("class", "link")
		.attr("marker-end", "url(#end)")

	link.exit().remove();

	//update nodes
	node = node.data(nodes);

	var newNode = node.enter().append("g");

    newNode.attr("class", "node")
    	.append("circle")
    	.attr("class", "circle")
    	.attr("fill", "#ccc")
    	.attr("r", r)
  		.on("mouseover", function(d) {
  			d3.select(".node_selected").attr("class", "circle");
    		d3.select(this).attr("class", "node_selected");
    		updateLogOut(d);
    	})
  		.call(force.drag)

  	newNode.append("text") //updates labels
  		.attr("x", 20)
  		.attr("dy", ".35em")
  		.text(function(d){return d.id;});


	node.exit().remove();

    force.start();
}

/*
	Generates a random node attached as the target of an edge to a random node already in the graph
	(for testing purposes)
*/
function addRandom(){
	if(count >= maxNodes){return;}
	var xVal = Math.random() * w,
		yVal = Math.random() * h;
	nodes.push({id: count, size: 1, x: xVal, y: yVal});
	var start = parseInt(Math.random()*(count-1));
	links.push({source: start, target: count});
	count++;
}

/*
	Adds a node with the given id
	#accepts an id
*/
function addNode(id){
	for(var node of nodes){
		if(node.id === id){
			node.size += 0.25;
			return;
		}
	}
	nodes.push({id: id, size: 1, x: 50, y: 50});
}

/*
	Adds an edge with the given source and target, or increases weight if already exists
	(weight not fully implemented)
*/
function addLink(source, target){
	for(var newLink in links){
		if(newLink.source == source && newLink.target == target){
			newLink.weight += 0.25;
		}
	}
	links.push(source, target);
}

/*
	Resizes the forcegraph to be the same size as the svg when the page is resized
*/
function resize() {
    w = (window.innerWidth * 0.75) - 15,
    h = (window.innerHeight * 0.8);
    svg.attr("width", w).attr("height", h);
    force.size([w, h]).resume();
  }

/*
	Sets the log contents to be the data of the given Node
*/
function updateLogOut(data){
	d3.select(".logOut").html(
		"Id: " + data.id + "<br> Size: " + data.size + "<br> X: " + data.x + "<br> Y: " + data.y 
	);
}

// Actual program runs here

force.start();
resize();

/*
	For Testing purposes
*/
setTimeout(function(){
	nodes.push({id: 4, size: 1, x: 0, y:0});
	links.push({source: 1, target: 4});
	redraw();
	var randomInter = setInterval(function(){
		addRandom();
		redraw();
		if(count >= maxNodes){
			clearInterval(randomInter);
		}
	}, 1000);
}, 5000);



