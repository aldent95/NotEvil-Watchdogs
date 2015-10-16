var buttonHeight = 50;
var buttonWidth = 100;
var labelsShown = true;
var current = "flatButton";
var body = d3.select("body");
var buttonPanel = body.append("div");

var allLabelButton = buttonPanel.append("button")
	.style("height", buttonHeight)
	.style("width", buttonWidth)
	.on("click", function(d){
		if(labelsShown){body.selectAll(".node text").attr("visibility", "hidden");labelsShown = false;}
		else{body.selectAll(".node text").attr("visibility", "inline");labelsShown = true;}
	})

	allLabelButton.append("div").html("Toggle All <br> Labels");

var labelButton = buttonPanel.append("button")
	.style("height", buttonHeight)
	.style("width", buttonWidth)
	.on("click", function(d){
		if(labelsShown){body.selectAll(".node text").attr("visibility", "hidden");labelsShown = false;}

		var selectedLabel = body.select("circle.node_selected + text");
		if(selectedLabel[0][0] == null){selectedLabel = body.select("circle.circle_root_selected + text");}
		if(selectedLabel[0][0] == null){selectedLabel = body.select("circle.circle_end_selected + text");}
		
		if(selectedLabel.attr("visibility") == "inline"){selectedLabel.attr("visibility", "hidden")}
		else{selectedLabel.attr("visibility", "inline")}
	})

	labelButton.append("div").html("Toggle 1 <br> Label");

var flatButton = buttonPanel.append("button")
	.style("height", buttonHeight)
	.style("width", buttonWidth)
	.on("click", function(d){
		resetSize();
	})

	flatButton.append("div").html("Flat <br> Sizing");

var squareButton = buttonPanel.append("button")
	.style("height", buttonHeight)
	.style("width", buttonWidth)
	.attr("class", "squareButton")
	.on("click", function(d){
		if(current == "squareButton"){resetSize()}
		else{
			current = "squareButton";

			force.linkDistance(function(d){
				return(calcNodeSize(d.source.size, "sqrt")*1.5 + calcNodeSize(d.target.size, "sqrt")*1.5 + l);//located in get_input.js
			})
			body.selectAll("circle").attr("r", function(d){
				return calcNodeSize(d.size, "sqrt");
				//return r * (Math.pow(d.size, 1/2) / Math.pow(minCount, 1/2));
			})
			body.selectAll("circle + text").attr("font-size", function(d){
				return ((calcNodeSize(d.size, "sqrt")/3)+"px");
			})
			force.charge(function(d){return (-3)*(calcNodeSize(d.size, "sqrt") * 500 / r)});
            body.selectAll(".link")
            	.style("stroke", "#ccc")
				.style("stroke-width", function(d){
					return (calcNodeSize(d.target.size, "sqrt")/6);
                });
			force.start();
		}
	})

	squareButton.append("div").html("Square <br> Sizing");

var cubeButton = buttonPanel.append("button")
	.style("height", buttonHeight)
	.style("width", buttonWidth)
	.attr("class", "cubeButton")
	.on("click", function(d){
		if(current == "cubeButton"){resetSize()}
		else{
			current = "cubeButton";
			body.selectAll("circle").attr("r", function(d){
				return(calcNodeSize(d.size, "cube"));
			})
			force.linkDistance(function(d){
				return(calcNodeSize(d.source.size, "cube") + calcNodeSize(d.target.size, "cube") + l);//located in get_input.js
			})
			body.selectAll("circle + text").attr("font-size", function(d){
				return ((calcNodeSize(d.size, "cube")/3)+"px");
			})
			force.charge(function(d){return (-1)*(calcNodeSize(d.size, "cube") * 500 / r)});
			body.selectAll(".link")
            	.style("stroke", "#ccc")
				.style("stroke-width", function(d){
					return (calcNodeSize(d.target.size, "cube")/6);
                });
			force.start();
		}
	})

	cubeButton.append("div").html("Cubic <br> Sizing");

var hideButton = buttonPanel.append("button")
	.style("height", buttonHeight)
	.style("width", buttonWidth)
	.attr("class", "logButton")
	.on("click", function(d){
		console.log(selectedNode.id);
		var allChildren = getAllChildren(selectedNode.id);
		var allParents = getAllParents(selectedNode.id);
		console.log(allChildren);
		console.log(allParents);
	})
	
	hideButton.append("div").html("Hide <br> Children");


function resetSize(){
	current = "flatButton";
	body.selectAll("circle").attr("r", r);
	body.selectAll(".link").style("stroke-width", 2);
	body.selectAll("circle + text").attr("font-size", 12);
	force.linkDistance(l);
	force.charge(-500);
	force.start();
}
