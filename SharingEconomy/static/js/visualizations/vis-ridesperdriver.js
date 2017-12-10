DriverVis = function(_parentElement, _driverData, _service){
    this.parentElement = _parentElement;
    this.data = _driverData;
    this.displayData = _driverData;
    this.service = _service;

    this.initVis();
};

DriverVis.prototype.initVis = function() {
var vis=this;

    vis.margin = { top: 30, right: 0, bottom: 0, left: 0 };
    vis.width = 100 - vis.margin.left - vis.margin.right;
    vis.height = 100 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top +
            ")");

    var boxDomain = [];
    for (var i = 0; i <= 5; i++) {
        boxDomain.push(i);
    }

    vis.xScale = d3.scaleBand()
        .rangeRound([0, vis.width])
        .paddingInner(0.1)
        .domain(boxDomain);

    vis.yScale = d3.scaleBand()
        .rangeRound([0, vis.height])
        .paddingInner(0.1)
        .domain(boxDomain);

    vis.boxScale = d3.scaleLinear()
        .range([0, vis.xScale.bandwidth()])
        .domain([0, 1]);

    vis.colorPalette = d3.scaleOrdinal()
        .range(servicesColorRange)
        .domain(servicesDomain);

    vis.svg.append('text')
        .attr('transform', "translate(0,-10)")
        .attr('fill', vis.colorPalette(vis.service))
        .text(vis.service);

    vis.wrangleData()
};

DriverVis.prototype.wrangleData = function() {

    var vis = this;

    var totalCount = vis.data.filter(function(d) {
        return d.time <= filterDate;
    });

    totalCount = totalCount[totalCount.length - 1].rides_per_driver;

    vis.driverCount = totalCount;

    vis.displayData = [];

    for (var i = 0; i <= 5; i++) {
        for (var j = 0; j <= 5; j++) {
            amount = Math.max(Math.min(totalCount - 1, 1), 0);
            vis.displayData.push({'x':i, 'y':j, 'value':amount});
            totalCount -= 1;
        }
    }
    vis.updateVis();
};


DriverVis.prototype.updateVis = function() {
    var vis=this;

    var box = vis.svg.selectAll('.driver-box')
        .data(vis.displayData);

    box.enter()
        .append('rect')
        .attr('class', 'driver-box')
        .attr('x', function(d) {
            return vis.xScale(d.x);
        })
        .attr('y', function(d) {
            return vis.yScale(d.y);
        })
        .attr('height', vis.yScale.bandwidth())
        .merge(box)
        .transition()
        .duration(100)
        .attr('fill', function(d) {
            if (d.value === 0) {
                return '#dddddd';
            } else {
                return vis.colorPalette(vis.service);    
            }
        })
        .attr('width', function(d) {
            if (d.value === 0) {
                return vis.boxScale(1);
            } else {
                return vis.boxScale(d.value);
            }
        });

    box.exit().remove();

};