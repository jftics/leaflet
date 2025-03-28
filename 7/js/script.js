var map = L.map('map').setView([-16.495612, -68.133554], 13);

// Añadimos dos capas de teselas para poder cambiar entre ellas
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var miPunto = L.marker([-16.495612, -68.133554]).addTo(map)
miPunto.on('click',function(e){
    alert("click sobre el punto")
})

var miLinea= L.polyline([
    [-16.524910, -68.200024],
    [-16.516125, -68.180218],
    [-16.516331, -68.174060]
], {color:'#0100ff'}).addTo(map)
miLinea.on('mouseover',function(e){
    miLinea.setStyle({color:'yellow'}) 
})
miLinea.on('mouseout',function(e){
    miLinea.setStyle({color:'#0100ff'}) 
})

var miPlogino = L.polygon([
    [-16.524811, -68.181499],
    [-16.521626, -68.178586],
    [-16.525335, -68.174216],
    [-16.528043, -68.176754],
    [-16.524811, -68.181499]
],{color:'red'}).addTo(map)

miPlogino.setStyle({color:'green'})