
IncomeChart = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;

    this.initVis();
}

IncomeChart.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 40, right: 0, bottom: 50, left: 60};

    vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 500 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.yScale = d3.scaleLinear()
        .range([vis.height, 0])
        .domain([0, d3.max(vis.data, function(d) {
            return d.value100;
        })]);

    vis.xScale = d3.scaleBand()
        .rangeRound([0, vis.width])
        .padding(0.2);

    vis.nest = d3.nest()
                .key(function(d) { return d.bucket; });

    vis.stack = d3.stack();

    vis.xAxis = d3.axisBottom()
        .scale(vis.xScale);

    vis.svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + vis.height + ")")
        .append('text')
        .attr('class', 'x-label')
        .attr('transform', "translate(" + (vis.width / 2) + "," + 40 + ")")
        .attr('class', 'axis-label')
        .text('Revenue / (Expense)');;

    // Add y-axis
    vis.yAxis = d3.axisLeft()
        .scale(vis.yScale)
        .tickFormat(d3.format('$,.0f'));

    vis.svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(0,0)")
        .append('text')
        .attr('class', 'y-label')
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (12) +","+ (40) +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .attr('class', 'axis-label')
        .text("Annual Amount");

    vis.tooltip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-8, 0]);

    vis.wrangleData();
}

IncomeChart.prototype.wrangleData = function() {
    var vis = this;

    var incomeValue = $('#income-level').val();

    vis.displayData = vis.nest
                .rollup(function(d) { return d[0][incomeValue]; })
                .map(vis.data);

    vis.xScale.domain(vis.displayData.keys());

    vis.displayData = vis.stack
                        .keys(vis.displayData.keys())
                        .value(function(d, key) { return d.get(key); })
                        ([vis.displayData]);

    console.log('new');
    console.log(vis.displayData);

    vis.updateChart();
}

IncomeChart.prototype.updateChart = function() {
    var vis = this;

    vis.tooltip.html(function(d) {
            var contribution = d[0][1] - d[0][0];
            var net = d[0][1];
            if (d.key === 'Driver Pre-Tax Income') {
                net = -contribution;
                contribution = 0;
            }
            var contributionColor;
            if (contribution < 0) {
                contributionColor = "#a50026";
            } else if (contribution > 0) {
                contributionColor = "#006837";
            } else {
                contributionColor = "grey";
            }
            return '<div style="text-align: center; color:white; font-size:16px;"><strong>' + d.key + '</strong></div>' +
            '<span style="font-size:12px;">Contribution: <span style="color:' + contributionColor + ';">' + d3.format('($,.0f')(contribution) + '</span></span><br>' +
            '<span style="font-size:12px;">Net: <span style="color:#006837;">' + d3.format('$,.0f')(net) + '</span></span>';
        });

    vis.svg.call(vis.tooltip);

    var bar = vis.svg.selectAll('.income-bar')
            .data(vis.displayData);

    bar.enter()
        .append('rect')
        .attr("class", 'income-bar')
        .on('mouseover', vis.tooltip.show)
        .on('mouseout', vis.tooltip.hide)
        .merge(bar)
        .transition()
        .duration(1000)
        .attr("x", function(d) { return vis.xScale(d.key); })
        .attr("y", function(d) { return vis.yScale(Math.max(d[0][0], d[0][1])); })
        .attr("height", function(d) { return (d[0][0] > d[0][1]) ? (vis.yScale(d[0][1]) - vis.yScale(d[0][0])) : (vis.yScale(d[0][0]) - vis.yScale(d[0][1])); })
        .attr("width", vis.xScale.bandwidth())
        .attr('fill', function(d) {
            if (d.key === "Fare Revenue" || d.key === "Driver Pre-Tax Income") {
                return "#006837";
            } else {
                return "#a50026";
            }
        });

    bar.exit().remove();

    vis.svg.select(".x-axis").transition().call(vis.xAxis);
    vis.svg.select(".y-axis").transition().call(vis.yAxis);
}
