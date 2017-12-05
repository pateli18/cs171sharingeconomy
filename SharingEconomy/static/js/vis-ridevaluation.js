ValuationVis = function(_parentElement, _valuationData, _radiusDomain, _service){
    this.parentElement = _parentElement;
    this.data = _valuationData;
    this.displayData = _valuationData;
    this.radiusDomain = _radiusDomain;
    this.service = _service;

    this.initVis();
};

ValuationVis.prototype.initVis = function() {
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

    vis.radiusScale = d3.scaleSqrt()
        .range([0, 50])
        .domain(vis.radiusDomain);

    vis.colorPalette = d3.scaleOrdinal()
        .range(servicesColorRange)
        .domain(servicesDomain);

    vis.wrangleData()
};

ValuationVis.prototype.wrangleData = function() {
    var vis=this;

    vis.displayData = vis.data.filter(function(d) {
        return d.time <= filterDate;
    });

    vis.displayData = [vis.displayData[vis.displayData.length - 1]];

    vis.updateVis();
};


ValuationVis.prototype.updateVis = function() {
    var vis=this;

    var circleCab = vis.svg.selectAll(".val-circle")
        .data(vis.displayData, function(d) {
            return d.valuation;
        });

    circleCab.enter()
        .append("circle")
        .attr('class', 'val-circle')
        .attr("fill", vis.colorPalette(vis.service))
        .merge(circleCab)
        .attr("cx", vis.width/2 )
        .attr("cy", vis.height/2)
        .attr("r", function(d){
            return vis.radiusScale(d.valuation);
        });

    circleCab.exit().remove();

    var threshold = 4500000000;

    var valuationLabel = vis.svg.selectAll('.val-text')
        .data(vis.displayData, function(d) {
            return d.valuation;
        });

    valuationLabel.enter()
        .append('text')
        .attr('class', 'val-text')
        .merge(valuationLabel)
        .attr("x", '50%')
        .attr("y", function(d) {
            if (d.valuation >= threshold) {
                return '50%';
            } else {
                return vis.height/2 - vis.radiusScale(d.valuation) - 2;
            }
        })
        .attr("fill", function(d) {
            if (d.valuation >= threshold) {
                return 'white';
            } else {
                return vis.colorPalette(vis.service);
            }
        })
        .attr('text-anchor', 'middle')
        .text(function(d){
            return d3.format('$,.0s')(d.valuation);
        })
        .style('font-size', '10px');

    valuationLabel.exit().remove();


};