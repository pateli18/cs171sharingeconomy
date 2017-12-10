var mapSVG;

var mapProjection;

var mapToolTip = d3.tip()
    .attr('class', 'd3-tip timeline')
    .offset([-8, 0]);

var eventCategories = ['Company', 'Expansion', 'Funding', 'Competition', 'Regulatory', 'Product'];

var mapColorScale = d3.scaleOrdinal()
    .domain(eventCategories)
    .range(["#e17638","#e69d49","#e1bc71","#887bb4","#67279b","#4a0073"]);

var timelineDataBase;
var timelineData;
var timelineChart;
var carDims = [40, 40];
var pathPosition = -carDims[0];
var prevDataLength = 0;
var moveCar;
var carIcon;

queue()
    .defer(d3.json, 'static/data/timeline/world-110m.json')
    .defer(d3.csv, 'static/data/timeline/uber_timeline_clean.csv')
    .await(function(error, worldMapRaw, timelineDataRaw) {

        var worldMap = topojson.feature(worldMapRaw, worldMapRaw.objects.countries).features;
        var worldMapContainer = '#timeline-map';

        var mapMargin = { top: 0, right: 0, bottom: 0, left: 50 };
        var mapWidth = $(worldMapContainer).width() - mapMargin.left - mapMargin.right;
        var mapHeight = 400 - mapMargin.top - mapMargin.bottom;

        mapSVG = d3.select(worldMapContainer)
            .append("svg")
            .attr("width", mapWidth + mapMargin.left + mapMargin.right)
            .attr("height", mapHeight + mapMargin.top + mapMargin.bottom)
            .append('g')
            .attr('transform', "translate(" + mapMargin.left + "," + mapMargin.top + ")");

        mapProjection = d3.geoMercator()
            .translate([mapWidth / 2, mapHeight / 1.75])
            .scale([150]);

        var path = d3.geoPath()
            .projection(mapProjection);

        mapSVG.selectAll("path")
            .data(worldMap)
            .enter().append("path")
            .attr("d", path)
            .style('fill', '#736e6f')
            .style('stroke', '#ebebeb');

        var uber_logo_path = [-160, 5];
        var worldwide_label_event = [-149, 7];

        mapSVG.append("image")
            .attr("xlink:href", "static/img/uber-logo.jpg")
            .attr("width", 150)
            .attr("height", 150)
            .attr("transform", "translate(" + mapProjection(uber_logo_path) + ")");

        mapSVG.append("text")
            .attr("transform", "translate(" + mapProjection(worldwide_label_event) + ")")
            .style("font-weight", "bold")
            .text('Global Events');

        var mapLegend = d3.legendColor()
            .shape('circle')
            .shapePadding(50)
            .orient('horizontal')
            .scale(mapColorScale);

        var legendMargin = { top: 0, right: 0, bottom: 0, left: 0 };
        var legendWidth = $('#event-legend').width() - mapMargin.left - mapMargin.right;
        var legendHeight = 50 - mapMargin.top - mapMargin.bottom;

        var legendSVG = d3.select('#event-legend')
            .append("svg")
            .attr("width", legendWidth + legendMargin.left + legendMargin.right)
            .attr("height", legendHeight + legendMargin.top + legendMargin.bottom)
            .append('g')
            .attr('transform', "translate(" + legendMargin.left + "," + legendMargin.top + ")");

        legendSVG.append("g")
            .attr("class", "legendOrdinal")
            .attr("transform", "translate(" + (30) + ", " + (10) + ")");

        legendSVG.select(".legendOrdinal").call(mapLegend);

        timelineDataRaw.forEach(function(d, i) {
            d.index = i;
            d.fullDate = d3.timeParse("%B %Y")(d.Date);
            d.Lat = +d.Lat;
            d.Lng = +d.Lng;
        });


        timelineDataRaw.sort(function(a, b) {
            return a.fullDate - b.fullDate;
        });

        timelineDataBase = timelineDataRaw;
        timelineData = timelineDataBase;

        var timelineByEvent = d3.nest()
            .key(function(d) { return d.Date; })
            .key(function(d) { return d['Event type']; })
            .rollup(function(v) { return v.length; })
            .object(timelineData);

        var timelineByEventData = [];

        for (var date in timelineByEvent) {
            timelineByEvent[date].total = 0;
            eventCategories.forEach(function(e) {
                if (!timelineByEvent[date].hasOwnProperty(e)) {
                    timelineByEvent[date][e] = 0;
                } else {
                    timelineByEvent[date].total += timelineByEvent[date][e];
                }
            });
            timelineByEvent[date].date = d3.timeParse("%B %Y")(date);
            timelineByEventData.push(timelineByEvent[date]);
        }
        timelineChart = new StackedChart('timeline', timelineByEventData, eventCategories);
        timelineChart.svg.call(timelineChart.brush).call(timelineChart.brush.move, timelineChart.xScale.range());

        carIcon = timelineChart.svg.append("image")
                    .attr('id', 'car-icon')
                    .attr("href", "static/img/car-icon.png")
                    .attr("width", 40)
                    .attr("height", 40)
                    .attr("x", -40)
                    .attr("y", timelineChart.height - 20);

        add_events(timelineData);
        add_event_boxes(timelineData);

    });

function timeline_button_click() {
    var buttonValue = $('#timeline-button-label').text();
    if (buttonValue === ' Play') {
        timelineChart.svg.call(timelineChart.brush.move, null);
        $('#timeline-button').attr('class', 'fa fa-pause-circle');
        $('#timeline-button-label').html(' Pause');

        run_event_timer();
    } else {
        clearInterval(moveCar);
        $('#timeline-button').attr('class', 'fa fa-play-circle');
        $('#timeline-button-label').html(' Play');
    }
}

function timeline_reset_button_click() {
    clearInterval(moveCar);
    $('#timeline-button').attr('class', 'fa fa-play-circle');
    $('#timeline-button-label').html(' Play');
    pathPosition = -carDims[0];
    prevDataLength = 0;
    carIcon.attr("x", pathPosition);
    add_events(timelineData);
    add_event_boxes(timelineData);

}

function run_event_timer() {

    var totalPathLength = timelineChart.width;
    var totalPathTime = 3 * 1000;
    var pathIncrement = totalPathLength / totalPathTime;
    if (prevDataLength === 0) {
        add_events([]);
        add_event_boxes([]);
    }

    moveCar =  setInterval(function() {
        pathPosition += pathIncrement;
        carIcon.attr("x", pathPosition);
        var currentDate = timelineChart.xScale.invert(pathPosition + carDims[0]);
        var chartData = timelineData.filter(function (d) {
            return d.fullDate <= currentDate;
        });
        if (chartData.length > prevDataLength) {
            add_events(chartData);
            add_event_boxes(chartData.slice(-10));
        }
        prevDataLength = chartData.length;
        if (pathPosition > (totalPathLength + 5)) {
            timeline_reset_button_click();
        }
    }, 1);
}


function add_events(eventData) {

    mapToolTip.html(function(d) {
        return '<div style="text-align:center; margin-bottom:5px; font-weight:bold; padding:2px; color:white; background-color:' + 
                mapColorScale(d['Event type']) + '">' +
                d3.timeFormat('%B %Y')(d.fullDate) + '</div>' + 
                '<div>' + d.Headline + '</div>';
    });

    mapSVG.call(mapToolTip);

    var eventCircle = mapSVG.selectAll('.event-circle')
        .data(eventData, function(d) {
            return d.index;
        });

    eventCircle.exit().remove();

    eventCircle.enter()
        .append("circle")
        .attr('class', 'event-circle')
        .on('mouseover', event_mouse_over)
        .on('mouseout', event_mouse_out)
        .style('opacity', 0)
        .attr('r', 50)
        .merge(eventCircle)
        .style('fill', function(d) {
            return mapColorScale(d['Event type']);
        })
        .attr("transform", function(d) {
            return "translate(" + mapProjection([d.Lng, d.Lat]) + ")";
        })
        .transition()
        .duration(500)
        .style('opacity', 1)
        .attr('r', 5);

}

function add_event_boxes(eventBoxes) {

    var eventBox = d3.select('#timeline-event-box').selectAll('.event-box')
        .data(eventBoxes, function(d) {
            return d.index;
        });

    eventBox.enter()
        .append("p")
        .attr("class", "event-box")
        .html(function(d) {
            return '<strong style="color: ' + mapColorScale(d['Event type']) + ';">' + d3.timeFormat('%B %Y')(d.fullDate) + '</strong>: ' + d.Headline + '<br>';
        })
        .merge(eventBox)
        .attr('color', 'black');

    eventBox.exit().remove();
}

function event_mouse_over(event) {
    mapToolTip.show(event);
    d3.selectAll('.event-circle')
        .style('fill', function(d) {
            if (d.index === event.index) {
                return mapColorScale(d['Event type']);
            } else {
                return 'lightgrey';
            }
        });
    d3.selectAll('.timeline-bar')
        .attr('fill', function(d) {
            if ((d.data.date.getTime() === event.fullDate.getTime()) && (d.key === event['Event type'])) {
                return mapColorScale(d.key);
            } else {
                return 'lightgrey';
            }
        });
    d3.selectAll('.event-box')
        .remove();

    d3.select('#timeline-event-box').html(event.Details);
    filter_legend(event['Event type']);
}

function event_mouse_out(event) {
    mapToolTip.hide(event);
    d3.selectAll('.event-circle')
        .style('fill', function(d) {
            return mapColorScale(d['Event type']);
        });
    d3.selectAll('.timeline-bar')
        .attr('fill', function(d) {
            return mapColorScale(d.key);
        });
    d3.select('#timeline-event-box').html("");
    add_event_boxes(timelineData);
    unfilter_legend();
}

function filter_timeline_data() {
    if (d3.event != null) {
        var selection = d3.event.selection;
        if (selection === null) {
            timelineData = timelineDataBase;
        } else {
            var timeFilters = selection.map(timelineChart.xScale.invert, timelineChart.xScale);
            timelineData = timelineDataBase.filter(function (d) {
                return (d.fullDate.getTime() >= timeFilters[0].getTime()) && (d.fullDate.getTime() <= timeFilters[1].getTime())
            });
            timelineData.sort(function (a, b) {
                return a.fullDate - b.fullDate;
            });
        }
    } else {
        timelineData = timelineDataBase;
    }

    var filterVal = $('#timeline-event-type').val();
    unfilter_legend();
    if (filterVal != 'All') {
        timelineData = timelineData.filter(function(d) {
            return d['Event type'] === filterVal;
        });
        filter_legend(filterVal);
    }

    add_events(timelineData);
    add_event_boxes(timelineData);
    timelineChart.wrangleData();
}

function filter_legend(eventType) {
    var legendCells = d3.select('#event-legend')
                        .select('.legendCells')
                        .selectAll('.cell');

    legendCells.select('.label')
        .style('fill', function(d) {
            if (d != eventType) {
                return 'lightgrey';
            } else {
                return 'black';
            }
        });

    legendCells.select('.swatch')
        .style('fill', function(d) {
            if (d != eventType) {
                return 'lightgrey';
            } else {
                return mapColorScale(d);
            }
        });
}

function unfilter_legend() {
    var legendCells = d3.select('#event-legend')
                        .select('.legendCells')
                        .selectAll('.cell');

    legendCells.select('.label')
        .style('fill', function(d) {
            return 'black';
        });

    legendCells.select('.swatch')
        .style('fill', function(d) {
            return mapColorScale(d);
        });
}