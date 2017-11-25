// SVG drawing area
var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#driver-income-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Initialize data
loadData();

// Calculated Uber income data
var data;
var stack;

// Load CSV file
function loadData() {
        d3.csv("static/data/driver/uberDriverIncome-t.csv", function (error, csv) {

            csv.forEach(function (d) {
                // Convert numeric values to 'numbers'
                d.value10 = +d.value10;
            });

            data = d3.nest()
                .key(function(d) { return d.bucket; })
                .rollup(function(d) { return d[0].value10; })
                .map(csv);

            // Store stacked data in global variable
            stack = d3.stack()
                .keys(data.keys())
                .value(function(d, key) { return d.get(key); })
                ([data]);

            // Draw the visualization for the first time
            updateVisualization();
        });

/*    income = {
        Fare_revenue: 43606,
        Uber_share: -8721,
        Fuel_cost: -1820,
        Depreciation: -1751,
        Maintenance_insurance: -1313,
        Driver_income: 30000
    }
    updateVisualization();*/
}

// Render visualization
// Should include all the dynamic chart elements and should be called every time something changes
// Draws heavily from https://bl.ocks.org/mbostock/c957dc9c1f8a0bae58d5/bf69a30b7921cf0983f23d539b85d8a8102fe4ef
function updateVisualization() {

    console.log(stack);

    // Initialize y scale with fare revenue
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([
            d3.min(stack, function(s) { return d3.min(s[0]); }),
            d3.max(stack, function(s) { return d3.max(s[0]); })
        ]);

    /*var headers = [];
    headers = income.columns;*/

    var x = d3.scaleBand()
        .domain(data.keys())
//        .domain(['Fare revenue', 'Uber share', 'Fuel cost', 'Depreciation', 'Maintenance & insurance', 'Driver income'])
        .rangeRound([0, width])
        .padding(0.1);

    // Add x-axis
    var xAxis = d3.axisBottom()
        .scale(x);

    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(xAxis);

    // Add y-axis
    var yAxis = d3.axisLeft()
        .scale(y);

    svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(0,0)")
        .call(yAxis);

    svg.selectAll("rect")
        .data(stack)
        .enter().append("rect")
        .attr("class", function(d) { return "rect rect--" + (d[0][0] < d[0][1] ? "positive" : "negative"); })
        .attr("x", function(d) { return x(d.key); })
        .attr("y", function(d) { return y(Math.max(d[0][0], d[0][1])); })
        .attr("height", function(d) { return (d[0][0] > d[0][1]) ? (y(d[0][1]) - y(d[0][0])) : (y(d[0][0]) - y(d[0][1])); })
        .attr("width", x.bandwidth());
}