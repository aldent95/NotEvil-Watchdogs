/**
 * This file sets up the visualistation page, including the automata chart, and the log output.
 * It also stores the data for the automata and handels resizing
 */


var w = (window.innerWidth * 0.75) - 15, 
	h = (window.innerHeight * 0.8),
	r = 15, //circle default radius
	l = 80; //edge length
	logW = (window.innerWidth * 0.2) - 15;	//logOut width

var	selectedNode;			//the currently selected Node
var onNode = false;			//for trying to fix dragging/panning; NOT CURRENTLY FUNCTIONAL
var links = [];				//Stores the links/edges for the forcelayout 
var nodes = [];				//Stores the nodes for the forcelayout
var count = 0;				//The number of nodes
var minCount = 50;			//the minimum count for which we will display a node


if (!test){					//Note! mincount of zero will break sizing
	minCount = 1;
};


//the visible window
var vis = d3.select("body").append("div");

//holds the force layout
var outer = vis.append("svg:svg")
	.attr("width", w)
    .attr("height", h)

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
	.style("width", logW)
	.style("height", h)
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


//set up the initial nodes and edges, not currently used and needs to be updated to match that which is in redraw()
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

/**
 *	Updates the graph every frame while force is  running
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

/**
 *	Updates the automata with any new/removed nodes and links
 *	Also starts the forceLayout
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
    	.attr("r", r)
  		.on("click", function(d) {
  			//remove the old selectedNode
  			d3.selectAll(".node_selected").attr("class", "circle");
  			d3.selectAll(".circle_root_selected").attr("class", "circle_root");
  			d3.selectAll(".circle_end_selected").attr("class", "circle_end");
  			d3.selectAll(".link").style("stroke", "#ccc");

  			//add the new selectedNode
  			if(d.root){d3.select(this).attr("class", "circle_root_selected");}
  			else if(d.hasChildren){d3.select(this).attr("class", "node_selected");}
  			else {d3.select(this).attr("class", "circle_end_selected");}

  			selectedNode = d;

  			//highlight the selected Nodes' pathing
			getAllChildren(d.id);
			getAllParents(d.id);

  			updateLogOut(d);

    	})
		.on("mouseleave", function(d){
    		onNode = false;
    	})
    	.on("mouseenter", function(d){
    		onNode = true;
    	})
  		.call(force.drag)

  	//update labels
  	newNode.append("text")
  		.attr("x", 20)
  		.attr("dy", ".35em")
  		.style("background-color", "#fff")
  		.style("pointer-events", "none")
  		.text(function(d){return d.name;});


	node.exit().remove();

	if (d3.event) {
    // prevent browser's default behavior
    	d3.event.preventDefault();
  	}

    force.start();
}

var childNodes = [];	//all the nodes that are children of the selected Node
var childLinks = [];	//all the edges that link to children of the selectedNode

/**
 *	Gets all the children of a Node and sets childNodes and childLinks.
 *	Also turn all the child links Red
 *
 *	@param childId the id of the node to get all the children of
 *	@return an object that contains two arrays which contain the child nodes and edges respectivly
 */
function getAllChildren(childId){
	childNodes = [];
	childLinks = [];

	getChildren(childId);

	return {nodes: childNodes, links: childLinks};
}

/**
 *	Turns all the firstlevel child links red, and adds the children and there links to there respective arrays
 *	Recursively calls itself using its childrens id
 *
 *	@param childId the id of the node to check
 */
function getChildren(childId){
	var toSelect = d3.selectAll(".link").filter(function(d){return d.source.id == childId});
	toSelect.style("stroke", "red");

	for(var i = 0; i < links.length; i++){
		var edge = links[i];
		if(edge.source.id == childId){
			childNodes.push(edge.target);
			childLinks.push(edge);
			getChildren(edge.target.id);
		}
	}
}

var parentNodes = [];
var parentLinks = [];

/**
 *	Gets all the parents of a Node and sets parentNodes and parentLinks.
 *	Also turn all the parentlinks Red
 *
 *	@param childId the id of the node to get all the parents of
 *	@return an object that contains two arrays which contain the parent nodes and edges respectivly
 */
function getAllParents(childId){
	parentNodes = [];
	parentLinks = [];

	getParents(childId);

	return {nodes: parentNodes, links: parentLinks};
}

/**
 *	Turns all the firstlevel parent links red, and adds the children and their links to there respective arrays
 *	Recursively calls itself using its parents id
 *
 *	@param childId the id of the node to check
 */
function getParents(childId){
	var toSelect = d3.selectAll(".link").filter(function(d){return d.target.id == childId});
        toSelect.style("stroke", "red");

	for(var i = 0; i < links.length; i++){
		var edge = links[i];
		if(edge.target.id == childId){
			parentNodes.push(edge.source);
			parentLinks.push(edge);
			getParents(edge.source.id);
		}
	}
}

/**
 *	Adds a node with the given id
 *	Should be replaced with something what uses an object instead
 *
 *	@param newId the id of the node to add
 *	@param size the count of the node
 *	@param name the name of the event
 *	@param newX an x value. Not used.
 *	@param newY a Y value. Not used.
 *	@param root is the node a root node
 *	@param hasChildren is the node an end node
 */
function addNode(newId, size, name, newX, newY, root, hasChildren){
	//inputNodes.push({id: inputCount-1, size: 1, name: aNode.event, x: inputCount, y: inputCount});

	nodes.push({id: newId, size: size, name: name, x: parseInt(Math.random()*(w-100)+50), y: parseInt(Math.random()*(h-100)+50), root: root, hasChildren: hasChildren});
	redraw();
}

function addObjNode(objNode){
	if(objNode.id == null || objNode.size == null || objNode.name == null){
		console.log("Error on adding: ");
		console.log(objNode);
		alert("TRYING TO INVALID NODE OBJECT");
		return;
	}
	nodes.push(objNode);
	redraw();
}

/**
 *	Adds an edge with the given source and target, or increases length if already exists
 *
 *	@param source the index of the parent node
 *	@param target the index of the child node
 *	@param length not currently used, used to be part of sizing
 */
function addLink(source, target, length){
	links.push({source: source, target: target, length: length});
	redraw();
}

/**
 *	Clears the data arrays
 */
function clearData(){
	nodes = [];
	links = [];
	count = 0;
	redraw();
}

//function setData(newNodes, newLinks, newCount){
//	nodes = newNodes;
//	links = newLinks;
//	count = newCount;
//
//	redraw();
//}

/**
 *	Zooms/translates the force layout	
 */
function rescale() {
  trans=d3.event.translate;
  scale=d3.event.scale;

  svg.attr("transform",
      "translate(" + trans + ")"
      + " scale(" + scale + ")");
}

/**
 *	Resizes the forcegraph to be the same size as the svg when the page is resized
 */
function resize() {
    w = (window.innerWidth * 0.75) - 15,
    h = (window.innerHeight * 0.8);
    logW = (window.innerWidth * 0.25) - 25;
	console.log("innerWidth: "+ window.innerWidth + " w: " + w + " logW: " + logW);
    rect.style("width", w).style("height", h);
    outer.style("width", w).style("height", h);
    svg.style("width", w).style("height", h);
   	rect.style("width", w).style("height", h);
    force.size([w, h]).resume();
    force.start();
    log.style("width", logW).style("height", h);
  }

function mousedown(){
	if(!onNode){
		svg.call(d3.behavior.zoom().on("zoom"), rescale);
		return;
	}
}

function mouseup(){
	svg.call(d3.behavior.zoom().on("zoom"), null);
}

/**
 *	Sets the log contents to be the data of the given Node
 *	TODO: change to use an object iterator instead
 */
function updateLogOut(data){
	var toLogOut = "";

	for(var key in data){
		toLogOut += key + ": "+data[key];
		tologout += "<br> "
	}

	d3.select(".logOut").html(toLogOut);
	//d3.select(".logOut").html(
	//	"Id: " + data.id + "<br> Size: " + data.size + "<br> Name: "+ data.name + "<br> X: " + data.x + "<br> Y: " + data.y 
	//);
}

// Actual program runs here

force.start();
resize();
