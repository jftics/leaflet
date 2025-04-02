var map = L.map('map').setView([-16.495612, -68.133554], 13);

// Añadimos dos capas de teselas para poder cambiar entre ellas
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var locations = [
  [-16.495612, -68.133554], // Ubicaciones de ejemplo en La Paz
  [-16.495378, -68.139085],
  [-16.510191, -68.108443],
  [-16.521382, -68.153333],
  [-16.526813, -68.044242],
  [-16.492086, -68.123292],
  [-16.499986, -68.152560]
]

var markers = L.markerClusterGroup({
  maxClusterRadius:120,
  iconCreateFunction: function(cluster){
    return L.divIcon({
      html: '<b>'+ cluster.getChildCount() +'</b>',
      className:'custom-cluster-icon',
      iconSize: [40,40]
    })
  }
})

locations.forEach(coord=>{
  var marker = L.marker(coord)
  //marker.addTo(map)
  markers.addLayer(marker)
})

map.addLayer(markers)

