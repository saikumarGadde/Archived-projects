function loadCanvas(){

	var $head = $('#body');
	var $canvaselement = $('#fbLineChart');

	var $body = $('body');

	console.log("The program is in the fbscatterplot.js");

	var canvasWidth = 800;
	var canvasHeight = 400;
	var margin = {top: 20, bottom: 20, left: 60, right: 20};

	var width = canvasWidth - margin.left - margin.right;
	var height = canvasHeight - margin.top - margin.bottom;

	var x = d3.scaleLinear()
                    .range([0,width]);

    var y = d3.scaleLinear()
                .range([height,0]);
    
    svg = d3.selectAll("#fbLineChart")
            .append("svg")
            .attr("transform","translate("+margin.left+","+margin.top+")")
            .attr("width",width + margin.left + margin.right)
            .attr("height",height + margin.top + margin.bottom)
            .append("g");

     var tooltip = d3.select("body")
                        .append("div")
                        .attr("class","tooltip")
                        .style("opacity",0);

    var line = d3.line()
			    .x(function(d) { return x(d.Page_total_likes); })
			    .y(function(d) { return y(d.Total_Interactions); });
	var line2 = d3.line()
			    .x(function(d) { return x(d.Page_total_likes); })
			    .y(function(d) { return y(d.comment); });

	var line3 = d3.line()
			    .x(function(d) { return x(d.Page_total_likes); })
			    .y(function(d) { return y(d.Like); });
	var line4 = d3.line()
			    .x(function(d) { return x(d.Page_total_likes); })
			    .y(function(d) { return y(d.share); });

	var tooltip = d3.select("body")
                        .append("div")
                        .attr("class","tooltip")
                        .style("opacity",0);

    d3.csv("data/fbData2.csv",function(error,data){

			if (error) throw error;
			console.log("The data has come");

			data.forEach(function(d){
				d.Type = +d.Type;
		        d.comment = +d.comment;
		        d.Like = +d.like;
		        d.share = +d.share;
		        d.Category = +d.Category;
		        d.Paid = +d.Paid;
		        d.Total_Interactions = +d.Total_Interactions;
		        d.Page_total_likes = +d.Page_total_likes;
			});

			x.domain([d3.min(data,function(d){return d.Page_total_likes})-1,d3.max(data,function(d){return d.Page_total_likes})+1]);
			y.domain([d3.min(data,function(d){return d.Total_Interactions})-1,d3.max(data,function(d){return d.Like})+10]);

			svg.append("g")
				.attr("transform","translate("+margin.left+","+height+")")
				.call(d3.axisBottom(x));

			svg.append("g")
				.attr("transform","translate("+margin.left+",0)")
				.call(d3.axisLeft(y));

			svg.append("text")
				.attr("transform","translate("+ (margin.left+width/2) +","+ (height+margin.top+margin.bottom/2) +")")
				.style("text-anchor","middle")
				.text("Page total likes");

			svg.append("text")
				.attr("transform","translate("+margin.left/6+","+height/2+")rotate(-90)")
				.style("text-anchor","middle")
				.text("Total Interactions");

			svg.append("path")
				.datum(data)
				.attr("fill","none")
				.attr("transform","translate("+margin.left+",0)")
				.attr("stroke", function(d){return "blue";})
			      .attr("stroke-linejoin", "round")
			      .attr("stroke-linecap", "round")
			      .attr("stroke-width", 1.5)
			      .attr("d", line)
			      .on("mouseover",function(d){
                    tooltip.transition()
                            .duration(500)
                            .style("opacity",0.9);

                    tooltip.html("likes : "+d.Like)
                            .style("left",(d3.event.pageX + 5)+"px")
                            .style("top",(d3.event.pageY-28)+"px");
                })
                .on("mouseout",function(d){
                    tooltip.transition()
                            .duration(500)
                            .style("opacity",0)
                });             
			      ;
			
		});
};

$('#fbLineChartButton').click(loadCanvas);





