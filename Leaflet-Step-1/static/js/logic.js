// Create our initial map object
// Set the longitude, latitude, and the starting zoom level
//var chosenState = objDropDown.value;
var myMap = L.map("map", {
    center: [15,0],
    zoom: 1.5
  });
  
  // Add a tile layer 
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);


url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Grab the data with d3
d3.json(url, function(response) {
    console.log(response);

    //loop through data and attach circle markers to map
    for (var i = 0; i < response.features.length; i++) {
        
        var lat = parseFloat(response.features[i].geometry.coordinates[0]);
        var lon = parseFloat(response.features[i].geometry.coordinates[1]);
        var place = response.features[i].properties.place;
        var mag = parseFloat(response.features[i].properties.mag);
        var csize = mag*100000;


        console.log(lat, lon, place, csize, mag);
        var list = "<dl>"
               + "<dd>" + place + "</dd>"
               + "<dd> Magnitude: " + mag + "</dd>" 
               + "</d1>";
          
          
        var layerGroup = L.layerGroup().addTo(myMap);
        var marker = L.circle([lon, lat], csize,
            {color: getColor(mag)}).addTo(layerGroup);
        marker.bindPopup(list);      
    };
 });


//color function
function getColor(d) {
    return d > 5 ? "red" :
           d > 4  ? "orangered" :
           d > 3  ? "orange" :
           d > 2  ? "yellow" :
           d > 1   ? "lime" :
            "green" ;
           
}

   
//add legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-1, 1, 2, 3, 4, 5],
            labels = [];
    

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
};
    
legend.addTo(myMap);
    