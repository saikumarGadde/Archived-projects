function loadCanvas(){

	var $head = $('#body');
	// var script = document.createElement("script");

	// script.type = "text/javascript";
	// script.src = "../d3/d3.js";
	// $head.append(script); 

	var $canvaselement = $('#wineScatterPlot');

	var $body = $('body');

	console.log("The program is in the WineScatterPlot.js");

	var canvasWidth = 500;
	var canvasHeight = 400;
	var margin = {top: 20, bottom: 20, left: 70, right: 20};

	var width = canvasWidth - margin.left - margin.right;
	var height = canvasHeight - margin.top - margin.bottom;

	var x = d3.scaleLinear()
                    .range([0,width]);

    var y = d3.scaleLinear()
                .range([height,0]);
    
    svg = d3.selectAll("#wineScatterPlot")
            .append("svg")
            .attr("transform","translate("+margin.left+","+margin.top+")")
            .attr("width",width + margin.left + margin.right)
            .attr("height",height + margin.top + margin.bottom)
            .append("g");

     var tooltip = d3.select("body")
                        .append("div")
                        .attr("class","tooltip")
                        .style("opacity",0);

    var colorScale = d3.scaleLinear().domain([2.7,3.9]).range(["red","blue"]);

    d3.csv("data/testing_data.csv",function(error,data){

			if (error) throw error;
			console.log("The data has come");

			data.forEach(function(d){
				d.fixedacidity = +d.fixedacidity;
				d.pH = +d.pH;
				d.quality = +d.quality;
				d.alcohol = +d.alcohol;
			});

			x.domain([4,15]);
			y.domain([8,15]);

			// var color = d3.scaleOrdinal(d3.schemeCategory10);
			// console.log(data);
			// Call X Axis here

			svg.append("g")
				.attr("transform","translate("+margin.left+","+height+")")
				.call(d3.axisBottom(x));

			svg.append("g")
				.attr("transform","translate("+margin.left+",0)")
				.call(d3.axisLeft(y));

			svg.append("text")
				.attr("transform","translate("+ (margin.left+width/2) +","+ (height+margin.top+margin.bottom/2) +")")
				.style("text-anchor","middle")
				.text("Fixed Acidity");

			svg.append("text")
				.attr("transform","translate("+margin.left/2+","+height/2+")rotate(-90)")
				.style("text-anchor","middle")
				.text("Alchohol Content");

			// Draw DOTS here
			svg.selectAll(".dot")
				.data(data)
				.enter().append("circle")
				.attr("transform","translate("+margin.left+",0)")
				.attr("r",function(d){return d.quality;})
				.style("fill",function(d){return colorScale(d.pH);})
				.style("opacity",0.9)
				.attr("cx",function(d){return x(d.fixedacidity)})
				.attr("cy",function(d){return y(d.alcohol)})
				.on("mouseover",function(d){
                    tooltip.transition()
                            .duration(500)
                            .style("opacity",0.9);

                    tooltip.html("citric acid : "+d.citricacid)
                            .style("left",(d3.event.pageX + 5)+"px")
                            .style("top",(d3.event.pageY-28)+"px");
                })
                .on("mouseout",function(d){
                    tooltip.transition()
                            .duration(500)
                            .style("opacity",0)
                });             
				;	

			var legend = svg.selectAll(".legend")
							.data(colorScale.domain())
							.enter()
							.append("g")
							.attr("class","legend")
							.attr("transform",function(d,i){return "translate(0,"+i*20+")";});
			legend.append("rect")
					      .attr("x", width - 18)
					      .attr("width", 18)
					      .attr("height", 18)
					      .style("fill", colorScale);

			 legend.append("text")
					      .attr("x", width - 24)
					      .attr("y", 9)
					      .attr("dy", ".35em")
					      .style("text-anchor", "end")
					      .text(function(d) {  
					      	if(d>3){
					      		return "More BASIC";
					      	}else{
					      		return "More ACIDIC";
					      	}
					      	  });
		});
};

$('#wineScatterPlotButton').click(loadCanvas);





