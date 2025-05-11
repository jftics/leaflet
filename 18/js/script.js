// Iniciamos el mapa centrado en La Paz, Bolivia
var map = L.map('map').setView([-16.5000, -68.1500], 14);

// Agregamos el mapa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const wmsLayer = L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
  layers: 'proyecto_ol:predio',
  format: 'image/png',
  transparent: true,
  version: '1.1.0'
}).addTo(map)

// const wmsLayer2 = L.tileLayer.wms('https://geo.gob.bo/geoserver/ows',{
//   layers:'geonode:ism_2012_2021',
//   format:'image/png',
//   transparent:true,
//   version:'1.1.0'
// }).addTo(map)

// // Para el servicio WFS, usamos la función fetch para obtener datos GeoJSON
// fetch('http://localhost:8080/geoserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=proyecto_ol:predio&outputFormat=application/json')
// .then(response => response.json())
// .then(data => {
//   // Creamos una capa GeoJSON con los datos recibidos
//   L.geoJSON(data, {
//     onEachFeature:function(feature, layer){
//       layer.bindPopup(`<b>${feature.properties.cod_predio}</b><br>Observación: ${feature.properties.observacion}`)
//     }
//   }).addTo(map)
// })

// map.on('click', function(e){
//   getFeatureInfo(e)
// })

let getFeatureInfo = function (e) {
  const url = getFeatureInfoUrl(
    map,
    wmsLayer,
    e.latlng,
    {
      info_format: 'application/json'
    }
  )
  console.log(url)
  fetch(url)
    .then(response => response.json())
    .then(data => {
      let content = 'No se encontró información.'
      if (data.features && data.features.length > 0) {
        content = '<b>Información:</b><br>'
        data.features[0].properties &&
          Object.entries(data.features[0].properties).forEach(([key, value]) => {
            content += `<strong>${key}:</strong> ${value}<br>`
          })
      }
      L.popup()
        .setLatLng(e.latlng)
        .setContent(content)
        .openOn(map)
    })
    .catch(err => {
      console.error('Error al obtener info:', err);
    })
}

function getFeatureInfoUrl(map, layer, latlng, params = {}) {
  const point = map.latLngToContainerPoint(latlng, map.getZoom())
  const size = map.getSize()

  const baseParams = {
    request: 'GetFeatureInfo',
    service: 'WMS',
    srs: 'EPSG:4326',
    styles: '',
    version: layer.wmsParams.version,
    format: layer.wmsParams.format,
    bbox: map.getBounds().toBBoxString(),
    height: size.y,
    width: size.x,
    layers: layer.wmsParams.layers,
    query_layers: layer.wmsParams.layers,
    info_format: 'application/json',
    x: point.x,
    y: point.y
  }
  if (baseParams.version === '1.3.0') {
    baseParams.crs = 'EPSG:4326';
    baseParams.i = point.x;
    baseParams.j = point.y;
    delete baseParams.x;
    delete baseParams.y;
    delete baseParams.srs;
  }
  Object.assign(baseParams, params)
  return layer._url + L.Util.getParamString(baseParams, layer._url, true)
}

const ToggleClickControl = L.Control.extend({
  options: {
    position: 'topright' // Puedes cambiarlo a 'topleft', 'bottomright', etc.
  },

  onAdd: function (map) {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom')

    container.style.backgroundColor = 'white';
    container.style.width = 'auto';
    container.style.padding = '5px 10px';
    container.style.cursor = 'pointer';
    container.style.font = '14px sans-serif';
    container.innerHTML = '🖱 Activar clic';

    let clickEnabled = false

    container.onclick= function(e){
      L.DomEvent.stopPropagation(e)
      clickEnabled = !clickEnabled

      if(clickEnabled){
        container.innerHTML = '🛑 Desactivar clic'
        map.on('click', getFeatureInfo)
      }else{
        container.innerHTML = '🖱 Activar clic';
        map.off('click', getFeatureInfo)
      }
    }
    return container
  }
})

map.addControl(new ToggleClickControl)