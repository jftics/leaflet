var map = L.map('map').setView([-16.495612, -68.133554], 13);

// Añadimos dos capas de teselas para poder cambiar entre ellas
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// dato geojson

const pointData = {
  "type":"Feature",
  "geometry":{
    "type":"Point",
    "coordinates":[-68.133554, -16.495612]
  },
  "properties":{
    "nombre":"Ciudad de La Paz",
    "poblacion":" 1 millón"
  }
}

L.geoJSON(pointData).addTo(map).bindPopup(layer=> `<b>${layer.feature.properties.nombre}</b><br>Población:${layer.feature.properties.poblacion}`)

const icon = L.icon({iconUrl:'img/frame.png'})

fetch('data/puntos.geojson')
  .then(response => response.json())
  .then(data => {

      const puntosLayer = L.geoJSON(data,{
        pointToLayer: function(feature, latlng){
          // return L.circleMarker(latlng,{
          //   radius: 8,
          //   color:'#00b3a9',
          //   fillColor:'#4dfff6'
          // })
          return L.marker(latlng, { icon: icon})
        },
        onEachFeature: function(feature, layer){
          if(feature.properties && feature.properties.nombre){
            layer.bindPopup(`<b>${feature.properties.nombre }</b>`)
          }
        }
      }).addTo(map)
      map.fitBounds(puntosLayer.getBounds())
  })
  .catch(error=> console.log(error))



  fetch('data/zonas.geojson')
  .then(response => response.json())
  .then(data => {

      const zonasLayer = L.geoJSON(data,{
        
        style: function(feature){
          return {
            color:'red',
          }
        },

        onEachFeature: function(feature, layer){
          if(feature.properties && feature.properties.nombre){
            layer.bindPopup(`<b>${feature.properties.nombre }</b>`)
          }
        }
      }).addTo(map)
      map.fitBounds(zonasLayer.getBounds())
  })
  .catch(error=> console.log(error))
