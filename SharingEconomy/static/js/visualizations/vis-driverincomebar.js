
IncomeChart = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;

    this.initVis();
}

IncomeChart.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top:0, right: 40, bottom: 20, left: 7};

    vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 50 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.xScale = d3.scaleLinear()
        .range([0, vis.width]);

    vis.stack = d3.stack()
                    .keys(stackAttributes);

    vis.xAxis = d3.axisBottom()
        .scale(vis.xScale)
        .tickFormat(d3.format('$,.0f'))
        .ticks(5);

    vis.colorScale = d3.scaleOrdinal()
            .range(["#dddddd","#887bb4","#67279b","#4a0073","#4a0073"])
            .domain(["TotalRevenue", "PreTaxIncome","OperationCosts","UberFeesAndCommission"]);

    vis.svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.tooltip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-8, 0]);

    vis.wrangleData();
}

IncomeChart.prototype.wrangleData = function() {
    var vis = this;

    var incomeValue = Math.max($('#income-slider').slider("option", "value"), 10) * 1000;
    var filteredData = vis.data.filter(function(d) {
        return d.PreTaxIncome === incomeValue;
    });

    vis.xScale.domain([0, filteredData[0].TotalRevenue*1.01]);

    // stack data here
    var totalStack = d3.stack()
                        .keys(['TotalRevenue'])(filteredData);
    totalStack[0].index = 4;

    vis.displayData = vis.stack(filteredData);
    vis.displayData.push(totalStack[0]);

    vis.displayData.sort(function(a, b) {
        return b.index - a.index;
    });

    vis.updateChart();
}

IncomeChart.prototype.updateChart = function() {
    var vis = this;

    var bar = vis.svg.selectAll('.income-bar')
            .data(vis.displayData);

    bar.enter()
        .append('rect')
        .attr("class", 'income-bar')
        .merge(bar)
        .transition()
        .duration(1000)
        .attr("x", function(d) {
            return vis.xScale(d[0][0]);
        })
        .attr("y", function(d) { return 0; })
        .attr("height", vis.height)
        .attr("width", function(d) { return vis.xScale(d[0][1] - d[0][0]); })
        .attr('fill', function(d) {
            return vis.colorScale(d.key);
        });

    bar.exit().remove();


    var barText = vis.svg.selectAll('.income-bar-text')
        .data(vis.displayData);

    barText.enter()
        .append('text')
        .attr('class', 'income-bar-text')
        .merge(barText)
        .attr('x', function(d) {
            if (d.key != 'TotalRevenue') {
                return vis.xScale(d[0][0]) + vis.xScale(d[0].data[d.key])/2 - 15;
            } else {
                return vis.xScale(d[0][1]) + 5;
            }
        })
        .attr('y', 20)
        .attr('fill', function(d) {
            if (d.key != 'TotalRevenue') {
                return 'white';
            } else {
                return 'black';
            }
        })
        .text(function(d) {
            return d3.format('$,.2s')(d[0][1] - d[0][0]);
        })
        .style('font-weight', 'bold');

    barText.exit().remove();

    vis.svg.select(".x-axis").transition().duration(1000).call(vis.xAxis);

}
