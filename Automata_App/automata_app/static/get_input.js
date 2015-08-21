var data;
var inputNodes = [];
var inputLinks = [];
var inputCount = count;
var minCount = 300;

function parseData(parentIndex, aNode, root){
	inputCount++
	count ++ ;
	var current = inputCount - 1;
	addNode(current, 1, aNode.event, inputCount, inputCount, root);

	if(parentIndex != null){
		addLink(parentIndex, current, 1);
	}

	if(aNode.links != null){
		jQuery.each(aNode.links, function(index, value){
			if(value.count > minCount){
				parseData(current, value.child, false);
			}
		})
	}

}

/*
$.getJSON("trie.json", function(json) {
    parseData(null, json, true);
    console.log(inputCount);
});

*/

//gets data from endpoint specified on server. 

function getData()
$.ajax({
    type: 'GET',
    url: "http://150.242.41.175:5050/rabo/Interaction_Activitys/trie2",
    success:function(data){
        alert('all done');
    }
 });