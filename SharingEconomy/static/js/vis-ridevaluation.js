VehicleVis = function(_parentElement, _vehicleData, _radiusDomain, _service){
    this.parentElement = _parentElement;
    this.data = _vehicleData;
    this.displayData = _vehicleData;
    this.radiusDomain = _radiusDomain;
    this.service = _service;

    console.log(this.displayData);
    this.initVis();
};

VehicleVis.prototype.initVis = function() {
var vis=this;

    vis.margin = { top: 0, right: 0, bottom: 0, left: 0 };
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 100 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top +
            ")");

    vis.radiusScale = d3.scaleLinear()
        .range([0, 50])
        .domain(vis.radiusDomain);

    vis.colorPalette = d3.scaleOrdinal()
        .range(servicesColorRange)
        .domain(servicesDomain);

    vis.wrangleData()
};

VehicleVis.prototype.wrangleData = function() {
    // var vis=this;
    //
    // vis.displayData = vis.data.filter(function(d) {
    //     return d.time <= filterDate;
    // });
    //
    // vis.displayData = [vis.displayData[vis.displayData.length - 1]];
    //
    // vis.updateVis();

    var vis = this;

    var filterVal = $('#ride-service-provider').val();
    if (filterVal === 'All') {
        vis.displayData = vis.data;
    } else {
        vis.displayData = vis.data.filter(function(d) {
            return d.service === filterVal;
        });
    }

    vis.yScale.domain([0, d3.max(vis.displayData, function(d) {
        return d.rides;
    })]);

    vis.displayData = d3.nest()
        .key(function(d) { return d.service; })
        .entries(vis.displayData);

    vis.updateVis();
};


VehicleVis.prototype.updateVis = function() {
    var vis=this;

    var circle = vis.svg.selectAll(".val-circle")
        .data(vis.displayData, function(d) {
            return d.drivers;
        });

    circle.enter()
        .append("circle")
        .attr('class', 'val-circle')
        .attr("fill", vis.colorPalette(vis.service))
        .merge(circle)
        .attr("cx", vis.width/2 )
        .attr("cy", vis.height/2)
        .attr("r", function(d){
            return vis.radiusScale(d.drivers);
        });

    circle.exit().remove();

    var serviceLabel = vis.svg.selectAll('.service-text')
        .data(vis.displayData, function(d) {
            return d.service;
        });

    serviceLabel.enter()
        .append('text')
        .attr('class', 'service-text')
        .merge(serviceLabel)
        .attr("x", vis.width/2+120)
        .attr("y", vis.height/2)
        .attr("fill", function(d) {
            return vis.colorPalette(vis.service);
        })
        .attr('text-anchor', 'middle')
        .text(function(d){
            return d.service;
        })
        .style('font-size', '15px');


    var vehicleLabel = vis.svg.selectAll('.val-text')
        .data(vis.displayData, function(d) {
            return d.drivers;
        });

    vehicleLabel.enter()
        .append('text')
        .attr('class', 'val-text')
        .merge(vehicleLabel)
        .attr("x", '50%')
        .attr("y", function(d) {
                return vis.height/2 - vis.radiusScale(d.drivers) - 2;
        })
        .attr("fill", function(d) {
                return vis.colorPalette(vis.service);
        })
        .attr('text-anchor', 'middle')
        .text(function(d){
            return d3.format('.0s')(d.drivers);
        })
        .style('font-size', '15px');

    vehicleLabel.exit().remove();


};