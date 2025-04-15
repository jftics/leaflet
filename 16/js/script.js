// Inicializamos el mapa centrado en La Paz
var map = L.map('map').setView([-16.489689, -68.119293], 13);

// Añadimos la capa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const drawItems = new L.FeatureGroup()
map.addLayer(drawItems)

var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawItems
    },
    draw: {
        marker: {
            icon: L.icon({
                iconUrl: 'img/frame.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        },
        polyline: {
            shapeOptions: {
                color: '#f357a1',
                weight: 5
            }
        },
        polygon: {
            allowIntersection: false,
            shapeOptions: {
                color: '#3388ff'
            }
        },
        rectangle:false,
        circle:false,
        circlemarker:false

    }
})

L.drawLocal = {
    draw: {
        toolbar: {
            actions: {
                title: 'Cancelar el dibujo',
                text: 'Cancelar'
            },
            finish: {
                title: 'Finalizar dibujo',
                text: 'Finalizar'
            },
            undo: {
                title: 'Eliminar el ultimo punto',
                text: 'Deshacer'
            },
            buttons: {
                polyline: 'Dibujar una línea',
                polygon: 'Dibujar un polígono',
                rectangle: 'Dibujar un rectángulo',
                circle: 'Dibujar un círculo',
                marker: 'Colocar un marcador',
                circlemarker: 'Colocar un marcador circular'
            }
        },
        handlers: {
            circle: {
                tooltip: {
                    start: 'Haz clic y arrastra para dibujar un círculo.'
                },
                radius: 'Radio'
            },
            circlemarker: {
                tooltip: {
                    start: 'Haz clic en el mapa para colocar un marcador circular.'
                }
            },
            marker: {
                tooltip: {
                    start: 'Haz clic en el mapa para colocar un marcador.'
                }
            },
            polygon: {
                error: '<strong>Error:</strong> los polígonos no pueden cruzarse.',
                tooltip: {
                    start: 'Haz clic para comenzar a dibujar la forma.',
                    cont: 'Haz clic para continuar dibujando.',
                    end: 'Haz clic en el primer punto para cerrar esta forma.'
                }
            },
            polyline: {
                error: '<strong>Error:</strong> la línea no puede cruzarse.',
                tooltip: {
                    start: 'Haz clic para comenzar a dibujar la línea.',
                    cont: 'Haz clic para continuar dibujando.',
                    end: 'Haz clic en el último punto para finalizar la línea.'
                }
            },
            rectangle: {
                tooltip: {
                    start: 'Haz clic y arrastra para dibujar un rectángulo.'
                }
            },
            simpleshape: {
                tooltip: {
                    end: 'Suelta el ratón para finalizar la forma.'
                }
            }
        }
    },
    edit: {
        toolbar: {
            actions: {
                save: {
                    title: 'Guardar los cambios',
                    text: 'Guardar'
                },
                cancel: {
                    title: 'Cancelar la edición',
                    text: 'Cancelar'
                },
                clearAll: {
                    title: 'Eliminar todas las capas',
                    text: 'Eliminar todo'
                }
            },
            buttons: {
                edit: 'Editar capas',
                editDisabled: 'No hay capas para editar',
                remove: 'Eliminar capas',
                removeDisabled: 'No hay capas para eliminar'
            }
        },
        handlers: {
            edit: {
                tooltip: {
                    text: 'Arrastra los vértices o marcadores para editar.',
                    subtext: 'Haz clic en "Guardar" cuando termines.'
                }
            },
            remove: {
                tooltip: {
                    text: 'Haz clic en una forma para eliminarla.'
                }
            }
        }
    }
}

map.addControl(drawControl)

map.on('draw:created', function(e){
    const layer = e.layer
    const type = e.layerType;

    if(type=== 'marker'){
        const nombre = prompt('Nombre del lugar:', '')
        const descripcion = prompt('Descripción:', '')
        if(nombre){
            layer.bindPopup(`<b>${nombre}</b><br>${descripcion || ''}`)
            layer.feature = {
                type: "Feature",
                properties:{
                    name: nombre,
                    description: descripcion || ''
                }
            }
        }
    }else if (type === 'polyline') {
            
        const nombre = prompt('Nombre de la ruta:', '');
        if (nombre) {
            layer.bindPopup(`<b>Ruta: ${nombre}</b>`);
            layer.feature = {
                type: "Feature",
                properties: {
                    name: nombre,
                    type: 'ruta'
                }
            };
        }
    }
    drawItems.addLayer(layer)
})


// Datos de ejemplo: lugares turísticos de La Paz
const puntosDeInteres = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "Plaza Murillo",
                "description": "Plaza principal de La Paz, donde se encuentran el Palacio de Gobierno y la Catedral."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-68.1304, -16.4957]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Valle de la Luna",
                "description": "Formación geológica única con paisajes lunares a pocos kilómetros del centro."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-68.0901, -16.5678]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Teleférico Amarillo",
                "description": "Línea que conecta el centro con la zona sur de la ciudad."
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [-68.1319, -16.4953],
                    [-68.1290, -16.5090],
                    [-68.1269, -16.5202]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Mercado de las Brujas",
                "description": "Famoso mercado tradicional en el centro histórico."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-68.1365, -16.4955]
            }
        }
    ]
};

function cargarDatos(datos){
    L.geoJSON(datos,{
        onEachFeature: function(feature, layer){
            if(feature.properties && feature.properties.name ){
                layer.bindPopup(`<b>${feature.properties.name}</b><br>${feature.properties.description}`);
            }
            drawItems.addLayer(layer)
        }
    } )
}

document.getElementById('save-button').addEventListener('click', function(){
    const data = drawItems.toGeoJSON()
    const datastr = JSON.stringify(data, null, 2)

    // Crear un blob y un enlace de descarga
    const blob = new Blob([datastr],{type: 'application/json'})
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'mapa_la_paz.geojson'
    a.click()
    alert('¡Mapa guardado! Puedes usar este archivo GeoJSON en otras aplicaciones.')
   

})
document.getElementById('load-button').addEventListener('click', function(){
    drawItems.clearLayers()
    cargarDatos(puntosDeInteres)
})
