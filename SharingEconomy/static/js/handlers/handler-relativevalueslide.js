var relativeValueMap;
var relativeValuePlot;
var selectedRadius = 6;
var selectedZoom = 11;
var pricing = {initialFee:{uberX:2, uberPool:2, taxi:2.60},
    perMinute:{uberX:.20, uberPool:.15, taxi:.47},
    perMile:{uberX:1.29, uberPool:1.22, taxi:2.80},
    serviceFee:{uberX:1.60, uberPool:1.60, taxi:0},
    miniumumFare:{uberX:6.60, uberPool:6.60, taxi:2.60}};

var uberDescriptions = {
    uber_pool:"In Uber Pool you share your ride and split the fare with up to 3 other passengers. While" +
    " it's cheaper than UberX, the amount of time to your destination varies widely depending on the other" +
    " passengers' destination.",
    uber_x:"In Uber X you do not share your ride with any other passengers and so the ride is more expensive than Uber Pool." +
    " However, time dependability is higher than Uber Pool since you don't have to wait for any other passengers" +
    " to be picked up or dropped off."
};

function calcFare(duration, distance, service) {
    var fare =  pricing.initialFee[service] + pricing.perMinute[service] * duration + pricing.perMile[service] * distance + pricing.serviceFee[service];
    return Math.max(pricing.miniumumFare[service], fare);
}

queue()
    .defer(d3.csv, "static/data/relative_value/relative_value_individual_points.csv")
    .defer(d3.json, "static/data/relative_value/points_of_interest.json")
    .await(function(error, mapData, poiData){

        var uberPoolDurationFactor = 1;

        mapData.forEach(function(d) {
            d.index = +d.routes_id;
            d.radius = +d.radius;
            d.poi = false;
            d.lat = +d.lat;
            d.lng = +d.lng;
            d.uber_pool_distance = +d.uber_pool_distance;
            d.uber_pool_duration = +d.uber_pool_duration * uberPoolDurationFactor / 60;
            d.uber_pool_price = calcFare(d.uber_pool_duration, d.uber_pool_distance, "uberPool");

            d.uber_x_distance = +d.uber_x_distance;
            d.uber_x_duration = +d.uber_x_duration / 60;
            d.uber_x_price = calcFare(d.uber_x_duration, d.uber_x_distance, "uberX");

            d.taxi_distance = d.uber_x_distance;
            d.taxi_duration = d.uber_x_duration;
            d.taxi_price = calcFare(d.taxi_duration, d.taxi_distance, "taxi");
        });

        poiData = poiData.data;
        poiData.forEach(function(d) {
            d.index = +d.index;
            var relevantPoint = mapData[d.index];
            relevantPoint.poi = true;
            d.radius = relevantPoint.radius;
            d.lat = relevantPoint.lat;
            d.lng = relevantPoint.lng;
        });

        var mapParams = {lat:42.3735695, lng: -71.1211549, zoom:selectedZoom, type: 'mapbox.dark'};

        var mapFullHeight = 340;
        relativeValueMap = new ValueMap('relative-value-map', mapData, mapParams, poiData, mapFullHeight);

        var plotFullHeight = 420;
        relativeValuePlot = new ScatterPlot('relative-value-plot', mapData, poiData, plotFullHeight);

        generateRelativeValueMapToggle();
        changeRelativeValueMapRadius({map_radius:6, zoom: 11});

        $('#service-description').html(uberDescriptions.uber_pool);
    });

function updateRelativeValue() {
    relativeValuePlot.wrangleData(selectedRadius);
    relativeValueMap.wrangleData();
    
    var uberType = $('#relative-value-uber-type').find(':selected').val();
    $('#service-description').html(uberDescriptions[uberType]);
}

function updateSurgeLabel() {
    var surge = Math.max($('#surge-slider').slider("option", "value"), 1);
    if (surge == 1) {
        surge = 'None'
    } else {
        surge = d3.format('.1f')(surge) + 'x';
    }
    $('#surge-amount').html("Surge Pricing: " + surge );
}

function changeRelativeValueMapRadius(d) {
    selectedRadius = d.map_radius;
    selectedZoom = d.zoom;
    d3.selectAll('.legend-circle')
        .attr('fill', function(d){
            if (d.map_radius <= selectedRadius) {
                return '#09091a';
            } else {
                return '#dddddd';
            }
        })
        .attr('stroke', '#09091a');

    d3.selectAll('.legend-circle-text')
        .text(function(d) {
            if (d.map_radius === selectedRadius) {
                return d.map_radius + ' mi';
            } else {
                return '';
            }
        });

    relativeValuePlot.wrangleData(selectedRadius);
    relativeValueMap.wrangleData();

}

function generateRelativeValueMapToggle() {
    var circlesLegendData = [{map_radius:8, zoom: 10}, {map_radius:6, zoom: 11},
        {map_radius:4, zoom: 12}, {map_radius:2, zoom: 12}];

    var margin = { top: 0, right: 0, bottom: 0, left: 0 };

    var width = 180 - margin.left - margin.right,
        height = 180 - margin.top - margin.bottom;

    var svg = d3.select('#relative-value-map-legend')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'scatter-plot')
        .append('g')
        .attr('transform', "translate(" + margin.left + "," + margin.top + ")");

    var legendCircles = svg.selectAll('.legend-circle')
        .data(circlesLegendData);

    legendCircles.enter()
        .append('circle')
        .attr('class', 'legend-circle')
        .on('click', changeRelativeValueMapRadius)
        .merge(legendCircles)
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', function(d) {
            return d.map_radius * 10;
        })
        .attr('fill', function(d) {
            if (d.map_radius <= selectedRadius) {
                return '#09091a'
            } else {
                return '#dddddd';
            }
        });

    legendCircles.exit().remove();

    var legendCirclesText = svg.selectAll('.legend-circle-label')
        .data(circlesLegendData);

    legendCirclesText.enter()
        .append('text')
        .attr('class', 'legend-circle-text')
        .merge(legendCirclesText)
        .attr('x', width / 2 - 10)
        .attr('y', height / 2 + 5)
        .attr('fill', 'white')
        .style('font-size', '11px')
        .text(function(d) {
            if (d.map_radius === selectedRadius) {
                return d.map_radius + ' mi';
            } else {
                return '';
            }
        });

    legendCirclesText.exit().remove();

}