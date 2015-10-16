/**
 * This file gets and parses the input for the automata.
 * It also contains the function for calculating nodeSize
 */

var inputNodes = [];
var inputLinks = [];


/**
 *	Adds a node with id equal to it's current index, the recursivly calls parseData on its children
 *	Also adds a link to its parent, if one exists
 *
 *	@param parentIndex The index/id of it's parent or null
 *	@param aNode The json representing this node
 *	@param nodeSize The count of the node
 *	@param boolean, Is it a root node?
 */
function parseData(parentIndex, aNode, nodeSize, root){
	count ++ ;
	var current = count - 1;

	if(isArrayEmpty(aNode.links)){//Does the node have children? if so add an end node
		addNode(current, calcNodeSize(nodeSize), aNode.event, count, count, root, false);
		//addObjNode({id:current size:nodeSize, name: aNode.event, x: parseInt(Math.random()*(w-100)+50), y: parseInt(Math.random()*(h-100)+50), root: root, hasChildren: false});
	}
	else{
		addNode(current, calcNodeSize(nodeSize), aNode.event, count, count, root, true);
		//addObjNode({id:current size:nodeSize, name: aNode.event, x: parseInt(Math.random()*(w-100)+50), y: parseInt(Math.random()*(h-100)+50), root: root, hasChildren: true});
		jQuery.each(aNode.links, function(index, value){
			if(value.count >= minCount){
				parseData(current, value.child, value.count, false);
			}
		})
	}
	if(parentIndex != null){	//if there's a parent add a link between it and this
		addLink(parentIndex, current, Math.sqrt(nodeSize) / Math.sqrt(minCount));
	}

}

/**
 *	Checks if an array/object is empty, or is filled with empty objects
 *
 *	@param test the array to test
 *	@return if the input is empty
 */
function isArrayEmpty(test) {
    for (var i in test) {
        if (!jQuery.isEmptyObject(test[i]))
            return false;
    }
    return true;
}


/**
 *	Parses all of the Nodes in a json, with the first level children being set as Root Nodes
 *
 *	@param aNode the enclosing node to parse
 */
function parseRoot(aNode){
	//if links are empty then there is no data to display
	if(isArrayEmpty(aNode.links)){
		//do an error
		alert("rootNode is empty");
		return;
	}
	jQuery.each(aNode.links, function(index, value){
		if(value.count >= minCount){
			parseData(null, value.child, value.count, true);
		}
	});
}

/**
 *	Calculates the radius of the ode based on its size and the type of sizing
 *	@param nodeSize the count or absolute size of a node
 *	@param type the type of sizing
 *	@return the radius
 */
function calcNodeSize(nodeSize, type){
	if(type === "sqrt"){return r * Math.sqrt(nodeSize) / Math.sqrt(minCount);}			//sqrt
	if(type === "cube"){return r * Math.pow(nodeSize, 1/3) / Math.pow(minCount, 1/3)}	//cbrt
	return nodeSize;
}

/*
	CODE TO RUN STARTS HERE
*/
if(test){
	$.getJSON("/static/trie.json", function(json) {
	    storedTrie = json;
	    parseRoot(storedTrie);
	    console.log(count + " Nodes");
	});
} else{
	$.getJSON("/automata/projects/"+ p_uuid +"/trie", function(json) {
		storedTrie = json;
	    parseRoot(storedTrie);
	    console.log(count + " Nodes");
	});
};
