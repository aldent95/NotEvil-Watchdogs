var buttonHeight = (window.innerHeight * 0.1);
var buttonWidth = (window.innerWidth * 0.75) - 15

var labelsShown = true;

var body = d3.select("body");
var buttonPanel = body.append("svg")
	.attr("height", buttonHeight)
	.attr("width", buttonWidth)
	.attr("class", "button_panel");

var labelButton = body.append("button")
	.attr("height", buttonHeight)
	.attr("width", buttonWidth);

labelButton.on("click", function(d){
	if(labelsShown){body.selectAll(".node text").attr("visibility", "hidden");labelsShown = false;}
	else{body.selectAll(".node text").attr("visibility", "inline");labelsShown = true;}
})