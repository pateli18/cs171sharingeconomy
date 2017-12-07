
ScatterPlot = function(_parentElement, _data, _poiData, _fullHeight) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;
    this.poiData = _poiData;
    this.poiDisplayData= _poiData;
    this.fullHeight = _fullHeight;

    this.initVis();
}

ScatterPlot.prototype.initVis = function() {
    var vis = this;

    vis.margin = { top: 80, right: 20, bottom: 20, left: 80 };

    vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = vis.fullHeight - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select('#' + vis.parentElement)
        .append('svg')
        .attr('width', vis.width + vis.margin.left + vis.margin.right)
        .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
        .attr('class', 'scatter-plot')
        .append('g')
        .attr('transform', "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.xScale = d3.scaleLinear()
        .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.colorScale = d3.scaleThreshold()
        .range(["#CD6737","#e18946","#e69d49","#d9b46d","#e6c276","#A292D7","#887bb4","#67279b","#4a0073","#320055"])
        .domain([-20, -15, -10, -5, 0, 5, 10, 15, 20]);

    vis.xAxis = d3.axisBottom()
        .scale(vis.xScale);

    vis.yAxis = d3.axisLeft()
        .scale(vis.yScale);

    vis.svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + vis.height + ")")
        .append('text')
        .attr('transform', "translate(" + (vis.width / 2+250) + ",-10)")
        .attr('class', 'axis-label')
        .text('Driving Miles from Harvard Square');

    vis.svg.append("g")
        .attr("class", "y-axis")
        .append('text')
        .attr('class', 'axis-label')
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (15) +","+ (vis.height / 4 + 30) +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .attr('class', 'axis-label')
        .text("Driving Minutes from Harvard Square");

    vis.toolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-8, 0]);

    vis.svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(" + (vis.width / 4) + "," + (0 - 50) + ")");

    vis.legendLinear = d3.legendColor()
        .shapeWidth(30)
        .cells(10)
        .labelFormat(d3.format("$.0f"))
        .orient('horizontal')
        .scale(vis.colorScale);

    vis.svg.select(".legendLinear")
        .call(vis.legendLinear);

    vis.svg.append("text")
        .attr('class', 'relative-value-legend-label')
        .attr("transform", "translate(" + (vis.width / 2.6) + "," + (0 - 60) + ")")
        .text('Uber vs. Taxi Price Differential')
        .attr('font-weight', 'bold');

    vis.svg.append("text")
        .attr('class', 'relative-value-legend-label')
        .attr("transform", "translate(" + (vis.width / 1.40) + "," + (0 - 40) + ")")
        .attr('font-style', 'italic')
        .text('Uber Cheaper');

    vis.svg.append("text")
        .attr('class', 'relative-value-legend-label')
        .attr("transform", "translate(" + (vis.width / 8) + "," + (0 - 40) + ")")
        .attr('font-style', 'italic')
        .text('Taxi Cheaper');

    vis.toolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-8, 0]);

    vis.svg.append("image")
        .attr("xlink:href", "static/img/harvard-logo.png")
        .attr("width", 30)
        .attr("height", 30)
        .attr("transform", "translate(" + -18 + "," + (vis.height - 12) + ")");

    vis.wrangleData();

}

ScatterPlot.prototype.wrangleData = function() {
    var vis = this;

    vis.displayData = vis.data.filter(function(d) {
        return d.radius <= selectedRadius;
    });

    vis.uberType = $('#relative-value-uber-type').find(':selected').val();
    vis.surge = Math.max($('#surge-slider').slider("option", "value"), 1);

    vis.displayData.forEach(function(d) {
        d.distance = d[vis.uberType + '_distance'];
        d.duration = d[vis.uberType + '_duration'];
        d.price_differential = d.taxi_price - d[vis.uberType + '_price'] * vis.surge;
    });

    vis.poiDisplayData = vis.poiData.filter(function(d) {
        return d.radius <= selectedRadius;
    });

    vis.poiDisplayData.forEach(function(d) {
        var relevantPoint = vis.data[d.index];
        d.distance = relevantPoint.distance;
        d.duration = relevantPoint.duration;
        d.price_differential = relevantPoint.price_differential;
    });

    vis.displayData.sort(function(a, b) {
        return a.poi - b.poi;
    });

    vis.updatePlot();
}

ScatterPlot.prototype.updatePlot = function() {
    var vis = this;

    vis.xScale.domain([0, d3.max(vis.displayData, function(d) {
        return d.distance;
    })]);

    vis.yScale.domain([0, d3.max(vis.displayData, function(d) {
        return d.duration;
    })]);

    vis.toolTip.html(function(d) {
        console.log('working');
        return '<table>'
            + '<tr>'
            + '<td>Price Differential</td><td style="color: ' + vis.colorScale(d.price_differential)  + ';">' + d3.format("($.2f")(d.price_differential)
            + '</td>'
            + '</tr>'
            + '<tr>'
            + '<td>Duration</td><td>' + d.duration + ' min</td>'
            + '</tr>'
            + '<tr>'
            + '<td>Distance</td><td>' + d.distance + ' mi</td>'
            + '</tr>'
            + '</table>';
    });

    vis.svg.call(vis.toolTip);

    var points = vis.svg.selectAll('.scatter-point')
        .data(vis.displayData);

    points.enter()
        .append('circle')
        .attr('class', 'scatter-point')
        .attr('id', function(d) {
            return 'relative-value-plot-point-' + d.index;
        })
        .on('mouseover', function(d) {
            vis.toolTip.show(d);
            $('#relative-value-map-point-' + d.index).css('fill', vis.colorScale(d.price_differential));
        })
        .on('mouseout', function(d) {
            vis.toolTip.hide(d);
            $('#relative-value-map-point-' + d.index).css('fill', 'none');
        })
        .merge(points)
        .transition()
        .duration(1000)
        .attr('cx', function(d) {
            return vis.xScale(d.distance);
        })
        .attr('cy', function(d) {
            return vis.yScale(d.duration);
        })
        .attr('fill', function(d) {
            return vis.colorScale(d.price_differential);
        })
        .attr('r', 5)
        .attr('stroke', function(d) {
            if (d.poi) {
                return 'black';
            } else {
                return 'none';
            }
        })
        .style('opacity', function(d) {
            if (d.poi) {
                return 1;
            } else {
                return .4;
            }
        });

    points.exit().remove();

    var poiLabel = vis.svg.selectAll('.poi-label')
        .data(vis.poiDisplayData);

    poiLabel.enter()
        .append('text')
        .attr('class', 'poi-label')
        .merge(poiLabel)
        .transition()
        .duration(1000)
        .attr('x', function(d) {
            return vis.xScale(d.distance) + 5;
        })
        .attr('y', function(d) {
            return vis.yScale(d.duration) + 15;
        })
        .text(function(d) {
            return d.name;
        });

    poiLabel.exit().remove();


    vis.svg.select(".x-axis").transition().duration(200).call(vis.xAxis);
    vis.svg.select(".y-axis").transition().duration(200).call(vis.yAxis);

}

