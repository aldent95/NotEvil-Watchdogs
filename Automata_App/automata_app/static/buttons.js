var buttonHeight = 50;

var labelsShown = true;

var body = d3.select("body");
var buttonPanel = body.append("div").attr("height", buttonHeight);
var labelButton = body.append("button").attr("height", buttonHeight);

labelButton.on("click", function(d){
	if(labelsShown){body.selectAll(".node text").attr("visibility", "hidden");labelsShown = false;}
	else{body.selectAll(".node text").attr("visibility", "inline");labelsShown = true;}
})