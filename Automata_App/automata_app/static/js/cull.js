var culled = 0;
var acceptedRatio = 1.2;
var first = true;
var smallest;


function cullFromRatio(parentNode, parentSize, curIndex){
	var children = 0;
	var minPro;
	for (e in parentNode.links) { children++; }
	
	if(children > 1){
		minPro = acceptedRatio * parentSize / children;
		//console.log(curIndex + " minPro " + minPro);
		//console.log(curIndex + " parentSize " + parentSize);
		//console.log(curIndex + " children " + children);
		jQuery.each(parentNode.links, function(index, value){
			if(value.count > minPro){
				if(value.count < smallest || smallest == null){smallest = value.count};
				//console.log(curIndex + " " + index + " child " + value.count);
				parseData(curIndex, value.child, value.count, false);
			}
			else{culled++;}
		});
	}
	else if(children == 1){
		jQuery.each(parentNode.links, function(index, value){
			if(value.count < parentSize / 2){
				parseData(curIndex, value.child, value.count, false);
			}
                });
	}
	else{console.log("Cull called without children: ");}
}
