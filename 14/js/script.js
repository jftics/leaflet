// Inicializamos el mapa centrado en La Paz
var map = L.map('map').setView([-16.489689, -68.119293], 13);
        
// Añadimos la capa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var controlContador = L.control({position:'topright'})
controlContador.onAdd= function(map){
    this._div = L.DomUtil.create('div', 'contador-clics')
    this.update(0)
    return this._div
}
controlContador.update= function(num){
    this._div.innerHTML = 'Clics en el mapa: ' + num; 
}
controlContador.addTo(map)

var contadorClics = 0
map.on('click', function(e){
    contadorClics++
    controlContador.update(contadorClics)

    console.log('Clic en el mapa en: ' + e.latlng.toString())
})

// Control para reiniciar contador
var controlReinicio = L.control({position: 'topright'})
controlReinicio.onAdd= function(map){
    var div = L.DomUtil.create('div', 'boton-destacado');
    div.innerHTML = 'Reiniciar contador';
    div.style.marginTop = '10px';

    L.DomEvent.disableClickPropagation(div)
    L.DomEvent.on(div,'click',function(e){
        contadorClics=0
        controlContador.update(contadorClics)
    })
    return div
}
controlReinicio.addTo(map)



var sitiosTuristicos = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "nombre": "Plaza Murillo",
                "categoria": "histórico",
                "descripcion": "Plaza principal de La Paz donde se encuentran la Catedral, el Palacio de Gobierno y el Congreso Nacional."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-68.133894, -16.495804]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "nombre": "Mirador Killi Killi",
                "categoria": "mirador",
                "descripcion": "Uno de los miradores más populares de La Paz, ofrece una vista panorámica de 360° de la ciudad."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-68.12099, -16.49398]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "nombre": "Valle de la Luna",
                "categoria": "natural",
                "descripcion": "Formaciones geológicas erosionadas que crean un paisaje similar a la luna, ubicado en la zona sur de la ciudad."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-68.09286, -16.56878]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "nombre": "Mercado de las Brujas",
                "categoria": "cultural",
                "descripcion": "Mercado tradicional donde se venden hierbas medicinales, amuletos y otros objetos relacionados con rituales andinos."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-68.13844, -16.49547]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "nombre": "Teleférico Amarillo",
                "categoria": "transporte",
                "descripcion": "Parte del moderno sistema de transporte por cable de La Paz, ofrece vistas espectaculares de la ciudad."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-68.11950, -16.50530]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "nombre": "Parque Urbano Central",
                "categoria": "natural",
                "descripcion": "El pulmón de la ciudad, con áreas verdes, senderos y espacios recreativos."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-68.12846, -16.50423]
            }
        }
    ]
};

function getColor(categoria){
    return categoria === 'histórico' ? '#e41a1c' :
           categoria === 'mirador' ? '#377eb8' :
           categoria === 'natural' ? '#4daf4a' :
           categoria === 'cultural' ? '#984ea3' :
           categoria === 'transporte' ? '#ff7f00' :
           '#999999';  // color por defecto
}
function estiloNormal(feature){
    return {
        radius: 8,
        fillColor: getColor(feature.properties.categoria),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }
}

function estiloHover(feature){
    return {
        radius: 12,
        fillColor: '#ffeb00',
        color: "#000",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.5
    };
}

// Variable para almacenar el sitio seleccionado actualmente
var sitioSeleccionado = null;

var capaSitios = L.geoJSON(sitiosTuristicos,{
    pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng,estiloNormal(feature))
    },
    onEachFeature: function(feature, layer){
        // Creamos contenido del popup
        var contenidoPopup = `
            <div class="info-panel">
                <div class="titulo-sitio">${feature.properties.nombre}</div>
                <div>${feature.properties.descripcion}</div>
                <button class="boton-destacado" id="btn-mas-info-${feature.properties.nombre.replace(/\s+/g, '-').toLowerCase()}">Más información</button>
            </div>
        `;
        layer.bindPopup(contenidoPopup)

        // Eventos para interactividad
        layer.on('mouseover', function(e) {
            this.setStyle(estiloHover(feature));
            this.openPopup();
        });
        layer.on('mouseout', function(e) {
            if(sitioSeleccionado !== this){
                this.setStyle(estiloNormal(feature));
                this.closePopup();
            }
            
        }); 
        
        layer.on('click',function(e){
            // Detenemos la propagación
            L.DomEvent.stopPropagation(e);
            
            // Resetear estilo del sitio seleccionado anteriormente
            if (sitioSeleccionado && sitioSeleccionado !== this) {
                sitioSeleccionado.setStyle(estiloNormal(sitioSeleccionado.feature));
            }

            // Actualizar el sitio seleccionado
            sitioSeleccionado = this;

            // Mostrar el panel de información
            panelInfo.update(feature.properties)
        })

        layer.on('popupopen', function(e){
            // Obtenemos el botón dentro del popup
            var botonMasInfo = document.getElementById(`btn-mas-info-${feature.properties.nombre.replace(/\s+/g, '-').toLowerCase()}`);
            // Añadimos evento al botón
            if (botonMasInfo) {
                botonMasInfo.addEventListener('click', function() {
                    alert(`Información adicional sobre ${feature.properties.nombre}: Este lugar es uno de los atractivos más visitados de La Paz. ¡Visítalo pronto!`);
                });
            }
        })
    }
    
}).addTo(map)


// Control personalizado para panel de información
var panelInfo = L.control({position: 'bottomleft'});
panelInfo.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info-panel');
    L.DomEvent.disableClickPropagation(this._div);
    return this._div;
}
panelInfo.update= function(props){
    this._div.innerHTML =  props ?
    `<h4>Detalles del sitio</h4>
        <b>${props.nombre}</b><br>
        Categoría: ${props.categoria}<br>
        ${props.descripcion}<br>
        <button class="boton-destacado" id="btn-ruta">Trazar ruta</button>`:
        'Seleccione un sitio para ver detalles'
    // Añadimos evento al botón de ruta si existe
    if (props) {
        setTimeout(function() {
            var botonRuta = document.getElementById('btn-ruta');
            if (botonRuta) {
                botonRuta.addEventListener('click', function() {
                    alert(`Trazando ruta hacia ${props.nombre}. Esta función estaría conectada a un servicio de rutas en una aplicación real.`);
                });
            }
        }, 100);
    }
}

panelInfo.addTo(map)
panelInfo.update()

// Control para mostrar una leyenda
var leyenda = L.control({position: 'bottomright'});
leyenda.onAdd = function(map){
    var div = L.DomUtil.create('div', 'leyenda');
    div.innerHTML = '<h4>Categorías</h4>';

    // Añadimos cada categoría con su color
    var categorias = ['histórico', 'mirador', 'natural', 'cultural', 'transporte'];

    for (var i = 0; i < categorias.length; i++) {
        div.innerHTML += 
            '<i style="background:' + getColor(categorias[i]) + '"></i> ' +
            categorias[i] + '<br>';
    }
    return div;
}
leyenda.addTo(map)


function actualizarEstiloSegunZoom(){
    var nivelZoom = map.getZoom();
    capaSitios.eachLayer(function(layer){
        // Ajustamos el tamaño según el nivel de zoom
        var radio = nivelZoom > 14 ? 12 : 
                   nivelZoom > 12 ? 8 : 5;

        layer.setStyle({
            radius: radio
        });
    })

}
// Evento para cuando cambia el zoom
map.on('zoomend', function() {
    actualizarEstiloSegunZoom();
    console.log('Nuevo nivel de zoom: ' + map.getZoom());
});

// Evento para cuando se mueve el mapa
map.on('moveend', function() {
    console.log('Centro del mapa: ' + map.getCenter().toString());
});

actualizarEstiloSegunZoom()