// Inicializamos el mapa centrado en La Paz
var map = L.map('map').setView([-16.489689, -68.119293], 13);
        
// Añadimos la capa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


const drawItems = new L.FeatureGroup()
map.addLayer(drawItems)

var drawControl = new L.Control.Draw({
    edit:{
        featureGroup:drawItems,
        poly:{
            allowIntersection:false
        }
    }
    ,
    draw:{
        polygon:{
            allowIntersection:false,
            showArea:true
        }
    }
})
map.addControl(drawControl)

map.on('draw:created', function(event){
    const layer = event.layer
    const type = event.layerType

    console.log(`Se ha creado un ${type}`)

    drawItems.addLayer(layer)

    if(type== 'marker'){
        layer.bindPopup('marcador')
    }

    const data = drawItems.toGeoJSON()
    console.log(data)
    
})

// Eventos para edición y eliminación
map.on('draw:edited', function(e) {
    const layers = e.layers;
    console.log(`Se han editado ${layers.getLayers().length} capas`);
});

map.on('draw:deleted', function(e) {
    const layers = e.layers;
    console.log(`Se han eliminado ${layers.getLayers().length} capas`);
});

const customDrawOptions={
    draw:{
        polyline:{
            shapeOptions:{
                color: '#f357a1',
                weight:5
            }
        },
        polygon: {
            shapeOptions: {
                color: '#3388ff',
                fillColor: '#3388ff',
                fillOpacity: 0.3
            },
            showArea: true
        },
        marker: {
            icon: L.icon({
                iconUrl: 'img/frame.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        },
        rectangle: {
            shapeOptions: {
                color: '#ff7800',
                fillColor: '#ff7800',
                fillOpacity: 0.3
            }
        }
    }

}

map.removeControl(drawControl)
drawControl = new L.Control.Draw({
    edit:{
        featureGroup:drawItems
    },
    draw: customDrawOptions.draw
})
map.addControl(drawControl)


function guardarGeometrias(){
    const data = drawItems.toGeoJSON()

    localStorage.setItem('mapa_la_paz',JSON.stringify(data))

    // Ejemplo: mostrar los datos en formato JSON
    console.log(JSON.stringify(data, null, 2));

    // Ejemplo: enviar los datos a un servidor
    /*
    fetch('https://mi-api.example/guardar-mapa', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => console.log('Éxito:', data))
    .catch((error) => console.error('Error:', error));
    */

}

// Añadimos un botón para guardar
const botonGuardar = L.control({position: 'bottomright'});
botonGuardar.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'info');
    div.innerHTML = '<button onclick="guardarGeometrias()" style="padding: 8px 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Guardar mapa</button>';
    return div
};
botonGuardar.addTo(map)

