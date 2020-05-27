function loadCanvas(){
	
	console.log("It came here");

	var chart1 = dc.scatterPlot("#test1");
	var chart2 = dc.scatterPlot("#test2");
	var chart3 = dc.scatterPlot("#test3");

	d3.csv("data/testing_data.csv",function(error,data){
	  if (error) throw error;

	  data.forEach(function(d){
	      // d.WineType = +d.WineType;
	      d.fixedacidity = +d.fixedacidity;
	      d.pH = +d.pH;
	      d.quality = +d.quality;
	      d.alcohol = +d.alcohol;
	      d.sulphates = +d.sulphates;
	      d.density = +d.density;
	      d.totalsulfurdioxide = +d.totalsulfurdioxide;
	      d.freesulfurdioxide = +d.freesulfurdioxide;
	      d.chlorides = +d.chlorides;
	      d.residualsugar = +d.residualsugar;
	      d.citricacid = +d.citricacid;
	      d.volatileacidity = +d.volatileacidity;
	  });

	var ndx = crossfilter(data);
	var dim1 = ndx.dimension(function (d) {
	      return [+d.volatileacidity , +d.quality ];});
	var dim2 = ndx.dimension(function (d) {
	      return [ +d.alcohol, +d.totalsulfurdioxide ];});
	var dim3 = ndx.dimension(function(d){
	      return [+d.residualsugar, +d.pH ];});

	var group1 = dim1.group();
	var group2 = dim2.group();
	var group3 = dim3.group();

	chart1.width(300)
	  .height(350)
	  .x(d3.scale.linear().domain([0,2]))
	  .y(d3.scale.linear().domain([2,10]))
	  .yAxisLabel(" Quality ")
	  .xAxisLabel("Volatile Acidity")
	  .clipPadding(10)
	  .dimension(dim1)
	  .excludedOpacity(0.5)
	  .group(group1)
	  ;
	  chart1.xAxis().ticks(5);

	chart2.width(300)
	  .height(350)
	  .x(d3.scale.linear().domain([8,16]))
	  .y(d3.scale.linear().domain([0,300]))
	  .yAxisLabel("Total Suplhur Dioxide")
	  .xAxisLabel("alcohol")
	  .clipPadding(10)
	  .dimension(dim2)
	  .excludedColor('#ddd')
	  .group(group2);
	  chart2.xAxis().ticks(6);

	chart3.width(300)
	  .height(350)
	  .x(d3.scale.linear().domain([0,10]))
	  .yAxisLabel("pH")
	  .xAxisLabel("Residual Sugar")
	  .clipPadding(10)
	  .dimension(dim3)
	  .excludedColor('#ddd')
	  .group(group3);
	  chart3.xAxis().ticks(6);

	dc.renderAll();
  });
};

$('#wineScatterBrush').click(loadCanvas);












