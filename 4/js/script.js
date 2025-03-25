//var map = L.map('map').setView([-16.495612, -68.133554], 13);
var map = L.map('map',{
    center: [-16.495612, -68.133554],
    zoom:13,
   
    zoomControl: false
})

// Añadimos dos capas de teselas para poder cambiar entre ellas
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 10,
    maxZoom:15,
}).addTo(map);

var cartoDB = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    
});

var baseLayers={
    'osm': osm,
    'carto': cartoDB
}
L.control.layers(baseLayers).addTo(map)

L.control.zoom({
    position:'topleft',
    zoomInText:'+',
    zoomOutText:'-',
    zoomInTitle: 'Acercar',
    zoomOutTitle:'Alejar'
}).addTo(map)

L.control.scale({
    maxWidth: 200,         // Ancho máximo
    metric: true,
    imperial:true,
    position:'bottomleft'
}).addTo(map)