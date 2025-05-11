// Variables globales
let map;
let currentSection = 'overview';
let layers = {};
let analysisLayer = null;
let analysisPanelControl = null

// Datos geográficos para La Paz, Bolivia
const LA_PAZ_CENTER = [-16.495, -68.1336]; // Coordenadas centro de La Paz
const ZOOM_LEVEL = 13;

document.addEventListener('DOMContentLoaded', function () {
    // Inicializar mapa
    initMap();

    // Cargar datos GeoJSON
    loadGeoData();

    createAnalysisPanel()

    // Configurar eventos UI
    setupUIEvents();

    // Inicializar gráficos
    initCharts();

    // Mostrar la sección inicial
    showSection('overview')
})

// Función para inicializar el mapa de Leaflet
function initMap() {
    map = L.map('map', {
        center: LA_PAZ_CENTER,
        zoom: ZOOM_LEVEL,
        zoomControl: false  // Desactivamos el control de zoom predeterminado para usar uno personalizado
    })

    // Añadir control de zoom en la esquina inferior derecha
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map)

    // Añadir escala
    L.control.scale({
        imperial: false,
        position: 'bottomleft'
    }).addTo(map);


    // Capa base - OpenStreetMap
    layers.baseOSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Capa base - Satelital (ESRI)
    layers.baseSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19
    });

    // Capa base - Topográfica
    layers.baseTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
        maxZoom: 17
    });
}

function loadGeoData() {
    // Simulamos la carga de datos - en un caso real cargaríamos archivos externos
    // Distritos de La Paz (simplificado para este ejemplo)
    const districtsData = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "name": "Cotahuma",
                    "population": 153655,
                    "area": 16.0,
                    "density": 9603
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [-68.15, -16.47],
                        [-68.15, -16.52],
                        [-68.12, -16.52],
                        [-68.12, -16.47],
                        [-68.15, -16.47]
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Max Paredes",
                    "population": 164566,
                    "area": 13.5,
                    "density": 12190
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [-68.12, -16.47],
                        [-68.12, -16.52],
                        [-68.09, -16.52],
                        [-68.09, -16.47],
                        [-68.12, -16.47]
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Periférica",
                    "population": 159123,
                    "area": 14.2,
                    "density": 11206
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [-68.09, -16.47],
                        [-68.09, -16.52],
                        [-68.06, -16.52],
                        [-68.06, -16.47],
                        [-68.09, -16.47]
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "San Antonio",
                    "population": 115328,
                    "area": 12.8,
                    "density": 9010
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [-68.15, -16.52],
                        [-68.15, -16.55],
                        [-68.12, -16.55],
                        [-68.12, -16.52],
                        [-68.15, -16.52]
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Sur",
                    "population": 127228,
                    "area": 15.5,
                    "density": 8208
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [-68.12, -16.52],
                        [-68.12, -16.55],
                        [-68.09, -16.55],
                        [-68.09, -16.52],
                        [-68.12, -16.52]
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Mallasa",
                    "population": 5082,
                    "area": 27.9,
                    "density": 182
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [-68.09, -16.52],
                        [-68.09, -16.55],
                        [-68.06, -16.55],
                        [-68.06, -16.52],
                        [-68.09, -16.52]
                    ]]
                }
            }
        ]
    };

    // Puntos de interés turístico
    const poiData = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "name": "Plaza Murillo",
                    "type": "Plaza",
                    "description": "Plaza principal y centro histórico de La Paz",
                    "visits": 12500
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [-68.1336, -16.495]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Mirador Killi Killi",
                    "type": "Mirador",
                    "description": "Mirador con vistas panorámicas de La Paz",
                    "visits": 8700
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [-68.1186, -16.4871]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Valle de la Luna",
                    "type": "Atracción Natural",
                    "description": "Formaciones rocosas erosionadas parecidas a la superficie lunar",
                    "visits": 15800
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [-68.0691, -16.5676]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Teleférico Amarillo",
                    "type": "Transporte",
                    "description": "Estación principal del teleférico urbano",
                    "visits": 22300
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [-68.1205, -16.4990]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Mercado de las Brujas",
                    "type": "Comercio",
                    "description": "Mercado tradicional con artículos místicos",
                    "visits": 18200
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [-68.1367, -16.4958]
                }
            }
        ]
    };

    // Rutas principales
    const roadsData = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "name": "Avenida 16 de Julio (El Prado)",
                    "type": "Avenida Principal",
                    "traffic": "Alto"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [-68.1336, -16.495],
                        [-68.1336, -16.510]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Avenida Camacho",
                    "type": "Avenida Principal",
                    "traffic": "Alto"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [-68.1336, -16.495],
                        [-68.120, -16.495]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Avenida Illimani",
                    "type": "Avenida Principal",
                    "traffic": "Medio"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [-68.1200, -16.500],
                        [-68.1200, -16.520]
                    ]
                }
            }
        ]
    };


    // Crear y añadir capas al mapa
    layers.districts = L.geoJSON(districtsData, {
        style: function (feature) {
            return {
                fillColor: getColorByDensity(feature.properties.density),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(createDistrictPopup(feature.properties))
        }
    })
    layers.pois = L.geoJSON(poiData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            console.log(feature.properties)
            layer.bindPopup(createPOIPopup(feature.properties))
        }
    })
    layers.roads = L.geoJSON(roadsData, {
        style: function (feature) {
            return {
                color: getColorByTraffic(feature.properties.traffic),
                weight: 5,
                opacity: 0.7
            };
        },
    })

    // Crear control de capas
    createCustomLayerControl()
}

// Función para crear control de capas personalizado
function createCustomLayerControl() {
    // Organizamos nuestras capas base y capas de superposición
    const baseMap = {
        "Open Street Map": layers.baseOSM,
        "Satelite": layers.baseSatellite,
        "Topográfica": layers.baseTopo
    }

    // Capas temáticas principales (grupos)
    const overlayMap = {
        "Mapas Témáticos": {
            "Distrito": layers.districts,
            "Turismo": layers.pois,
            "Caminos": layers.roads
        }
    }
    const layerControl = L.control.groupedLayers(baseMap, overlayMap, {}).addTo(map)
}

// Función para crear popups de distritos
function createDistrictPopup(properties) {
    return `
        <div class="custom-popup">
            <h4>${properties.name}</h4>
            <p><strong>Población:</strong> ${properties.population.toLocaleString()} hab.</p>
            <p><strong>Área:</strong> ${properties.area} km²</p>
            <p><strong>Densidad:</strong> ${properties.density} hab./km²</p>
        </div>
    `
}

// Función para crear popups de puntos de interés
function createPOIPopup(properties) {
    return `
    <div class="custom-popup">
        <h4>${properties.name}</h4>
        <p><strong>Tipo:</strong> ${properties.type}</p>
        <p>${properties.description}</p>
        <p><strong>Visitas anuales:</strong> ${properties.visits.toLocaleString()}</p>
    </div>
`
}

function getColorByDensity(density) {
    return density > 10000 ? '#800026' :
        density > 8000 ? '#BD0026' :
            density > 6000 ? '#E31A1C' :
                density > 4000 ? '#FC4E2A' :
                    density > 2000 ? '#FD8D3C' :
                        density > 1000 ? '#FEB24C' :
                            density > 500 ? '#FED976' :
                                '#FFEDA0';
}
function getColorByTraffic(traffic) {
    return traffic === 'Alto' ? '#FF0000' :
        traffic === 'Medio' ? '#FFA500' :
            '#008000'
}


function setupUIEvents() {
    // Eventos para los elementos de navegación
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    })
}

// Función para mostrar secciones
function showSection(section) {
    // Actualizar sección actual
    currentSection = section;

    // Actualizar clases activas en navegación
    const navLinks = document.querySelectorAll('.sidebar nav ul li');
    navLinks.forEach(li => {
        if (li.querySelector('a').getAttribute('data-section') === section) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    });

    // Configurar el mapa según la sección
    configureSectionView();
}

// Configurar vista del mapa según la sección activa
function configureSectionView() {
    // Primero, eliminar todas las capas superpuestas
    if (map.hasLayer(layers.districts)) map.removeLayer(layers.districts)
    if (map.hasLayer(layers.pois)) map.removeLayer(layers.pois);
    if (map.hasLayer(layers.roads)) map.removeLayer(layers.roads);

    map.removeControl(analysisPanelControl)
    // Eliminar capa de análisis anterior si existe
    if (analysisLayer && map.hasLayer(analysisLayer)) {
        map.removeLayer(analysisLayer);
    }

    // Configurar según la sección
    switch (currentSection) {
        case "overview":
            // En la vista general, mostrar todas las capas
            map.addLayer(layers.districts)
            map.addLayer(layers.pois);
            map.addLayer(layers.roads);
            map.setView(LA_PAZ_CENTER, ZOOM_LEVEL)
            break;
        case "districts":
            // En la sección de distritos, solo mostrar esa capa 
            map.addLayer(layers.districts)
            map.setView(LA_PAZ_CENTER, ZOOM_LEVEL)
            break;
        case 'transport':
            // En la sección de transporte, mostrar vías
            map.addLayer(layers.roads);
            map.setView(LA_PAZ_CENTER, ZOOM_LEVEL);
            break;
        case 'tourism':
            // En la sección de turismo, mostrar puntos de interés
            map.addLayer(layers.pois);
            map.setView([-16.495, -68.1336], ZOOM_LEVEL + 1);
            break;
        case "analysis":
            map.setView([-16.495, -68.1336], ZOOM_LEVEL + 1);
            analysisPanelControl.addTo(map)
            break;
    }

}


function createAnalysisPanel(){
    analysisPanelControl = L.control({position: 'bottomleft'})
    analysisPanelControl.onAdd= function(){
        const div = L.DomUtil.create('div', '')

        div.innerHTML = `
            <section class="analysis-panel">
                <h2>Análisis espacial</h2>
                <div class="analysis-controls">
                    <select id="analysis-type">
                        <option value="density">Densidad poblacional</option>
                        <option value="buffer">Zonas de influencia</option>
                        <option value="heatmap">Mapa de calor</option>
                    </select>
                    <button id="run-analysis" onclick="runSpatialAnalysis()">Ejecutar análisis</button>
                </div>
                <div id="analysis-result"></div>
            </section>
        `
        return div
    }

    analysisPanelControl.addTo(map)
}

function runSpatialAnalysis(){
    const analysisType = document.getElementById('analysis-type').value
    const resultContainer = document.getElementById('analysis-result')

    // Limpiar resultados anteriores
    resultContainer.innerHTML="<p>Procesando análisis...</p>"

    // Eliminar capa de análisis anterior si existe
    if(analysisLayer && map.hasLayer(analysisLayer)){
        map.removeLayer(analysisLayer)
    }

    // Realizar el análisis según el tipo seleccionado
    switch(analysisType){
        case "density":
            performDensityAnalysis(resultContainer)
            break;
        case "buffer":
            performBufferAnalysis(resultContainer)
            break;
        case "heatmap":
            performHeatmapAnalysis(resultContainer)
            break;
    }
}

// Análisis de densidad poblacional
function performDensityAnalysis(resultContainer){
    // Obtener datos de los distritos
    const districtsData = layers.districts.toGeoJSON()

    // Calcular estadísticas básicas
    let totalPopulation = 0;
    let totalArea = 0;
    let maxDensity = 0;
    let minDensity = Infinity;
    let maxDensityDistrict = '';
    let minDensityDistrict = '';

    districtsData.features.forEach(feature=>{
        const props = feature.properties
        totalPopulation += props.population
        totalArea+= props.area

        if(props.density > maxDensity){
            maxDensity = props.density
            maxDensityDistrict = props.name
        }

        if(props.density < minDensity){
            minDensity = props.density
            minDensityDistrict = props.name
        }
    })

    const averageDensity = totalPopulation/totalArea

    // Mostrar resultados
    resultContainer.innerHTML = `
         <h4>Análisis de Densidad Poblacional</h4>
        <p>Población total: ${totalPopulation.toLocaleString()} habitantes</p>
        <p>Área total: ${totalArea.toFixed(1)} km²</p>
        <p>Densidad promedio: ${averageDensity.toFixed(1)} hab/km²</p>
        <p>Distrito más denso: ${maxDensityDistrict} (${maxDensity.toLocaleString()} hab/km²)</p>
        <p>Distrito menos denso: ${minDensityDistrict} (${minDensity.toLocaleString()} hab/km²)</p>
    `
    // Crear capa de análisis (coropleta)
    analysisLayer = L.geoJSON(districtsData, {
        style: function(feature) {
            return {
                fillColor: getColorByDensity(feature.properties.density),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(createDistrictPopup(feature.properties));
        }
    }).addTo(map)

    if(map.legend){
        map.removeControl(map.legend)
    }

    map.legend = L.control({position: 'bottomright'})
    map.legend.onAdd = function(){
        const div = L.DomUtil.create('div', 'info legend')
        const grades = [0, 500, 1000, 2000, 4000, 6000, 8000, 10000]
        div.innerHTML="<h4>Densidad (hab/km²)</h4>"

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="display: inline-block; width: 20px; height: 20px;background:' + getColorByDensity(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div
    }

    map.legend.addTo(map)
}

// Análisis de áreas de influencia (buffer)
function performBufferAnalysis(resultContainer){
    // Obtener puntos de interés
    const poisData = layers.pois.toGeoJSON()

    // Crear buffers alrededor de los puntos
    const buffers = []
    const bufferDistance = 0.5 // 500 metros en km

    poisData.features.forEach(feature =>{
        const point = feature.geometry
        const buffered = turf.buffer(point, bufferDistance, {units: 'kilometers'})

        // Añadir propiedades del POI al buffer
        buffered.properties =  feature.properties
        buffers.push(buffered)
    })

    // Crear capa de análisis con los buffers
    analysisLayer= L.geoJSON(buffers, {
        style: function() {
            return {
                fillColor: '#3388ff',
                weight: 2,
                opacity: 0.5,
                color: '#3388ff',
                fillOpacity: 0.3
            };
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(`
                <div class="custom-popup">
                    <h4>Área de influencia</h4>
                    <p><strong>Punto:</strong> ${feature.properties.name}</p>
                    <p><strong>Radio:</strong> 500 metros</p>
                </div>
                `)
        }
    }).addTo(map)

    // Añadir también los puntos
    L.geoJSON(poisData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 5,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    }).addTo(analysisLayer)

    // Mostrar resultados
    resultContainer.innerHTML=`
        <h4>Análisis de Áreas de Influencia</h4>
        <p>Se han generado áreas de influencia de 500 metros alrededor de ${poisData.features.length} puntos de interés.</p>
        <p>Las áreas de influencia permiten identificar la cobertura de servicios y atracciones turísticas en La Paz.</p>
        <p>Haga clic en las áreas coloreadas para ver detalles de cada zona de influencia.</p>
    `
    // Crear leyenda para el mapa de calor
    if (map.legend) {
        map.removeControl(map.legend);
    }
}

// Simulación de análisis de mapa de calor
function performHeatmapAnalysis(resultContainer){
    // Obtener datos de puntos de interés
    const poisData = layers.pois.toGeoJSON()

    // Preparar datos para el mapa de calor
    const heatData = []

    poisData.features.forEach(feature=>{
        const coords =  feature.geometry.coordinates
        const intensity = feature.properties.visits / 1000 // Normalizar por intensidad de visitas

        heatData.push([coords[1],coords[0], intensity])
    })

    // Crear mapa de calor
    analysisLayer = L.heatLayer(heatData,{
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'}

    }).addTo(map)

    // Mostrar resultados

    resultContainer.innerHTML= `
        <h4>Análisis de Concentración Turística (Mapa de Calor)</h4>
        <p>El mapa de calor muestra la concentración de visitantes en diferentes puntos de interés de La Paz.</p>
        <p>Las áreas en rojo indican mayor concentración de turistas, mientras que las áreas en azul representan menor afluencia.</p>
        <p>Este análisis ayuda a identificar los puntos más visitados y planificar mejor los servicios turísticos.</p>
    `
     // Crear leyenda para el mapa de calor
     if(map.legend){
        map.removeControl(map.legend)
     }
    map.legend = L.control({position: 'bottomright'})
    map.legend.onAdd= function(){
        const div = L.DomUtil.create('div', 'info legend')
        div.innerHTML=`
            <h4>Intensidad de visitas</h4>
            <div style="background: linear-gradient(to right, blue, lime, red); height: 20px; width: 100%;"></div>
            <div style="display: flex; justify-content: space-between;">
                <span>Baja</span>
                <span>Media</span>
                <span>Alta</span>
            </div>

        `
        return div
    }

    map.legend.addTo(map)
}



