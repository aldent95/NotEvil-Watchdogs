var labelsShown = true;
var body = d3.select("body");
var buttonPanel = body.append("div");
var labelButton = body.append("button");

labelButton.on("click", function(d){
	alert("Boo");
	if(labelsShown){body.selectAll(".node text").attr("visibility", "hidden");labelsShown = false;}
	else{body.selectAll(".node text").attr("visibility", "inline");labelsShown = true;}
})