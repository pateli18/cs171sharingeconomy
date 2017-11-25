

ValueMap = function(_parentElement, _data, _mapParams, _poiData, _fullHeight) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;
    this.mapParams = _mapParams;
    this.poiData = _poiData;
    this.fullHeight = _fullHeight;

    this.initVis();
}

ValueMap.prototype.initVis = function() {
    var vis = this;

    $('#' + vis.parentElement).width(this.fullHeight);
    $('#' + vis.parentElement).height(this.fullHeight);

    var borderRadius = this.fullHeight / 2;

    $('#' + vis.parentElement).css('border-radius', borderRadius + 'px');

    vis.baseMap = L.map(vis.parentElement, {zoomControl:false,
        scrollWheelZoom:false})
        .setView([vis.mapParams.lat, vis.mapParams.lng], vis.mapParams.zoom);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: vis.mapParams.type,
        accessToken: 'pk.eyJ1IjoicGF0ZWxpMTgiLCJhIjoiY2o5cnNsc2dxMzFwNTJ3bGdrZzdnM3YzcSJ9.aC2VGgP88galycKJ--ApbA'
    }).addTo(vis.baseMap);

    vis.harvardIcon = L.icon({
        iconUrl: 'static/img/harvard-logo.png',

        iconSize:     [38, 38], // size of the icon
        iconAnchor:   [17, 17] // point of the icon which will correspond to marker's location
    });

    L.marker([vis.mapParams.lat, vis.mapParams.lng], {icon: vis.harvardIcon}).addTo(vis.baseMap);

    vis.poiLayer = L.layerGroup().addTo(vis.baseMap);

    L.svg({clickable:true}).addTo(vis.baseMap);

    vis.svg = d3.select("#" + vis.parentElement)
        .select("svg")
        .attr("pointer-events", "auto");

    vis.g = vis.svg.select("g");

    vis.mapPoint = vis.g.selectAll(".relative-value-map-point")
        .data(vis.data)
        .enter()
        .append("circle")
        .attr('class', 'relative-value-map-point')
        .attr('id', function(d) {
            return 'relative-value-map-point-' + d.index;
        })
        .attr('fill', 'none')
        .attr('r', 8);

    vis.wrangleData();
}

ValueMap.prototype.wrangleData = function() {
    var vis = this;

    vis.uberType = $('#relative-value-uber-type').find(':selected').val();
    vis.surge = Math.max($('#surge-slider').slider("option", "value"), 1);

    vis.displayData.forEach(function(d) {
        d.distance = d[vis.uberType + '_distance'];
        d.duration = d[vis.uberType + '_duration'];
        d.price_differential = d.taxi_price - d[vis.uberType + '_price'] * vis.surge;
    });

    vis.poiData.forEach(function(d) {
        var relevantPoint = vis.displayData[d.index];
        d.distance = relevantPoint.distance;
        d.duration = relevantPoint.duration;
        d.price_differential = relevantPoint.price_differential;
    });

    vis.updateValueMap();
}

ValueMap.prototype.updateValueMap = function() {
    var vis = this;

    vis.baseMap.setView([vis.mapParams.lat, vis.mapParams.lng], selectedZoom);

    vis.baseMap.on('moveend', function() {

        d3.selectAll(".relative-value-map-point")
            .attr("transform", function(d) {
                return "translate("+
                    vis.baseMap.latLngToLayerPoint([d.lat, d.lng]).x +","+
                    vis.baseMap.latLngToLayerPoint([d.lat, d.lng]).y +")";
            });

        vis.poiData.forEach(function(d) {
            var marker = L.marker([d.lat, d.lng])
                .bindPopup("<strong>" + d.name + "</strong><br>"
                    + "<span>Price Differential: " + d3.format("($.2f")(d.price_differential) + " </span><br>"
                    + "<span>Duration: " + d.duration + " min</span><br>"
                    + "<span>Distance: " + d.distance + "mi</span><br>");
            vis.poiLayer.addLayer(marker);
        });
    });
}
