
var rideChartData;
var rideVis;
var valuationCharts = [];
var numPoints;
var filterDate;
var maxDate;
var servicesDomain = ["Yellow Cab","Uber", "Lyft", "Via", "Juno"];
var servicesColorRange = ["#ffd651","#050605","#cd25c8","#53e2e1","#4f55b8"];

queue()
    .defer(d3.csv, "static/data/rides/number_of_rides_per_day_total_NYC.csv")
    .defer(d3.csv, "static/data/rides/company_medallion_valuation.csv")
    .await(function(error, rideData, valuationData){

    rideChartData = [];

    numPoints = rideData.length;

    valuationData.forEach(function(d) {
        d.time = d3.timeParse("%y-%b")(d.time);
    });

    rideData.forEach(function(d){

        servicesDomain.forEach(function(s) {
            var dataElement = {};
            dataElement.time = d3.timeParse("%m/%d/%y")(d.Time);
            // dataElement.time = d3.timeFormat("%Y-/%m")(d.Time);
           dataElement.service = s;
           dataElement.rides = +d[s];
           dataElement.img = 'static/img/ride-' + dataElement.service +'.png';
           if (isNaN(dataElement.rides)) {
               dataElement.rides = 0;
           }

          var valuationElement = valuationData.filter(function(v) {
              return v.time <= dataElement.time;
          });

          valuationElement = valuationElement[valuationElement.length - 1];
          dataElement.valuation = +valuationElement[s];
          if (isNaN(dataElement.valuation)) {
               dataElement.valuation = 0;
           }

           rideChartData.push(dataElement);
        });


    });

    rideData.sort(function(a, b) {
      return a.time - b.time;
    });

    rideVis = new RideVis("rides-per-day", rideChartData);

    maxDate = d3.max(rideChartData, function(d) {
            return d.time;
        });

    filterDate = maxDate;

    var valuationDomain = d3.extent(rideChartData, function (d) {
            return d.valuation;
        });

    valuationChartData =  d3.nest()
        .key(function(d) { return d.service; })
        .entries(rideChartData);

    var valuationContainer = d3.select('#valuation-container');
    valuationChartData.forEach(function(d) {
       var circleContainer = valuationContainer.append("div")
           .attr('id', 'valuation-container-' + d.key);

       var valuationChart = new ValuationVis('valuation-container-' + d.key, d.values, valuationDomain, d.key);
       valuationCharts.push(valuationChart);

    });

});

function filter_ride_service_provider() {
  rideVis.wrangleData();
};

//Create viz instance
function animateRideVis(){

  var totalTime = 500;
  var counter = 0;

  var blockRect = rideVis.svg.append('rect')
    .attr('class', 'blockRect')
    .attr('width', rideVis.width)
    .attr('height', rideVis.height)
    .attr('fill', 'white');

  var moveRideCar = setInterval(function() {

        blockRect.attr('x', counter)
        .attr('width', rideVis.width - counter);
        var filter = rideVis.xScale.invert(counter);
        updateValuationCharts(filter);
        counter += 1;
        if (counter > rideVis.width) {
            rideVis.svg.selectAll('.blockRect').remove();
            clearInterval(moveRideCar);
        }
    }, 1);
};

function updateValuationCharts(filter) {
  filterDate = filter;
    valuationCharts.forEach(function(d) {
        d.wrangleData();
    });
}

function lineToolTipShow() {

    var bisectDate = d3.bisector(function(d) { return d.time; }).left;

    var x0 = rideVis.xScale.invert(d3.mouse(this)[0]);
    
    rideVis.lineToolTip
      .attr('x1', rideVis.xScale(x0) - 5)
      .attr('x2', rideVis.xScale(x0) - 5)
      .attr('stroke', '#09091a');

    rideVis.lineToolTipText
      .attr('x', rideVis.xScale(x0))
      .text(d3.timeFormat('%B %Y')(x0));

    rideVis.displayData.forEach(function(d, i) {
        var i = bisectDate(d.values, x0, 1);
        var d0 = d.values[i - 1];
        var d1 = d.values[i];
        var dA = x0 - d0.time > d1.time - x0 ? d1 : d0;
        d3.select('#ride-tooltip-label-' + d.key.charAt(0))
          .attr('x', rideVis.xScale(x0))
          .text(d3.format(",.0f")(dA.rides));
    });

    updateValuationCharts(x0);
};

function lineToolTipHide() {

    rideVis.lineToolTip
      .attr('stroke', 'none');

    rideVis.lineToolTipText
      .text('');

    rideVis.displayData.forEach(function(d) {
        d3.select('#ride-tooltip-label-' + d.key.charAt(0))
          .text('');
    });

    updateValuationCharts(maxDate);
};