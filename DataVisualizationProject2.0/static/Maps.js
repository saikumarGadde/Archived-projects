var usChart = dc.geoChoroplethChart('#dcJsUsaMap2', "usChart");
var usChart2 = dc.geoChoroplethChart('#dcJsUsaMap3');
var usChart3 = dc.geoChoroplethChart('#dcJsUsaMap4');
// var chart = dc.dataTable('#tableChart');
var rowChart = dc.rowChart('#companyBarChart');
var fill = d3.scale.category20();

function loadCanvasData(companyName) {

    d3.csv("/" + companyName, function(error, data1) {
        if (error) throw error;
        data1.forEach(function(d) {
            d.ADDRESS = d.ADDRESS;
            d.STNAME = d.STNAME;
        });

        var ndx1 = crossfilter(data1);
        var state = ndx1.dimension(function(d) { return d.STNAME ? d.STNAME : ""; });
        var states = state.group().reduceCount(function(d) { return d.STNAME ? d.STNAME : "" });

        d3.json("/usa_states.json", function(statesJson) {
            usChart.width(990)
                .height(500)
                .dimension(state)
                .group(states)
                .colors(d3.scale.threshold().range(["#f0f0f0", "#e5f5f9", "#99d8c9", "#2ca25f", "#207234"]))
                .colorDomain([0, 100, 200, 300])
                .colorCalculator(function(d) { return d ? usChart.colors()(d) : '#ccc'; })
                .overlayGeoJson(statesJson.features, "state", function(d) {
                    return d.properties.name;
                })
                .valueAccessor(function(kv) {
                    return kv.value;
                });
            dc.renderAll("usChart");
        });
    });
};

function loadSentimentData(companyName, var2) {
    d3.csv("/" + companyName, function(error, data2) {

        if (error) throw error;
        var ndx2 = crossfilter(data2);
        var states2 = ndx2.dimension(function(d) { return d.State; });
        var sentiments = states2.group().reduceSum(function(d) { return +d.sentimentValue; });
        var product = ndx2.dimension(function(d) { return d.Pr; });
        var products = product.group().reduceCount(function(d) { return d.Pr; });
        var noOfComplaints = states2.group().reduceCount(function(d) { return d.State; });

        // var fmt = d3.format('02d');
        // // var complaints = ndx2.dimension(function(d) { return [+d.sentimentValue, d.State, d['Consumer complaint narrative']]; }),
        //     grouping = function(d) { return d['Consumer complaint narrative']; };

        d3.json("/usa_states.json", function(statesJson2) {

            usChart2.width(990)
                .height(500)
                .dimension(states2)
                .group(sentiments)
                .colors(d3.scale.threshold().range(["#000000", "#ffffff", "#000000", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]))
                .colorDomain([0, 0.002, 0.004, 0.006, 0.008, 0.01, 0.02])
                .colorCalculator(function(d) { return d ? usChart2.colors()(d) : '#ccc'; })
                .overlayGeoJson(statesJson2.features, "state", function(d) {
                    return d.properties.name;
                })
                .valueAccessor(function(kv2) {
                    return kv2.value / noOfComplaints.all().filter(function(item) { return item.key === kv2.key; })[0].value;
                });

            usChart3.width(990)
                .height(500)
                .dimension(states2)
                .group(noOfComplaints)
                .colors(d3.scale.threshold().range(['#f0f0f0', '#edf8b1', '#7fcdbb', '#2c7fb8']))
                .colorDomain([0, 100, 500])
                .colorCalculator(function(d) { return d ? usChart3.colors()(d) : '#ccc'; })
                .overlayGeoJson(statesJson2.features, "state", function(d) {
                    return d.properties.name;
                })
                .valueAccessor(function(kv2) {
                    return kv2.value;
                });
            rowChart
                .width(768)
                .height(420)
                .x(d3.scale.linear().domain([0, 35000]))
                .elasticX(true)
                .dimension(product)
                .group(products);
            dc.renderAll();

        });

        // chart
        //     .width(768)
        //     .height(480)
        //     .dimension(complaints)
        //     .group(grouping)
        //     .size([5])
        //     .columns(['  Consumer complaints'])
        //     .sortBy(function(d) { return +d.sentimentValue; })
        //     .order(d3.ascending)
        // chart.render();

        var json_data = [('America', 14387), ('Bank', 14247), ('account', 11420), ('credit', 6985), ('would', 6434), ('loan', 6286), ('bank', 6100), ('The', 5500), ('card', 4986), ('told', 4853), ('payment', 4765), ('``', 4298), ("n't", 4204), ("''", 4145), ('mortgage', 4078), ('time', 3921), ('BOA', 3603), ("'s", 3430), ('received', 3353), ('called', 3240), ('money', 3150), ('could', 3018), ('!', 3000), ('payments', 2999), ('home', 2985), ('check', 2971), ('get', 2958), ('back', 2942), ('said', 2873), ('They', 2854), ('never', 2766), ('information', 2751), ('This', 2724), ('pay', 2695), ('made', 2674), ('years', 2492), ('letter', 2475), ('modification', 2462), ('...', 2461), ('call', 2349), ('sent', 2338), ('We', 2326), ('amount', 2310), (':', 2267), ('due', 2248), ('paid', 2225), ('balance', 2181), ('fees', 2116), ('also', 2099), ('since', 2003)];
        var word_list = [];
        var x = ['America', 'Bank', 'account', 'credit', 'would', 'loan', 'bank', 'The', 'card', 'told', 'payment', '``', 'mortgage', 'time', 'BOA', 'received', 'called', 'money', 'could', 'payments', 'home', 'check', 'get', 'back', 'said', 'They', 'never', 'information', 'This', 'pay', 'made', 'years', 'letter', 'modification', 'call', 'sent', 'We', 'amount', 'due', 'paid', 'balance', 'fees', 'also', 'since', 'days', 'us', 'interest', 'fee', 'My', 'asked'];
        var morgan = ['Chase', 'account', 'credit', 'would', 'card', 'The', 'bank', 'told', 'payment', 'loan', '``', 'time', 'received', 'called', 'mortgage', 'money', 'Bank', 'back', 'They', 'could', 'check', 'said', 'get', 'payments', 'pay', 'made', 'This', 'never', 'information', 'letter', 'sent', 'call', 'paid', 'balance', 'amount', 'interest', 'home', 'due', 'asked', 'We', 'also', 'days', 'years', 'phone', 'make', 'since', 'us', 'chase', 'even', 'funds'];
        var capital = ['One', 'credit', 'Capital', 'account', 'card', 'would', 'payment', 'told', 'one', 'The', 'called', 'time', 'received', 'They', 'information', '``', 'bank', 'call', 'payments', 'late', 'pay', 'never', 'back', 'made', 'said', 'balance', 'report', 'paid', 'could', 'get', 'due', 'debt', 'company', 'This', 'sent', 'letter', 'asked', 'days', 'interest', 'phone', 'money', 'amount', 'still', 'charge', 'number', 'also', 'make', 'closed', 'since', 'charges'];
        var wellsFargo = ['Fargo', 'Wells', 'account', 'loan', 'would', 'payment', 'The', 'mortgage', 'credit', 'told', 'bank', 'home', 'time', 'payments', '``', 'received', 'get', 'could', 'money', 'They', 'We', 'called', 'pay', 'back', 'modification', 'us', 'check', 'made', 'never', 'said', 'card', 'This', 'letter', 'information', 'due', 'interest', 'years', 'call', 'paid', 'sent', 'also', 'help', 'amount', 'asked', 'My', 'make', 'balance', 'month', 'since', 'months'];
        var jpmorgan = ['Chase', 'account', 'credit', 'would', 'card', 'The', 'loan', 'told', 'bank', 'payment', '``', 'received', 'time', 'mortgage', 'called', 'back', 'money', 'get', 'payments', 'Bank', 'They', 'check', 'said', 'pay', 'could', 'This', 'never', 'balance', 'made', 'sent', 'interest', 'letter', 'paid', 'information', 'call', 'due', 'home', 'We', 'asked', 'amount', 'also', 'days', 'chase', 'since', 'years', 'us', 'phone', 'even', 'make', 'number'];
        var y = [];
        if (var2 == 1) {
            y = x;
        } else if (var2 == 2) {
            y = morgan;
        } else if (var2 == 3) {
            y = capital;
        } else if (var2 == 4) {
            y = wellsFargo;
        } else if (var2 == 5) {
            y = jpmorgan;
        }
        var layout = d3.layout.cloud()
            .size([2000, 1000])
            .words(y
                .map(function(d) {
                    return { text: d, size: (x.length - x.indexOf(d)) * 3, test: "haha" };
                }))
            .padding(5)
            .rotate(function() { return ~~(Math.random() * 2) * 90; })
            .font("Impact")
            .fontSize(function(d) { return d.size; })
            .on("end", draw);
        layout.start();

        function draw(words) {
            d3.select("#word_cloud").append("svg")
                .attr("width", layout.size()[0])
                .attr("height", layout.size()[1])
                .append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .style("font-family", "Impact")
                .style("fill", function(d, i) { return fill(i); })
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
        };
    });

};

var myVar = document.getElementById('CompanySelected').value;
console.log('The value of myVarriable is : ' + myVar);
$('#dcJsUsaMap2').empty();
$('#dcJsUsaMap3').empty();

if (myVar == 1) {
    $('#word_cloud').empty()
    $('#dcJsUsaMap2').empty();
    $('#dcJsUsaMap3').empty();
    $('#companyBarChart').empty();
    loadCanvasData('bofa_branches.csv');
    loadSentimentData('bofa.csv', 1);
    // drawBarCharts('Bank of America');
} else if (myVar == 2) {
    $('#word_cloud').empty()
    $('#dcJsUsaMap2').empty();
    $('#dcJsUsaMap3').empty();
    $('#companyBarChart').empty();
    loadCanvasData('morgan_branches.csv');
    loadSentimentData('morgan.csv', 2);
} else if (myVar == 3) {
    $('#word_cloud').empty()
    $('#dcJsUsaMap2').empty();
    $('#dcJsUsaMap3').empty();
    $('#companyBarChart').empty();
    loadCanvasData('capital_branches.csv');
    loadSentimentData('capital.csv', 3);
} else if (myVar == 4) {
    $('#word_cloud').empty()
    $('#dcJsUsaMap2').empty();
    $('#dcJsUsaMap3').empty();
    $('#companyBarChart').empty();
    loadCanvasData('wells_branches.csv');
    loadSentimentData('wellsfargo.csv', 4);
} else if (myVar == 5) {
    $('#word_cloud').empty()
    $('#dcJsUsaMap2').empty();
    $('#dcJsUsaMap3').empty();
    $('#companyBarChart').empty();
    loadCanvasData('jpm_branches.csv');
    loadSentimentData('jpmorgan.csv', 5);
};
console.log('Did u even come here?');