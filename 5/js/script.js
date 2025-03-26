var map = L.map('map').setView([-16.495612, -68.133554], 13);

// Añadimos dos capas de teselas para poder cambiar entre ellas
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 10,
    maxZoom:15,
}).addTo(map);


var marcadorBolivia = L.marker([-16.495612, -68.133554]).addTo(map)

var iconoPersonalizado = L.icon({
    iconUrl:'img/frame.png',
    //iconSize:[38,95]
})
var marcadorPersonalizado = L.marker([-16.517823, -68.217563],{
    icon:iconoPersonalizado
}).addTo(map)

marcadorBolivia.bindPopup("<b>Hola La Paz</b><br>Sede de Bolivia").openPopup()

marcadorPersonalizado.bindTooltip("Ubicación especial", {
    permanent: false,
    direction: 'top' 
})

marcadorBolivia.on('click', function(e){
    console.log('marcador clickeado', e.latlng)
})