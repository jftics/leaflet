
const map = L.map('map').setView([-16.495612, -68.133554], 13)

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

var cartoDB = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{
    attribution:'CARTO'
}).addTo(map)

var baseMaps = {
    'Open Street Map': osm,
    'CartoDB Voyager': cartoDB
}

L.control.layers(baseMaps).addTo(map)

var info = L.control();

info.onAdd = function(map){
    this._div = L.DomUtil.create('div','info')    
    this._div.innerHTML = "<h4>Mi primer Mapa</h4>"
    return this._div
}

info.addTo(map)
