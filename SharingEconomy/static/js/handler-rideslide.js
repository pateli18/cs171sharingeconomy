
var rideChartData;
var rideVis;
var cars = [];
var numPoints;

d3.csv("static/data/rides/number_of_rides_per_day_total_NYC.csv", function(rideData){

    services = ['Yellow Cab', 'Uber', 'Lyft', 'Via', 'Juno'];

    rideChartData = [];

    numPoints = rideData.length;
    console.log(numPoints); 

    rideData.forEach(function(d){

        services.forEach(function(s) {
            var dataElement = {};
            dataElement.time = d3.timeParse("%m/%d/%y")(d.Time);
            // dataElement.time = d3.timeFormat("%Y-/%m")(d.Time);
           dataElement.service = s;
           dataElement.rides = +d[s];
           dataElement.img = 'static/img/ride-' + dataElement.service +'.png';
           if (isNaN(dataElement.rides)) {
               dataElement.rides = 0;
           }
           rideChartData.push(dataElement);
        });


    });

    rideData.sort(function(a, b) {
      return a.time - b.time;
    });

    rideVis = new RideVis("rides-per-day", rideChartData);

});

function filter_ride_service_provider() {
  rideVis.wrangleData();
}

/*
    rideVis.displayData.forEach(function(d) {
        var car = {};
        car.svg = rideVis.svg.append("image")
                    .attr('id', 'car-icon-' + d.key)
                    .attr('class', 'ride-car-icon')
                    .attr("href", d.values[0].img)
                    .attr("width", 40)
                    .attr("height", 40)
                    .attr("x", -40)
                    .attr("y", rideVis.yScale(d.values[0].rides));
        car.data = d.values;
        cars.push(car);
    });
*/


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
        /*
        cars.forEach(function(d) {
          d.svg
          .attr('x', rideVis.xScale(d.data[counter].time) - 40)
          .attr('y', rideVis.yScale(d.data[counter].rides) + 40);
        });
        */
        blockRect.attr('x', counter)
        .attr('width', rideVis.width - counter);
        counter += 1;
        if (counter > rideVis.width) {
            rideVis.svg.selectAll('.blockRect').remove();
            clearInterval(moveRideCar);
        }
    }, 1);
}