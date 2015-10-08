var expectedPro;
var minPro;
var acceptedRatio = 1;
var first = true;


function cullFromRatio(parentNode, parentSize){
	var children = 0;
	for (e in parentNode.links) { children++; }
		if(children > 1){
		expectedPro = 1 / children;
		minPro = expectedPro * acceptedRatio * parentSize;
		jQuery.each(aNode.links, function(index, value){
			if(value.count >= minPro){
				parseData(null, value.child, value.count, true);
			}
		});
	}
	else if(children == 1){parseData(null, value.child, value.count, true);}
	else{console.log("Cull called without children: ");}
}