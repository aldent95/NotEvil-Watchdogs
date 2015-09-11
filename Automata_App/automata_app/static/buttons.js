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

	labelButton.append("div").html("Toggle <br> Labels");

var flatButton = buttonPanel.append("button")
	.style("height", buttonHeight)
	.style("width", buttonWidth)
	.on("click", function(d){
		body.selectAll(".circle").attr("r", r);
		force.linkDistance(l);
	})

	flatButton.append("div").html("Flat <br> Sizing");

var logButton = buttonPanel.append("button")
	.style("height", buttonHeight)
	.style("width", buttonWidth)
	.on("click", function(d){
		body.selectAll(".circle").attr("r", function(d){
			return r * (Math.log(d.size)/Math.log(minCount));
		})
		force.linkDistance(l);
	})

	logButton.append("div").html("Log <br> Sizing");

var cubeButton = buttonPanel.append("button")
	.style("height", buttonHeight)
	.style("width", buttonWidth)
	.on("click", function(d){
		body.selectAll(".circle").attr("r", function(d){
			return r * (Math.pow(d.size, 1/3) / Math.pow(minCount, 1/3));
		})
		force.linkDistance(2*l);
	})

	cubeButton.append("div").html("Cubic <br> Sizing");