

ValueMap = function(_parentElement, _data, _mapParams, _poiData, _fullHeight) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;
    this.mapParams = _mapParams;
    this.poiData = _poiData;
    this.fullHeight = _fullHeight;
    console.log(this.poiData);

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
        id: vis.mapParams.type,
        accessToken: 'pk.eyJ1IjoicGF0ZWxpMTgiLCJhIjoiY2o5cnNsc2dxMzFwNTJ3bGdrZzdnM3YzcSJ9.aC2VGgP88galycKJ--ApbA'
    }).addTo(vis.baseMap);

    L.svg({clickable:true}).addTo(vis.baseMap);

    vis.svg = d3.select("#" + vis.parentElement)
        .select("svg")
        .attr("pointer-events", "auto");

    vis.g = vis.svg.select("g");

    var harvardIndex = vis.data.length + 1
    var harvardData = {'lat':42.3735695, 'lng':-71.1211549, 'poi':true, 'index':harvardIndex, 'name':'Harvard Square'};
    vis.data.push(harvardData);
    vis.poiData.push(harvardData);

    vis.mapPoint = vis.g.selectAll(".relative-value-map-point")
        .data(vis.data)
        .enter()
        .append("circle")
        .attr('class', 'relative-value-map-point')
        .attr('id', function(d) {
            return 'relative-value-map-point-' + d.index;
        })
        .attr('fill', function(d) {
            if (d.index === harvardIndex) {
                return 'white';
            } else {
                return 'none';
            }
        })
        .attr('r', 8);

    vis.mapLabel = vis.g.selectAll(".relative-value-map-label")
        .data(vis.data)
        .enter()
        .append('text')
        .attr('class', 'relative-value-map-label')
        .style('font-size', '9px')
        .attr('fill', 'white');

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

    vis.poi = {};
    vis.poiData.forEach(function(d) {
        vis.poi[d.index] = d.name;
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
            })
            .attr("stroke", function(d) {
                if (d.poi) {
                    return relativeValuePlot.colorScale(d.price_differential);
                } else {
                    return 'none';
                }
            })
            .style("stroke-width", function(d) {
                if (d.poi) {
                    return "5px";
                } else {
                    return 'none';
                }
            });

        d3.selectAll(".relative-value-map-label")
            .attr("transform", function(d) {
                return "translate("+
                    (vis.baseMap.latLngToLayerPoint([d.lat, d.lng]).x + 5) +","+
                    (vis.baseMap.latLngToLayerPoint([d.lat, d.lng]).y - 3) +")";
            })
            .text(function(d) {
                if (d.poi) {
                    return vis.poi[d.index];
                } else {
                    return '';
                }
            });
    });
}
