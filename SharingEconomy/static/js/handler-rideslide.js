
var rideChartData;
var rideVis;
var driverCharts = [];
var numPoints;
var filterDate;
var maxDate;
var servicesDomain = ["Yellow Cab","Uber", "Lyft", "Via", "Juno"];
var servicesDescription = ["NYC Yellow Cabs are those taxis licensed to operate in the City",
"Uber is the largest ride-sharing company in the US",
"Lyft is Uber's primary competitior in the US",
"Via is a ride-sharing service focused on car pooling",
"Juno is a ride-sharing company headquarted in NYC"]
var servicesColorRange = ["#e69d49","#050605","#542788","#8073ac","#b2abd2"];

queue()
    .defer(d3.csv, "static/data/rides/number_of_rides_per_day_total_NYC.csv")
    .defer(d3.csv, "static/data/rides/number_of_vehicles.csv")
    .await(function(error, rideData, driverData){

    rideChartData = [];

    numPoints = rideData.length;

    driverData.forEach(function(d) {
        d.time = d3.timeParse("%b-%y")(d.time);
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

          var driverElement = driverData.filter(function(v) {
              return v.time <= dataElement.time;
          });

          driverElement = driverElement[driverElement.length - 1];
          dataElement.drivers = +driverElement[s];
          if (isNaN(dataElement.drivers)) {
               dataElement.drivers = 0;
           }

           if (dataElement.rides == 0) {
              dataElement.rides_per_driver = 0;
           } else {
              dataElement.rides_per_driver = dataElement.rides / dataElement.drivers;
           }
           
           rideChartData.push(dataElement);
        });


    });

    rideChartData.sort(function(a, b) {
      return a.time - b.time;
    });

    rideVis = new RideVis("rides-per-day", rideChartData);

    maxDate = d3.max(rideChartData, function(d) {
            return d.time;
        });

    filterDate = maxDate;

    driverChartData =  d3.nest()
        .key(function(d) { return d.service; })
        .entries(rideChartData);

    driverChartData.sort(function(a, b) {
      return b.values[b.values.length - 1].rides - a.values[a.values.length - 1].rides; 
    });

    var driverChartContainer = d3.select('#driver-chart-container');
    var driverChartDescription = d3.select('#driver-description-container');
    driverChartData.forEach(function(d, i) {
       var chartId = 'driver-container-' + i;
       driverChartContainer.append("div")
           .attr('id', chartId);

       $('#' + chartId).mouseenter(driverToolTipShow);
       $('#' + chartId).mouseleave(driverToolTipHide);

       var driverChart = new DriverVis(chartId, d.values, d.key);
       driverCharts.push(driverChart);

       driverChartDescription.append("div")
          .attr('id', 'driver-description-' + i)
          .attr('class', 'driver-description');

        $('#' + 'driver-description-' + i).html(servicesDescription[i]);
    });

});

function driverToolTipShow(element) {
  console.log('element');
  console.log(element);
   var chart_id = parseInt(element.currentTarget.id.replace('driver-container-',''));
   var chart = driverCharts[chart_id];
   chart.svg
    .append("rect")
    .attr('class', 'driver-tooltip')
    .style('fill', 'black')
    .style('opacity', 0.5)
    .attr('width', chart.width)
    .attr('height', chart.height)

  chart.svg
    .append('text')
    .attr('class', 'driver-tooltip-text')
    .attr('fill', 'white')
    .attr('x', chart.width / 2 - 10)
    .attr('y', chart.height / 2 + 2)
    .text(d3.format('.1f')(chart.driverCount));
}

function driverToolTipHide(element) {
  var chart_id = parseInt(element.currentTarget.id.replace('driver-container-',''));
   var chart = driverCharts[chart_id];
   chart.svg.select('.driver-tooltip-text').remove();
   chart.svg.select('.driver-tooltip').remove();
}



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
    .attr('fill', '#dddddd');

  var prevFilter;

  var moveRideCar = setInterval(function() {

        blockRect.attr('x', counter)
        .attr('width', rideVis.width - counter);
        var filter = rideVis.xScale.invert(counter);

        if (filter != prevFilter) {
          updateDriverCharts(filter);
        }

        prevFilter = filter;
        counter += 1;
        if (counter > rideVis.width) {
            rideVis.svg.selectAll('.blockRect').remove();
            clearInterval(moveRideCar);
        }
    }, 1);
};

function updateDriverCharts(filter) {
  filterDate = filter;
    driverCharts.forEach(function(d) {
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

    updateDriverCharts(x0);
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

    updateDriverCharts(maxDate);
};