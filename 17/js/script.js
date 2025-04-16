// Iniciamos el mapa centrado en La Paz, Bolivia
var map = L.map('map').setView([-16.5000, -68.1500], 13);

// Agregamos el mapa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Inicializamos el sidebar
//var sidebar = L.control.sidebar('sidebar').addTo(map)
var sidebar = L.control.sidebar({
    container:'sidebar',
    position:'left' // left//right
}).addTo(map)

// Función para centrar el mapa en La Paz
document.getElementById('zoomToCenter').addEventListener('click', function(e){
    map.setView([-16.5000, -68.1500], 13);
    sidebar.close() // Cerramos el sidebar después de hacer clic
})

// Añadimos marcadores para lugares turísticos
var markers = {}
document.querySelectorAll('#tourist-places li').forEach(function(item){
    item.addEventListener('click',function(){
        var lat =parseFloat(this.getAttribute('data-lat'))
        var lng =parseFloat(this.getAttribute('data-lng'))

        // Centramos el mapa en la ubicación
        map.setView([lat, lng], 16);
        // Si ya existe un marcador para este lugar, solo lo enfocamos
        if(markers[this.textContent]){
            markers[this.textContent].openPopup()
        }else{
            // Creamos un nuevo marcador
            var marker = L.marker([lat,lng])
            .addTo(map)
            .bindPopup(this.textContent)
            .openPopup()

            // Guardamos el marcador para referencia futura
            markers[this.textContent]= marker
        }
    })
})


// GeoJSON simplificado de distritos de La Paz
var distritosGeoJSON = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "Distrito 1 - Centro"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-68.1400, -16.4900],
                    [-68.1300, -16.4900],
                    [-68.1300, -16.5000],
                    [-68.1400, -16.5000],
                    [-68.1400, -16.4900]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Distrito 2 - Sur"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-68.1400, -16.5100],
                    [-68.1300, -16.5100],
                    [-68.1300, -16.5200],
                    [-68.1400, -16.5200],
                    [-68.1400, -16.5100]
                ]]
            }
        }
    ]
};

var distritosLayer = L.geoJSON(distritosGeoJSON,{
    style: {
        color: "#ff7800",
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.35
    },
    onEachFeature: function(feature, layer){
        layer.bindPopup(feature.properties.name)
    }
})

// Simulación de rutas de transporte público
var transportRoutes = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "Línea Amarilla"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [-68.1450, -16.4950],
                    [-68.1400, -16.5000],
                    [-68.1350, -16.5050]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Línea Roja"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [-68.1550, -16.4950],
                    [-68.1500, -16.5000],
                    [-68.1450, -16.5050]
                ]
            }
        }
    ]
};

var transportLayer =L.geoJSON(transportRoutes,{
    style: function(feature){
        return{
            weight: 4,
            opacity: 0.7,
            color: feature.properties.name.includes("Amarilla")? "#ccac00": "#FF0000"
        }
    },
    onEachFeature: function(feature, layer){
        layer.bindPopup(feature.properties.name)
    }
})

document.getElementById('showDistricts').addEventListener('click', function(){
    if(this.checked){
        distritosLayer.addTo(map)
    }else{
        map.removeLayer(distritosLayer)
    }
})
document.getElementById('showTransport').addEventListener('click', function(){
    if(this.checked){
        transportLayer.addTo(map)
    }else{
        map.removeLayer(transportLayer)
    }
})