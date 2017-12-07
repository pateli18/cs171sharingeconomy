
BarChart = function(_parentElement, _data, _voteGroup) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;
    this.voteGroup = _voteGroup;

    this.initVis();
};

BarChart.prototype.initVis = function() {
  var vis = this;

    vis.margin = { top: 10, right: 0, bottom: 20, left: 40 };

    vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 300 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select('#' + vis.parentElement)
        .append('svg')
        .attr('width', vis.width + vis.margin.left + vis.margin.right)
        .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
        .attr('class', 'regular-bar')
        .append('g')
        .attr('transform', "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.xScale = d3.scaleBand()
        .rangeRound([0, vis.width])
        .padding(0.15)
        .domain(["Win", "Lose"]);

    vis.yScale = d3.scaleLinear()
        .rangeRound([vis.height, 0])
        .domain([0, 1]);

    vis.xAxis = d3.axisBottom()
        .scale(vis.xScale);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.wrangleData();
};

BarChart.prototype.wrangleData = function() {
    var vis = this;


    var total = Math.max(vis.data.Win + vis.data.Lose, 1);

    vis.displayData = [];
    for (var key in vis.data) {
        vis.displayData.push({name:key, value:vis.data[key] / total});
    }

    vis.updateData();
};

BarChart.prototype.updateData = function() {
    var vis = this;

    var bars = vis.svg.selectAll('.vote-bar-' + vis.voteGroup)
        .data(vis.displayData);

    bars.enter()
        .append('rect')
        .attr('class', 'vote-bar-' + vis.voteGroup)
        .merge(bars)
        .transition()
        .duration(1000)
        .attr('fill', function(d) {
            if (d.name === 'Win') {
                return "#8073ac";
            } else {
                return "#feb24c";
            }
        })
        .attr('x', function(d) {
            return vis.xScale(d.name);
        })
        .attr('y', function(d) {
            return vis.yScale(d.value);
        })
        .attr('height', function(d) {
            return vis.height - vis.yScale(d.value);
        })
        .attr('width', vis.xScale.bandwidth());

    bars.exit().remove();

    var barText = vis.svg.selectAll('.vote-bar-text-' + vis.voteGroup)
        .data(vis.displayData);

    barText.enter()
        .append('text')
        .attr('class', 'vote-bar-text-' + vis.voteGroup)
        .attr('fill', '#09091a')
        .style('font-weight', 'bold')
        .merge(barText)
        .transition()
        .duration(1000)
        .attr('x', function(d) {
            return vis.xScale(d.name) + 32;
        })
        .attr('y', function(d) {
            return vis.yScale(d.value) - 5;
        })
        .text(function(d) {
            return d3.format('.0%')(d.value);
        });

    vis.svg.select(".x-axis").call(vis.xAxis);
};