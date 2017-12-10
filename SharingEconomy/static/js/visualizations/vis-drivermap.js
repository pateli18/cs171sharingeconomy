DriverMap = function(_parentElement, _data, _mapData, _polylineData) {
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = _data;
	this.mapData = _mapData;
	this.polylines = _polylineData;
	this.polylinesDisplay = _polylineData;

	this.initVis();
}

DriverMap.prototype.initVis = function() {
	var vis = this;

	vis.margin = { top: 0, right: 0, bottom: 0, left: 50 };
    vis.width = 600 - vis.margin.left - vis.margin.right;
    vis.height = 250 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select('#' + vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append('g')
        .attr('transform', "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.mapProjection = d3.geoMercator()
            .translate([1000, 450])
            .scale([445]);

	vis.mapPath = d3.geoPath()
					.projection(vis.mapProjection);

    vis.svg.selectAll(".us-map")
        .data(vis.mapData)
        .enter()
        .append("path")
        .attr('class', 'us-map')
        .attr("d", vis.mapPath)
        .style('fill', 'none')
        .style('stroke', 'black');

    vis.wrangleData();
}

DriverMap.prototype.wrangleData = function() {
	var vis = this;

	var incomeValue = Math.max($('#income-slider').slider("option", "value"), 10) * 1000;
    var filteredData = vis.data.filter(function(d) {
        return d.PreTaxIncome === incomeValue;
    });

    vis.displayData = [{name:'Boston', point:[filteredData[0].StartLng, filteredData[0].StartLat]},{name:filteredData[0].Location, point:[filteredData[0].EndLng, filteredData[0].EndLat]}];
    vis.polylinesDisplay = vis.polylines.filter(function(d) {
    	return d.properties.id === filteredData[0].id;
    });

    vis.updateChart();
}

DriverMap.prototype.updateChart = function() {
	var vis = this;

	var cityPoint = vis.svg.selectAll('.city-point')
		.data(vis.displayData);

	cityPoint.enter()
		.append('circle')
		.attr('class', 'city-point')
		.merge(cityPoint)
		.transition()
		.duration(1000)
		.attr("transform", function(d) {
            return "translate(" + vis.mapProjection(d.point) + ")";
        })
		.attr('r', 5)
		.attr('fill',"#4a0073");

	cityPoint.exit().remove();

	var cityPointLabel = vis.svg.selectAll('.city-point-label')
		.data(vis.displayData);

	cityPointLabel.enter()
		.append('text')
		.attr('class', 'city-point-label')
		.merge(cityPointLabel)
		.transition()
		.duration(1000)
		.attr("transform", function(d) {
			var point = [0, d.point[1]];
			if (d.name === 'Boston') {
				point[0] = d.point[0] + 1;
			} else {
				point[0] = d.point[0] - 1;
			}
            return "translate(" + vis.mapProjection(point) + ")";
        })
        .attr('text-anchor', function(d) {
        	if (d.name === 'Boston') {
        		return 'start';
        	} else {
        		return 'end';
        	}
        })
        .text(function(d) {
        	return d.name;
        })
        .attr('fill', "#4a0073");

    cityPointLabel.exit().remove();

    var polyline = vis.svg.selectAll(".polyline")
                    .data(vis.polylinesDisplay);

    polyline.enter()
        .append("path")
        .attr('class', 'polyline')
        .merge(polyline)
        .transition()
        .duration(1000)
        .attr("d", vis.mapPath)
        .attr('stroke', "#4a0073")
        .attr('stroke-width', "5px")
        .attr('fill', 'none');

    polyline.exit().remove();
}








