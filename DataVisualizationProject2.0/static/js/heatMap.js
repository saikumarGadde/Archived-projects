function loadHeatMap(){

	console.log("It cam ehere");
	var chart = dc.heatMap("#canvasHeatMap");
	var legend = dc.heatMap("#canvasHeatMapLegend");
	var heading = $('#heatMapHeading');
	heading.text("Number of Interactions per hour per weekday");
	console.log("testing");

	d3.csv("data/fbData3.csv",function(error,data){		

		console.log("It came into heatMap.js");

		if (error) throw error;
		data.forEach(function(d){
	        d.Post_Hour = +d.Post_Hour;
	        d.Post_Weekday = d.Post_Weekday;
	        d.Total_Interactions = +d.Total_Interactions;
	        
	    });

	    var ndx = crossfilter(data);
	    var runDimension = ndx.dimension(function(d){return [+d.Post_Hour,d.Post_Weekday];});
	    var runGroup = runDimension.group().reduceSum(function(d){return +d.Total_Interactions;});

		var runDimensionLegend = ndx.dimension(function(d){return [+d.Post_Hour,+d.Post_Weekday]});
	    var runGroupLegend = runDimensionLegend.group().reduceSum(function(d){return +d.Total_Interactions;});

		chart
			.width(800)
			.height(300)
			.dimension(runDimension)
			.group(runGroup)
			.keyAccessor(function(d){return +d.key[0];})
			.valueAccessor(function(d){return d.key[1];})
			.colorAccessor(function(d){return +d.value;})
			.title(function(d){
				return "Hour: " + d.key[0] + "\n" +
               "Weekday:  " + d.key[1] + "\n" +
               "Total Interactions: " + (d.value) ;})
			.colors(d3.scale.linear().domain([0,1000]).range(["green","blue"]))
			.legend(dc.legend())
			.calculateColorDomain()
			;

		chart.margins().left = 60;

		// chart.rowsLabel(["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","sunday"]);
		legend
			.width(1000)
			.height(100)
			.dimension(runDimensionLegend)
			.group(runGroupLegend)
			.keyAccessor(function(d){return +d.value;})
			.valueAccessor(function(d){return 1;})
			.colorAccessor(function(d){return +d.value;})
			.colsLabel(function(d){
			})
			.colors(d3.scale.linear().domain([0,1000]).range(["green","blue"]))
			.calculateColorDomain()

			.rowsLabel(function(d){
				return "legend";
			})
			;
			legend.margins().left =60;
		// legend.xAxis().ticks(20);

		chart.render();
		legend.render();

			});

};

$('#FBHeatMap').click(loadHeatMap);

