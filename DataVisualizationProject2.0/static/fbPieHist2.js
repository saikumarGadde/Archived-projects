var yearRingChart = dc.pieChart("#chart-ring-year");
var barChart = dc.barChart("#barChart")
    .xAxisLabel('Company Name')
    .yAxisLabel('Number of complaints');
var usChart = dc.geoChoroplethChart('#dcJsUsaMap');
var usChart2 = dc.geoChoroplethChart('#dcJsUsaMap2');
var pieSpark = dc.pieChart('#pietest2', "testing");
var barSpark = dc.barChart('#barChartSpark', "barSpark");

console.log("This file is called;");

d3.csv("/testing.csv", function(error, data) {
    console.log('I came here in the testing.csv');
    var ndx = crossfilter(data);
    var statistic = ndx.dimension(function(d) { return d.statistic; });
    var statistic_group = statistic.group().reduceSum(function(d) { return d.value; });
    pieSpark
        .width(40)
        .height(40)
        .dimension(statistic)
        .group(statistic_group);
    dc.renderAll("testing");
});

d3.csv("/spark2.csv", function(error, data) {
    var ndx = crossfilter(data);
    var time = ndx.dimension(function(d) { return d.time; });
    var times = time.group().reduceSum(function(d) { return d.percent; });
    barSpark
        .width(200)
        .height(40)
        .margins({ left: 0, top: 0, right: 0, bottom: 0 })
        .x(d3.scale.linear().domain([1, 7]))
        .brushOn(true)
        .dimension(time)
        .group(times);
    dc.renderAll("barSpark");
});

d3.csv("/mainData6.csv", function(error, data) {

    if (error) throw error;

    var value = 0;
    var companies = ['Equifax', 'Experian', 'Wells Fargo & Company', 'Bank of America', 'Citibank', 'JPMorgan Chase & Co.']
    var countByType = {}

    data.forEach(function(d) {
        d.Pr = d.Pr;
        d.Co = d.Co;
        d.St = d.St;
        d.Se = +d.Se;

        if (companies.includes(d.Co)) {
            value = value + 1;
            d.companies = d.Co;
            // console.log(d.Company)
        };
    });

    var ndx = crossfilter(data);
    var product = ndx.dimension(function(d) { return d.Pr; });
    var products = product.group().reduceCount(function(d) { return d.Pr; });

    var companie = ndx.dimension(function(d) { return d.companies; });
    var companys = companie.group().reduceCount(function(d) { return d.companies; });

    // The following variables are for the creation of choropleth map. 
    var states = ndx.dimension(function(d) { return d.St; });
    var sentiments = states.group().reduceSum(function(d) { return +d.Se });
    var statesCount = states.group().reduceCount(function(d) { return d.St; });

    var numberFormat = d3.format(".2f");
    var noOfComplaints = states.group().reduceCount(function(d) { return d.St; });

    for (var i = 0; i < companie.length; i++) {
        console.log('' + companie[i])
    };

    yearRingChart
        .width(800)
        .height(600)
        .dimension(product)
        .group(products)
        .legend(dc.legend().x(500).y(10))
        .innerRadius(30)
        .controlsUseVisibility(true);

    barChart
        .width(800)
        .height(550)
        .margins({ top: 10, right: 100, bottom: 80, left: 80 })
        .dimension(companie)
        .group(companys)
        .elasticY(true)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .colors(["orange"])
        .valueAccessor(function(d) { if (d > 20000) { return d - 10000 } else { return d; } })
        .yAxis().ticks(5);

    barChart.on('renderlet', function(chart) {
        chart.selectAll('g.x text')
            .attr('transform', 'translate(0,0)rotate(45)')
            .style("text-anchor", "start");
    });
    // "#2c7fb8", "#efedf5", "#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"
    // "#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"
    d3.json("/usa_states.json", function(statesJson) {
        console.log("Whats wrong with this code? ");
        usChart.width(990)
            .height(500)
            .dimension(states)
            .group(sentiments)
            .colors(d3.scale.threshold().range(['#f03b20', '#feb24c', '#ffeda0', '#955301', '#f0f0f0']))
            .colorDomain([0, 0.004, 0.11, 0.021, 0.03])
            .colorCalculator(function(d) { return d ? usChart.colors()(d) : '#ccc'; })
            .overlayGeoJson(statesJson.features, "state", function(d) {
                return d.properties.name;
            })
            .valueAccessor(function(kv) {

                return kv.value / noOfComplaints.all().filter(function(item) { return item.key === kv.key; })[0].value;
            })
            .title(function(d) {
                return "State: " + d.key + "\nCummulative Sentiment: " + numberFormat(d.value ? d.value : 0);
            })
            .legend();

        usChart2.width(990)
            .height(500)
            .dimension(states)
            .group(statesCount)
            .colors(d3.scale.threshold().range(['#f0f0f0', '#e5f5e0', '#a1d99b', '#31a354']))
            .colorDomain([0, 1000, 10000, 24000])
            .legend(dc.legend())
            .colorCalculator(function(d) { return d ? usChart2.colors()(d) : '#ccc'; })
            .overlayGeoJson(statesJson.features, "state", function(d) {
                return d.properties.name;
            })
            .valueAccessor(function(kv) {
                return kv.value;
            })
            .title(function(d) {
                return "State: " + d.key + "\nNumber of Complaints: " + numberFormat(d.value ? d.value : 0);
            })
            .legend();

        dc.renderAll();
    });

});