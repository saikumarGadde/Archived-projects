function loadCanvas(){
	console.log("Whats appening here?");
	var yearRingChart   = dc.pieChart("#chart-ring-year");
	console.log("It came into the canvas ");

	d3.csv("../mainData.csv",function(error,data){
	    
	    console.log("Loaded data");
	    if (error) throw error;
	    data.forEach(function(d){
	        d.product = d.product;
	        d.subProduct = d.subProduct;
	        d.Issue  = d.Issue;
	        d.Company = d.Company;
	        console.log("I think theres some problem here");
	        d.State = d.State;
	        d.submittedVia  = d['Submitted via'];
	    });
	    
	// set crossfilter
		console.log("Setting Crossfilter");

	  var ndx = crossfilter(data);
	  console.log("Maybe here is the porblem");
	  var product  = ndx.dimension(function(d) {return d.product});
	  console.log("Maybe here is the porblem");
	  var products = product.group().reduceCount(function(d){return d.product; });
	  console.log("Maybe here is the porblem");

	  yearRingChart
	    .width(500)
	    .height(300)
	    .dimension(product)
	    .group(products)
	    .legend(dc.legend().x(400).y(10))
	    .innerRadius(30)
	    .controlsUseVisibility(true)
	    ;
	dc.renderAll();
	});
};

$('#submit-btn3').click(loadCanvas);



