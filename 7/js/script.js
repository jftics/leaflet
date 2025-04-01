var map = L.map('map').setView([-16.495612, -68.133554], 13);

// Añadimos dos capas de teselas para poder cambiar entre ellas
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);



// Definir datos GeoJSON
const pointData = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [ -68.133554,-16.495612]
    },
    "properties": {
      "name": "Ciudad de La Paz",
      "population": "1 millón"
    }
  };
  
  // Añadir datos al mapa
  L.geoJSON(pointData).addTo(map).bindPopup(function(layer) {
                 return "<strong>" + layer.feature.properties.name + "</strong><br>Población: " + layer.feature.properties.population;
             });


    // const map = L.map('map').setView([-16.495612, -68.133554], 13);
        
    //     // Añadir capa base de OpenStreetMap
    //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //         attribution: '© OpenStreetMap contributors'
    //     }).addTo(map);
        
    //     // Definir datos GeoJSON
    //     const pointData = {
    //         "type": "Feature",
    //         "geometry": {
    //             "type": "Point",
    //             "coordinates": [-68.133554, -16.495612]
    //         },
    //         "properties": {
    //             "name": "Ciudad de México",
    //             "population": "9 millones"
    //         }
    //     };
        
    //     // Añadir datos al mapa
    //     L.geoJSON(pointData).addTo(map)
    //         .bindPopup(function(layer) {
    //             return "<strong>" + layer.feature.properties.name + "</strong><br>Población: " + layer.feature.properties.population;
    //         });