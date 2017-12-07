
StackedChart = function(_parentElement, _data, _categories) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;
    this.categories = _categories;

    this.initVis();
}

function padDate(date, numMonths) {
    date = new Date(date);
    return date.setMonth(date.getMonth() + numMonths);
}

StackedChart.prototype.initVis = function() {
    var vis = this;

    vis.margin = { top: 10, right: 10, bottom: 20, left: 50 };

    vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 100 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select('#' + vis.parentElement)
        .append('svg')
        .attr('width', vis.width + vis.margin.left + vis.margin.right)
        .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
        .attr('class', 'stacked-bar')
        .append('g')
        .attr('transform', "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    var dateExtent = d3.extent(vis.data, function(d) {
        return d.date;
    });

    vis.xScale = d3.scaleTime()
        .rangeRound([0, vis.width])
        .domain([padDate(dateExtent[0], -5), padDate(dateExtent[1], 5)]);

    vis.yScale = d3.scaleLinear()
        .rangeRound([vis.height, 0])
        .domain([0, d3.max(vis.data, function(d) {
            return d.total;
        })]);

    vis.colorScale = mapColorScale;

    vis.stack = d3.stack()
        .keys(vis.categories)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    vis.xAxis = d3.axisBottom()
        .scale(vis.xScale);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.brush = d3.brushX()
        .extent([[0, 0], [vis.width, vis.height]])
        .on("brush end", filter_timeline_data);

    vis.svg.append("g")
        .attr("class", "brush");

    vis.carIcon = vis.svg.append("image")
        .attr('id', 'car-icon')
        .attr("href", "static/img/car-icon.png")
        .attr("width", 40)
        .attr("height", 40)
        .attr("x", -40)
        .attr("y", vis.height - 20);

    vis.wrangleData();
}

StackedChart.prototype.wrangleData = function() {
    var vis = this;

    vis.displayData = vis.stack(vis.data);

    for (i = 0; i < vis.displayData.length; i++) {
        for (j = 0; j < vis.displayData[i].length; j++) {
            vis.displayData[i][j].key = vis.displayData[i].key;
        }
    }
    console.log(vis.displayData);

    var filterVal = $('#timeline-event-type').val();
    if (filterVal !== 'All') {
        vis.displayData = vis.displayData.filter(function(d) {
            return d.key === filterVal;
        });
    }

    vis.updateChart();
}

StackedChart.prototype.updateChart = function() {
    var vis = this;

    var barSections = vis.svg.selectAll('.bar-group')
        .data(vis.displayData);

    barSections.exit().remove();

    var bars = barSections
        .enter()
        .append('g')
        .attr('class', function(d) {
            return 'bar-group ' + d.key;
        })
        .merge(barSections)
        .selectAll('.timeline-bar')
            .data(function (d) {
                return d;
            });

    barSections.exit().remove();

    var enterBars = bars
        .enter()
        .append('rect')
        .attr('class', 'timeline-bar');

    bars.exit().remove();

    enterBars
        .merge(bars)
        .transition()
        .delay(200)
        .attr("width", 3)
        .attr('fill', function(d) {
            return vis.colorScale(d.key);
        })
        .attr("y", function(d) {
            return vis.yScale(d[1])
        })
        .attr("x", function(d) {
            return vis.xScale(d.data.date);
        })
        .attr("height", function(d) {
            return vis.yScale(d[0]) - vis.yScale(d[1]);
        });

    vis.svg.select(".x-axis").transition().duration(200).call(vis.xAxis);

    var lineMarker = vis.svg.selectAll('.ax-lines')
        .data([1, 2, 3]);

    lineMarker.enter()
        .append('line')
        .attr('class', 'ax-lines')
        .merge(lineMarker)
        .transition()
        .duration(1000)
        .attr('x1', 0)
        .attr('x2', vis.width)
        .attr('y1', function(d) { return vis.yScale(d);})
        .attr('y2', function(d) { return vis.yScale(d);})
        .attr('stroke', 'white');

    lineMarker.exit().remove();

}