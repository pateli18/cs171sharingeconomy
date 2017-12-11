HoursBar = function(_parentElement, _data) {
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = _data;

	this.initVis();
}

HoursBar.prototype.initVis = function() {
	var vis = this;

	vis.margin = {top:20, right: 40, bottom: 20, left: 40};

    vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 250 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.yScale = d3.scaleLinear()
    			.range([vis.height, 0])
                .domain([0, d3.max(vis.data, function(d) {
                    return d.WeeklyHours;
                })]);

    vis.svg.append('text')
    	.attr('y', vis.height + 15)
    	.attr('x', vis.width / 2)
    	.attr('text-anchor', 'middle')
    	.text('Hours /	 Week');

    vis.wrangleData();
}

HoursBar.prototype.wrangleData = function() {
	var vis = this;

	var incomeValue = Math.max($('#income-slider').slider("option", "value"), 10) * 1000;
    vis.displayData = vis.data.filter(function(d) {
        return d.PreTaxIncome === incomeValue;
    });

    //vis.yScale.domain([0, Math.max(vis.displayData[0].WeeklyHours, 40)]);

    vis.updateChart();
}

HoursBar.prototype.updateChart = function() {
	var vis = this;

	var bar = vis.svg.selectAll('.hour-bar')
            .data(vis.displayData);

    bar.enter()
        .append('rect')
        .attr("class", 'hour-bar')
        .merge(bar)
        .transition()
        .duration(1000)
        .attr("x", 0)
        .attr("y", function(d) { return vis.yScale(d.WeeklyHours); })
        .attr("height", function(d) { return vis.height - vis.yScale(d.WeeklyHours); })
        .attr("width", vis.width)
        .attr('fill', "#887bb4");

    bar.exit().remove();

    var thresholdData = [{name:'40hrs', data:40},{name:'0hrs', data:0}];

    var barLines = vis.svg.selectAll('.hour-line')
    				.data(thresholdData);

    barLines.enter()
    	.append('line')
    	.attr('class', 'hour-line')
    	.merge(barLines)
    	.transition()
    	.duration(1000)
    	.attr('x1', -10)
    	.attr('x2', vis.width + 40)
    	.attr('y1', function(d) {
    		return vis.yScale(d.data);
    	})
    	.attr('y2', function(d) {
    		return vis.yScale(d.data);
    	})
    	.attr('stroke', 'black');

    barLines.exit().remove();

    var barTextLabel = vis.svg.selectAll('.threshold-label')
    					.data([thresholdData[0]]);

    barTextLabel.enter()
    		.append('text')
    		.attr('class', 'threshold-label')
    		.merge(barTextLabel)
    		.transition()
    		.duration(1000)
    		.attr('x', vis.width + 2)
    		.attr('y', function(d) {
    			return vis.yScale(d.data);
    		})
    		.text(function(d) {
    			return d.name;
    		});

    barTextLabel.exit().remove();
}