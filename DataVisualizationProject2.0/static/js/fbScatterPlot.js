function loadCanvas(){

	var $canvaselement = $('#fbScatterPlot');

	var canvasWidth = 500;
	var canvasHeight = 400;
	var margin = {top: 20, bottom: 20, left: 80, right: 20};

	var width = canvasWidth - margin.left - margin.right;
	var height = canvasHeight - margin.top - margin.bottom;

	var x = d3.scaleLinear()
                    .range([0,width]);

    var y = d3.scaleLinear()
                .range([height,0]);
    
    svg = d3.selectAll("#fbScatterPlot")
            .append("svg")
            .attr("transform","translate("+margin.left+","+margin.top+")")
            .attr("width",canvasWidth)
            .attr("height",canvasHeight)
            .append("g");

     var tooltip = d3.select("body")
                        .append("div")
                        .attr("class","tooltip")
                        .style("opacity",0);

    

    d3.csv("data/fbData2.csv",function(error,data){

			if (error) throw error;
			console.log("The data has come in fbScatterPlot.js");

			data.forEach(function(d){
				d.val1 = +d.share;
				d.val2 = +d.like;
				d.val3 = +d.Page_total_likes;
				d.val4 = +d.Type;
			});

			var colorScale = d3.scaleLinear().domain([0,5]).range(["red","green","black","pink","blue"]);
			var color = d3.scaleOrdinal(d3.schemeCategory10);
			// x.domain([d3.min(data,function(d){return d.val1;})-1,d3.max(data,function(d){return d.val1;})]);
			// y.domain([d3.min(data,function(d){return d.val2;})-1,d3.max(data,function(d){return d.val2;})]);

			x.domain([0,180]);
			y.domain([0,2000]);

			svg.append("g")
				.attr("transform","translate("+margin.left+","+height+")")
				.call(d3.axisBottom(x))
			.append("text")
				.attr("x",width)
				.attr("y",-6)
				.style("text-anchor","end")
				.text("XAXIS Value")
				;

			svg.append("g")
				.attr("transform","translate("+margin.left+",0)")
				.call(d3.axisLeft(y));

			svg.append("text")
				.attr("transform","translate("+ (margin.left+width/2) +","+ (height+margin.top+margin.bottom/2) +")")
				.style("text-anchor","middle")
				.text("Number of Shares");

			svg.append("text")
				.attr("transform","translate("+margin.left/2+","+height/2+")rotate(-90)")
				.style("text-anchor","middle")
				.text("Number of Likes");

			// Draw DOTS here
			svg.selectAll(".dot")
				.data(data)
				.enter().append("circle")
				.attr("transform","translate("+margin.left+",0)")
				.attr("r",function(d){return 5;})
				.style("fill",function(d){return color(d.val4);})
				.style("opacity",0.8)
				.attr("cx",function(d){return x(d.val1)})
				.attr("cy",function(d){return y(d.val2)})
				.on("mouseover",function(d){
                    tooltip.transition()
                            .duration(500)
                            .style("opacity",0.9);

                    tooltip.html("Page Total Likes : "+d.val3)
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
							.data(color.domain())
							.enter()
							.append("g")
							.attr("class","legend")
							.attr("transform",function(d,i){return "translate(0,"+i*20+")";});

			legend.append("rect")
					      .attr("x", width - 18)
					      .attr("width", 18)
					      .attr("height", 18)
					      .style("fill", color);

			 legend.append("text")
					      .attr("x", width - 24)
					      .attr("y", 9)
					      .attr("dy", ".35em")
					      .style("text-anchor", "end")
					      .text(function(d) { 
					      	if(d==1){
					      		return "Photo";
					      	}else if(d==2){
					      		return "Status";
					      	}else if(d==3){
					      		return "Link";
					      	}else if(d==4){
					      		return "Status";
					      	};


					      })

		});
};

$('#fbScatterPlotButton').click(loadCanvas);





