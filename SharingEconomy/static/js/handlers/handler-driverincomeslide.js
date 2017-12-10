var stackAttributes = ["PreTaxIncome","OperationCosts","UberFeesAndCommissions"];
var incomeData;
var incomeChart;
var hourChart;
var mapChart;

queue()
    .defer(d3.csv, "static/data/driver/driver_wage_data.csv")
    .defer(d3.json, 'static/data/timeline/world-110m.json')
    .defer(d3.json, 'static/data/driver/driver_routes.geo.json')
    .await(function(error, incomeDataRaw, usMapRaw, polyLinesRaw){

        var usMap = topojson.feature(usMapRaw, usMapRaw.objects.countries).features;
        var polyLines = polyLinesRaw;

        incomeDataRaw.forEach(function(d, i) {
            d.TotalRevenue = +d.TotalRevenue;
            d.UberFeesAndCommissions = +d.UberFeesAndCommissions;
            d.OperationCosts = +d.OperationCosts;
            d.PreTaxIncome = +d.PreTaxIncome;
            d.TotalTrips = +d.TotalTrips;
            d.TotalMiles = +d.TotalMiles;
            d.TotalHours = +d.TotalHours;
            d.WeeklyMiles = +d.WeeklyMiles;
            d.WeeklyHours = +d.WeeklyHours;
            d.HourlyWage = +d.HourlyWage;
            d.EndLat = +d.EndLat;
            d.EndLng = +d.EndLng;
            d.StartLat = +d.StartLat;
            d.StartLng = +d.StartLng;
            d.id = i;
        });

        incomeData = incomeDataRaw;
        incomeChart = new IncomeChart('driver-income-bar', incomeData);
        hourChart = new HoursBar('driver-hour-bar', incomeData);
        mapChart = new DriverMap('driver-map', incomeData, usMap, polyLines);

        updateParameterTitles();
        incomeSliderMove();
    });

function updateIncomeCharts() {
    incomeChart.wrangleData();

    updateParameterTitles();

    hourChart.wrangleData();
    mapChart.wrangleData();
}

function updateParameterTitles() {
    var incomeValue = Math.max($('#income-slider').slider("option", "value"), 10) * 1000;
    var relevantRecord = incomeData.filter(function(d) {
        return d.PreTaxIncome === incomeValue;
    });

    var hourAmount = relevantRecord[0].WeeklyHours;
    var distance = relevantRecord[0].Location;

    var sectionDescription = 'To earn ' + d3.format('$,.0f')(incomeValue) + ' driving for Uber, you would have to drive <i>every week</i>: ';
    $('#driver-section-description').html(sectionDescription);

    var hourDescription = hourAmount + ' hours';
    $('#driver-hour-description').html(hourDescription);
    
    var distanceDescription = 'Enough miles to go from Boston to ' + distance;
    $('#driver-map-description').html(distanceDescription);
}

function incomeSliderMove() {
    var position = $('#income-slider .ui-slider-handle').position();
    var income = $('#income-slider').slider("option", "value");
    $('#income-slider-label').html(d3.format('$,.0f')(income * 1000));
    $('#income-slider-label').css({top:position.top + 165, left:position.left + 200});
}