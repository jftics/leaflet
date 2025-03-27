var map = L.map('map').setView([-16.495612, -68.133554], 13);

// Añadimos dos capas de teselas para poder cambiar entre ellas
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var satelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{attribution:'Esri'})

var baseLayers = {
    'osm': osm,
    'Satelite':satelite
}

var iconR = L.icon({iconUrl:'img/restaurant.png'})
var restaurantes = L.layerGroup([
    L.marker([-16.515766, -68.152490], {icon: iconR}).bindPopup('Restaurante 1'),
    L.marker([-16.524378, -68.160452], {icon: iconR}).bindPopup('Restaurante 2')
])
var iconM = L.icon({iconUrl:'img/museo.png'})
var museos = L.layerGroup([
    L.marker([-16.526237, -68.188929], {icon: iconM}).bindPopup('Museo 1'),
    L.marker([-16.533086, -68.193829], {icon: iconM}).bindPopup('Museo 2')
]);

var overLayMaps = {
    'restaurantes':restaurantes,
    'museos': museos
}

osm.addTo(map)
restaurantes.addTo(map)

L.control.layers(baseLayers, overLayMaps,{
    collapsed: true,
    position: 'topleft'
}).addTo(map)




