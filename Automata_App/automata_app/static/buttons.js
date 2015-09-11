var buttonHeight = (window.innerHeight * 0.1);
var buttonWidth = (window.innerWidth * 0.75) - 15

var labelsShown = true;

var body = d3.select("body");
var buttonPanel = body.append("div");

var labelButton = buttonPanel.append("button")
	.style("height", 50)
	.style("width", 100)
	.attr("value", "Toggle Labels")
	.on("click", function(d){
		if(labelsShown){body.selectAll(".node text").attr("visibility", "hidden");labelsShown = false;}
		else{body.selectAll(".node text").attr("visibility", "inline");labelsShown = true;}
	});
labelButton.append("div").html("Toggle Labels")