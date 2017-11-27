
var incomeChart;


d3.csv("static/data/driver/uberDriverIncome.csv", function (error, data) {

            data.forEach(function (d) {
                // Convert numeric values to 'numbers'
                d.value10 = +d.value10;
                d.value20 = +d.value20;
                d.value30 = +d.value30;
                d.value40 = +d.value40;
                d.value50 = +d.value50;
                d.value60 = +d.value60;
                d.value70 = +d.value70;
                d.value80 = +d.value80;
                d.value90 = +d.value90;
                d.value100 = +d.value100;
            });

            incomeChart = new IncomeChart('driver-income-chart', data);
            updateWeeklyTargets();
});

function updateIncomeChart() {
    incomeChart.wrangleData();
    updateWeeklyTargets();
}

function updateWeeklyTargets() {
    var formatValue = d3.format(",.2d");
    var fixed = 3000;
    var trip_net = 9.45;
    var avg_mi = 6;
    var weeks = 50;
    var fare = d3.max(incomeChart.displayData, function(s) { return d3.min(s[0]); });
    var trips = (fare+fixed) / weeks / trip_net;
    var miles = trips * avg_mi;

    $("#weekly-fare").html(formatValue(fare/weeks));
    $("#weekly-trips").html(formatValue(trips));
    $("#weekly-miles").html(formatValue(miles) + "mi");
}

