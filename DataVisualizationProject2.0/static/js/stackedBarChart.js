function loadCanvas(){
 var chart = dc.barChart("#stackedBarChart");

      d3.csv("../mainData.csv", function(error, experiments) {
          experiments.forEach(function(x) {
              d.product = d.product;
              d.subProduct = d.subProduct;
              d.Issue  = d.Issue;
              d.Company = d.Company;
              console.log("I think theres some problem here");
              d.State = d.State;
              d.submittedVia  = d['Submitted via'];
          });

            var ndx                 = crossfilter(experiments),
              runDimension        = ndx.dimension(function(d) {return d.product;}),
              speedSumGroup       = runDimension.group().reduce(function(p, v) {
                  p[v.Expt] = (p[v.Expt] || 0) + v.Speed;
                  return p;
              }, function(p, v) {
                  p[v.Expt] = (p[v.Expt] || 0) - v.Speed;
                  return p;
              }, function() {
                  return {};
              });
          function sel_stack(i) {
              return function(d) {
                  return d.value[i];
              };
          }
          chart
              .width(768)
              .height(480)
              .x(d3.scale.linear().domain([1,21]))
              .margins({left: 80, top: 20, right: 10, bottom: 20})
              .brushOn(false)
              .clipPadding(10)
              .title(function(d) {
                  return d.key + '[' + this.layer + ']: ' + d.value[this.layer];
              })
              .dimension(runDimension)
              .group(speedSumGroup, "1", sel_stack('1'))
              .renderLabel(true);
          chart.legend(dc.legend());
          dc.override(chart, 'legendables', function() {
              var items = chart._legendables();
              return items.reverse();
          });
          for(var i = 2; i<6; ++i)
              chart.stack(speedSumGroup, ''+i, sel_stack(i));
          chart.render();
      });}
};
$('#submit-btn4').click(loadCanvas);
