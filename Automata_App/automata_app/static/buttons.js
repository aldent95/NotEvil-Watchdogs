
var body = d3.select("body");
var buttonPanel = body.append("div");
var labelButton = body.append("button");

labelButton.on("click", function(d){
	alert("Boo");
	body.selectAll(".node text").attr("visibility", "hidden");
})