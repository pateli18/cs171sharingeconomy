
RideVis = function(_parentElement, _rideData){
    this.parentElement = _parentElement;
    this.data = _rideData;
    this.displayData = _rideData;

    // for event handler

    this.initVis();
};

RideVis.prototype.initVis = function() {
    var vis = this;
    vis.margin = {top: 20, right: 100, bottom: 20, left: 60};

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 500 - vis.margin.top - vis.margin.bottom;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.xScale = d3.scaleTime()
        .range([0, vis.width])
        .domain(d3.extent(vis.data, function(d) {
            return d.time;
        }));

    vis.yScale = d3.scaleLinear()
        .rangeRound([vis.height, 0]);

    vis.xAxis = d3.axisBottom()
        .scale(vis.xScale);

    vis.yAxis = d3.axisLeft()
        .scale(vis.yScale);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")")
        .append('text')
        .attr('transform', "translate(" + (vis.width - 15) + ",-5)")
        .attr('class', 'axis-label')
        .text('Month');

    vis.svg.select(".x-axis").call(vis.xAxis);

    vis.svg.append("g")
        .attr("class", "y-axis axis")
        .append('text')
        .attr('class', 'y-label')
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (12) +","+ (70) +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .attr('class', 'axis-label')
        .text("Rides per Day");

//color domain
    vis.colorDomain = ["Yellow Cab","Uber", "Lyft", "Via", "Juno"];
    vis.colorPalette = d3.scaleOrdinal()
        .range(["#ffd651","#050605","#cd25c8","#53e2e1","#4f55b8"])
        .domain(vis.colorDomain);

// draw line
    vis.line = d3.line()
        .x(function(d){ return vis.xScale(d.time);})
        .y(function(d){return vis.yScale(d.rides);});

    vis.wrangleData();

};

RideVis.prototype.wrangleData = function() {
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


RideVis.prototype.updateVis = function() {
    var vis = this;

    //draw line
    var rideLine = vis.svg.selectAll(".ride-line")
        .data(vis.displayData);

    rideLine.enter().append("path")
        .attr("class", "ride-line")
        .merge(rideLine)
        .transition()
        .duration(1000)
        .attr("d", function(d) {
            return vis.line(d.values);
        })
        .style("stroke", function(d){
           return vis.colorPalette(d.key);
        })
        .style("stroke-width", "2.5px")
        .attr('fill', 'none');

    rideLine.exit().remove();

    var lineLabel = vis.svg.selectAll(".ride-line-label")
            .data(vis.displayData);

    lineLabel.enter()
        .append('text')
        .attr('class', 'ride-line-label')
        .merge(lineLabel)
        .transition()
        .duration(1000)
        .attr('x', vis.width + 10)
        .attr('y', function(d) {
            var position = vis.yScale(d.values[d.values.length - 1].rides);
            if (d.key === 'Via' || d.key === 'Uber') {
                position += 12;
            }
            return position;
        })
        .attr('fill', function(d) {
            return vis.colorPalette(d.key);
        })
        .text(function(d) {
            return d.key;
        });

    lineLabel.exit().remove();

    vis.svg.select(".y-axis").transition().duration(1000).call(vis.yAxis);

// car images

    /*
    vis.displayData.forEach(function(serviceData) {

        var rideImage = vis.svg.selectAll(".ride-img-" + serviceData.key)
            .data(serviceData.values);

        rideImage.enter().append("image")
            .attr("class", "ride-img-" + serviceData.key)
            .attr('xlink:href',function(d){
                return d.img;
            })
            .attr('height', '50')
            .attr('width', '50')
            .merge(rideImage)
            .transition()
            .duration(1000)
            .attr("x", function(d){ return vis.xScale(d.time);})
            .attr("y",function(d){return vis.yScale(d.rides);});

        rideImage.exit().remove();

    });
    */

    
};


