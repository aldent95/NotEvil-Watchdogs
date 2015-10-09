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
		jQuery.each(parentNode.links, function(index, value){
			if(value.count >= minPro){
				parseData(current, value.child, value.count, false);
			}
		});
	}
	else if(children == 1){
		jQuery.each(parentNode.links, function(index, value){
			parseData(current, value.child, value.count, false);
                });
	}
	else{console.log("Cull called without children: ");}
}
