var map = L.map('map').setView([0, -78], 3);

// Añadimos dos capas de teselas para poder cambiar entre ellas
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const poligono = L.polygon([
  [-10, -75],
  [10, -65],
  [0, -55]
], {
  color:'#00b612',
  weight:5,
  opacity:0.5,
  fillColor:'yellow',
  fillOpacity: 0.5
}).addTo(map)

const linea = L.polyline([
  [-5, -80],
  [15, -75],
  [5, -60]
], {
  color: 'red',
  weight:3,
  opacity:0.7,
  dashArray: '20, 10, 30, 5'

}).addTo(map)

const circulo = L.circle([-5, -70],{
  radius: 300000,
  color:'blue',
  fillColor:'yellow',
  fillOpacity: 0.5,
  weight: 2
}).addTo(map)

const paises = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "nombre": "Brasil",
        "poblacion": 212600000,
        "area": 8515767
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-50, -10], [-40, -10], [-40, -20], [-50, -20], [-50, -10]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "nombre": "Argentina",
        "poblacion": 45380000,
        "area": 2780400
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-70, -30], [-60, -30], [-60, -40], [-70, -40], [-70, -30]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "nombre": "Colombia",
        "poblacion": 50900000,
        "area": 1141748
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-75, 5], [-65, 5], [-65, -5], [-75, -5], [-75, 5]]]
      }
    }
  ]
}


function getColorByDensity(density){
  return density > 40 ? '#800026':
          density > 30 ? '#BD0026':
          density > 20 ? '#E31A1C' :
          density > 10 ? '#FC4E2A' :
          density > 5 ? '#FD8D3C' :
                       '#FEB24C';
}

function highlightFeature(e){
  const layer = e.target
  layer.setStyle({
    weight: 4,
    color: '#eff11c',
    dashArray: '',
    fillOpacity: 0.9
  });
}
function resetHighlight(e){
  paisesLayer.resetStyle(e.target)
}

var paisesLayer = L.geoJSON(paises, {
  style: function(feature){
    const densidad = feature.properties.poblacion / feature.properties.area
    return {
      fillColor: getColorByDensity(densidad),
      weight: 2,
      opacity: 1,
      color:'white',
      dashArray:'3',
      fillOpacity:0.7
    }
  },
  onEachFeature: function(feature, layer){
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: function(e){
        map.fitBounds(e.target.getBounds())
      }
    })
    const densidad = (feature.properties.poblacion / feature.properties.area).toFixed(1)
    layer.bindPopup(`<b>${feature.properties.nombre}</b><br>Población: ${feature.properties.poblacion}<br>Área: ${feature.properties.area} km2<br>Densidad:${densidad}`)
  }

}).addTo(map)

const legend = L.control({position:'bottomright'})

legend.onAdd = function(map){
  const div = L.DomUtil.create('div','info legend')

  const grades = [0,5,10,20,30,40]

  div.innerHTML = '<h4>Densidad Poblacional</h4>'
  for (let i = 0; i < grades.length; i++){
    div.innerHTML += '<i style="display: inline-block; width: 20px; height: 20px; background:'+ getColorByDensity(grades[i]+1)+'"></i> ' +
    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')
  }

  return div
}
 legend. addTo(map)
