ValuationVis = function(_parentElement, _valuationData, _radiusDomain){
    this.parentElement = _parentElement;
    this.data = _valuationData;
    this.displayData = _valuationData;
    this.radiusDomain = _radiusDomain;

console.log("valuation");
console.log(this.data);
    this.initVis();
};

ValuationVis.prototype.initVis = function() {
var vis=this;
    vis.margin = { top: 80, right: 20, bottom: 20, left: 80 };
    vis.width = $("#" + vis.parentElement)
        .width() - vis.margin.left - vis.margin.right,
        vis.height = 300 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top +
            ")");
// Make a note that you scale is bot the absolute value of the valuation, but a scale of sqrt
    vis.radiusScale = d3.scaleSqrt()
        .range([0, 100])
        .domain(vis.radiusDomain);
//color domain
    vis.colorDomain = ["Yellow Cab","Uber","Lyft","Via","Juno"];
    vis.colorPalette = d3.scaleOrdinal()
        .range(["#ffd651","#050605","#cd25c8","#53e2e1","#4f55b8"])
        .domain(vis.colorDomain);

    vis.wrangleData()
};

ValuationVis.prototype.wrangleData = function() {
var vis=this;

    vis.displayData = vis.data.filter(function(d) {
        return d.time <= filterDate;
    });
    console.log(vis.displayData);
    vis.displayData = [vis.displayData[vis.displayData.length - 1]];

    vis.updateVis();
};


ValuationVis.prototype.updateVis = function() {
    var vis=this;

    console.log(vis.displayData);

    var circleValuation = vis.svg.selectAll("val-circle")
        .data(vis.displayData);

//create the circles for companies' valuations
    circleValuation
        .enter().append("circle")
        .attr('class', 'val-circle')
        .style("opacity", .5)
        .attr("fill", function(d){
            vis.colorPalette(d.company)
        })
        .merge(circleValuation)
        .transition()
        .duration(1000)
        .attr("cx", vis.width/2 )
        .attr("cy", vis.height/2)
        .attr("r", function(d){
            return vis.radiusScale(d.valuation);
        });
//create text label for the circles
    circleValuation
        .append("text")
        .attr("dx",function(d){
            return -40
        })
        .text(function(d){return d.company});

    circleValuation.exit().remove();
};