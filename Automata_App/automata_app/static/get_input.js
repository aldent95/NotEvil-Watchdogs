var data;
var inputNodes = [];
var inputLinks = [];
var minCount = 100;

function parseData(parentIndex, aNode, nodeSize, root){
	count ++ ;
	var current = count - 1;
	if(isArrayEmpty(aNode.links)){addNode(current, calcNodeSize(nodeSize), aNode.event, count, count, root, false);}
	else{
		addNode(current, calcNodeSize(nodeSize), aNode.event, count, count, root, true);
		jQuery.each(aNode.links, function(index, value){
			if(value.count > minCount){
				parseData(current, value.child, value.count, false);
			}
		})
	}
	if(parentIndex != null){
		addLink(parentIndex, current, Math.sqrt(nodeSize) / Math.sqrt(minCount));
	}

}

function isArrayEmpty(test) {
    for (var i in test) {
        if (!jQuery.isEmptyObject(test[i]))
            return false;
    }
    return true;
}

function parseRoot(aNode){
	//if links are empty then there is no data to display
	if(isArrayEmpty(aNode.links)){
		//do an error
		alert("rootNode is empty");
		return;
	}
	jQuery.each(aNode.links, function(index, value){
		if(value.count > minCount){
			parseData(null, value.child, value.count, true);
		}
	});
}

function calcNodeSize(nodeSize){
	//return Math.log(nodeSize) / Math.log(minCount);			//log
	//return Math.sqrt(nodeSize) / Math.sqrt(minCount);			//sqrt
	//return Math.pow(nodeSize, 1/3) / Math.pow(minCount, 1/3)	//cubrt
	return 1;
}

$.getJSON("/static/trie.json", function(json) {
    parseRoot(json);
    console.log(count + " Nodes");
});
