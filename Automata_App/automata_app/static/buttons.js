var buttonHeight = 50;
var buttonWidth = 100;
var labelsShown = true;

var body = d3.select("body");
var buttonPanel = body.append("div");

var labelButton = buttonPanel.append("button")
	.style("height", buttonHeight)
	.style("width", buttonWidth)
	.on("click", function(d){
		if(labelsShown){body.selectAll(".node text").attr("visibility", "hidden");labelsShown = false;}
		else{body.selectAll(".node text").attr("visibility", "inline");labelsShown = true;}
	})

	labelButton.append("div").html("Toggle Labels");

var logButton = buttonPanel.append("button")
	.style("height", buttonHeight)
	.style("width", buttonWidth)
	.on("click", function(d){
		body.selectAll(".node").attr("r", function(d){
			return r * (Math.log(d.size)/Math.log(minSize));
		})
	})

	logButton.append("div").html("Log Sizing");
