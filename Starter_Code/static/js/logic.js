//Store enpoint as url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

//Creation of the base layers.
let streetlayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

let topolayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

//create variable for map, then run through leaflet and display
var mymap = L.map("map",{zoom:1,
    center: [0,180],layers:[topolayer]
})

//create a function to change the color of feautre dependent on the depth of the eathquake
function depthstyle (feature){
    let depth = feature.geometry.coordinates[2]
    if (depth > 70 ) {
        return "green"
    } else if (depth > 50){
        return "yellow"
    }
    else {
        return "red"
    } 
}

//create a function that returns our depth color attribute and a correlated size/radius change dependent on the magnitude 
function mapstyle (feature){
    return {color:"black",fillOpacity:.4,
                             opacity: .9, 
                             fillColor:depthstyle(feature),
                             radius: feature.properties.mag*5, 
                             weight:2                         
} 
}

//create interactive marker associated with each earthquake
d3.json(url).then(data => {console.log(data)
L.geoJson(data, {
    pointToLayer: function(feature,coordinates){
        return L.circleMarker(coordinates)
    },
    style:mapstyle

    ,onEachFeature: function (feature, layer) {
          layer.bindPopup('<h1>location:'+feature.properties.place+'</h1><h2>magnitude: '
          +feature.properties.mag+'</h2>'+'<h2>time(Unix):'+feature.properties.time+'</h2>'+'<h2>type:'+feature.properties.type+'</h2>');
        },
  
}).addTo(mymap)


// Create the legend and add it to the map 

var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');
    const labels = ["0-50","50-70","70-90"];
    const categories = ["red","yellow","green"];
    let from, to;

    for (let i = 0; i < labels.length; i++) {
            div.innerHTML += '<div class="circle" style="background:' + categories[i] + '"></div> ' + labels[i] + "<br/>"
        }
        //div.innerHTML = labels.join('<br>');
    return div;
    };

legend.addTo(mymap);

})
