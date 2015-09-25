var frequencyMultiplier = 3;
var axis = d3.svg.axis().orient("top").ticks(1);

/*    
var dateSlider = d3.slider().scale(d3.scale.ordinal().domain([
  "01/12", "02/12", "03/12", "04/12", "05/12", "06/12", "07/12", "08/12", "09/12", "10/12", "11/12", "12/12"
  ]).rangePoints([0, 1], 0.5)).axis(d3.svg.axis()).snap(true).value(["01/12", "12/12"]);

d3.select('#dateSlider').call(dateSlider);
*/
var freqSlider = d3.slider().value(0).on("slide", function(evt, value) {
    d3.select('#freqText').text(Math.round(value*3));
});


    
d3.select('#freqSlider').call(freqSlider);

function getValues(){

	svg.selectAll(".link").data([""]).exit().remove();
	svg.selectAll("circle").data([""]).exit().remove();

    minCount = freqSlider.value();
    while (inputNodes.length) { inputNodes.pop(); }
	while (inputLinks.length) { inputLinks.pop(); }
	while (links.length) { links.pop(); }
	while (nodes.length) { nodes.pop(); }
    count = 0;

	$.getJSON("/static/trie.json", function(json) {
    	parseRoot(json);
    	console.log(count + " Nodes");
	});
	
	redraw();

    
}
