var w = (window.innerWidth * 0.75) - 15, 
	h = (window.innerHeight * 0.8),
	r = 15, //circle default radius
	l = 80; //edge length
	logW = (screen.width * 0.2) - 15;

var maxNodes = 7;	//for testing
var	selectedNode;
var links = [];
var nodes = [];
var count = 0;

var vis = d3.select("body").append("div");
//var outer = d3.select("body").append("svg")
var outer = vis.append("svg:svg")
	//.attr("float", "left")
	.attr("width", w)
    .attr("height", h)
    //.attr("pointer-events", "all");

//set up base svgs and divs
//var svg = d3.select("body").append("svg")
var svg = outer.append("svg:g")
	//.attr("float", "left")
	.call(d3.behavior.zoom().on("zoom", rescale))
	.on("dblclick.zoom", null)
	.append("svg:g")
	.on("mousedown", mousedown)
    .on("mouseup", mouseup);

var rect = svg.append("svg:rect")
	.attr("width", w*10)
	.attr("height", h*10)
	.attr("fill", "white")
	.attr("transform", "translate(" + -(w) + "," + -(h*2) + ")")

d3.select(window).on("resize", resize);

//var log = d3.select("body").append("div")
var log = vis.append("div")
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
	.gravity(0.2)
	.theta(0.8)
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
  		.on("click", function(d) {
  			d3.select(".node_selected").attr("class", "circle");
    		d3.select(this).attr("class", "node_selected");
    		updateLogOut(d);
    	})
  		.call(force.drag)

node.append("text")
  		.attr("x", 20)
  		.attr("dy", ".35em")
  		.text(function(d){return d.name});

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
	//link = link.data(links);
	link.enter().insert("line", ".node")
		.attr("class", "link")
		.attr("marker-end", "url(#end)")

	link.exit().remove();

	//update nodes
	node = node.data(nodes);

	var newNode = node.enter().append("g");

    newNode.attr("class", "node")
    	.append("circle")
    	.attr("class", function(d){if(d.root){return "circle_root";}else if(d.hasChildren){return "circle"}return "circle_end"})
    	.attr("fill", "#ccc")
    	.attr("r", function(d){return r * d.size;})
  		.on("click", function(d) {
  			console.log(d.root);
  			d3.selectAll(".node_selected").attr("class", "circle");
  			d3.selectAll(".circle_root_selected").attr("class", "circle_root");
  			d3.selectAll(".circle_end_selected").attr("class", "circle_end");
  			if(d.root){d3.select(this).attr("class", "circle_root_selected");}
  			else if(d.hasChildren){d3.select(this).attr("class", "node_selected");}
  			else {d3.select(this).attr("class", "node_end_selected");}
  			updateLogOut(d);
    	})
  		.call(force.drag)

  	newNode.append("text") //updates labels
  		.attr("x", 20)
  		.attr("dy", ".35em")
  		.attr("background-color", "#fff")
  		.text(function(d){return d.name;});


	node.exit().remove();

	if (d3.event) {
    // prevent browser's default behavior
    	d3.event.preventDefault();
  	}

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
function addNode(newId, size, name, newX, newY, root, hasChildren){
	//inputNodes.push({id: inputCount-1, size: 1, name: aNode.event, x: inputCount, y: inputCount});

	nodes.push({id: newId, size: size, name: name, x: parseInt(Math.random()*(w-100)+50), y: parseInt(Math.random()*(h-100)+50), root: root, hasChildren: hasChildren});
	redraw();
}

/*
	Adds an edge with the given source and target, or increases length if already exists
	(length not fully implemented)
*/
function addLink(source, target, length){
	links.push({source: source, target: target, length: length});
	redraw();
}

function clearData(){
	nodes = [];
	links = [{source: 0, target: 0, length: 1}];
	count = 0;
	redraw();
}

function setData(newNodes, newLinks, newCount){
	nodes = newNodes;
	links = newLinks;
	count = newCount;

	redraw();
}

function rescale() {
  trans=d3.event.translate;
  scale=d3.event.scale;

  svg.attr("transform",
      "translate(" + trans + ")"
      + " scale(" + scale + ")");
}

/*
	Resizes the forcegraph to be the same size as the svg when the page is resized
*/
function resize() {
    w = (window.innerWidth * 0.75) - 15,
    h = (window.innerHeight * 0.8);
    //rect.attr("width", w).attr("height", h);
    outer.attr("width", w).attr("height", h);
    svg.attr("width", w).attr("height", h);
    //rect.attr("width", w).attr("height", h);
    force.size([w, h]).resume();
    force.start();
    log.attr("width", w).attr("height", h);
  }

function mousedown(){
	svg.call(d3.behavior.zoom().on("zoom"), rescale);
	return;
}

function mouseup(){

}

function mousemove(){

}
/*
	Sets the log contents to be the data of the given Node
*/
function updateLogOut(data){
	d3.select(".logOut").html(
		"Id: " + data.id + "<br> Size: " + data.size + "<br> Name: "+ data.name + "<br> X: " + data.x + "<br> Y: " + data.y 
	);
}
// Actual program runs here

force.start();
resize();