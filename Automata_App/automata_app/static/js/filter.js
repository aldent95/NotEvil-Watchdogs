var frequencyMultiplier = 3;
var axis = d3.svg.axis().orient("top").ticks(1);

var freqSlider = d3.slider().value(0).on("slide", function(evt, value) {
    d3.selectAll('#freqText').text("Min Frequency: " + Math.round(value*3));
});




var sliderPanel = buttonPanel.append("div").style("height", buttonHeight).style("width", 300)
	.style("display", "inline-block")
	.style("padding", "0px 15px 0px");
	sliderPanel.append("span").attr("id", "freqText").html("Min Frequency: " + minCount);
	sliderPanel.append("div").call(freqSlider);
buttonPanel.append("button").style("height", buttonHeight).style("width", buttonWidth).style("display", "inline").on("click", function(d){getValues()}).html("Update <br> MinFreq");
function getValues(){

	svg.selectAll(".link").data([""]).exit().remove();
	svg.selectAll("circle").data([""]).exit().remove();

    minCount = freqSlider.value();
    while (inputNodes.length) { inputNodes.pop(); }
	while (inputLinks.length) { inputLinks.pop(); }
	while (links.length) { links.pop(); }
	while (nodes.length) { nodes.pop(); }
    count = 0;

	parseRoot(storedTrie);
	console.log(count + " Nodes");
	
	redraw();

    
}
