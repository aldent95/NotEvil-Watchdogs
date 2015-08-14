var data;
var inputNodes = [];
var inputLinks = [];
var inputCount = count;

function parseData(parentIndex, aNode, root){
	inputCount++
	count ++ ;
	var current = inputCount - 1
	//console.log("count: " + count + " inputCount: " + inputCount + " parent " + parentIndex + " current " + current);
	//console.log(aNode.event);
	//inputNodes.push({id: inputCount-1, size: 1, name: aNode.event, x: inputCount, y: inputCount});
	addNode(current, 1, aNode.event, inputCount, inputCount, root);
	if(parentIndex != null){
		//console.log("Source: " + (parentIndex-1) + "Target: "+ inputCount);
		//inputLinks.push({source: parentIndex-1, target: inputCount, weight: 1});
		addLink(parentIndex, current, 1);
		//console.log("linked to parent at " + (parentIndex));
	}
	if(aNode.links != null){
		//console.log(aNode.links);
		jQuery.each(aNode.links, function(index, value){
			//console.log(value.child);
			//sleep(50);
			parseData(current, value.child, false);
		})
	}

}

// function sleep(milliseconds) {
//   var start = new Date().getTime();
//   for (var i = 0; i < 1e7; i++) {
//     if ((new Date().getTime() - start) > milliseconds){
//       break;
//     }
//   }
// }

//clearData();

$.getJSON("trie.json", function(json) {
    console.log(json);
    parseData(null, json, true);
    console.log(inputLinks);
    //setData(inputNodes, inputLinks, inputCount);
});
