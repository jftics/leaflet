async function cargarGeoJSON(url){
    try{
        const respuesta = await fetch(url)
        if(!respuesta.ok){
            throw new Error(`Error al cargar ${url}: ${respuesta.statusText}`);
        }
        return await respuesta.json()
    }
    catch(error){
        console.error("Error cargando GeoJSON:", error);
        return null
    }
}

async function cargarDatos(){
    try{
        const [
            datosProvincias,
            datosDensidad,
            datosCarreteras,
            datosFerrocarriles,
            datosAeropuertos,
            datosRios,
            datosParques,
            datosReservasMarinas
        ] = await Promise.all([
            cargarGeoJSON('./data/provincias.geojson'),
            cargarGeoJSON('./data/densidad.geojson'),
            cargarGeoJSON('./data/carreteras.geojson'),
            cargarGeoJSON('./data/ferrocarriles.geojson'),
            cargarGeoJSON('./data/aeropuertos.geojson'),
            cargarGeoJSON('./data/rios.geojson'),
            cargarGeoJSON('./data/parques.geojson'),
            cargarGeoJSON('./data/reservasMarinas.geojson')

        ])

        inicializarMapa(datosProvincias,
            datosDensidad,
            datosCarreteras,
            datosFerrocarriles,
            datosAeropuertos,
            datosRios,
            datosParques,
            datosReservasMarinas)
    }
    catch(error){
        console.error("Error en la carga de datos:", error);
    }
}

document.addEventListener('DOMContentLoaded',cargarDatos)

function inicializarMapa(datosProvincias,
    datosDensidad,
    datosCarreteras,
    datosFerrocarriles,
    datosAeropuertos,
    datosRios,
    datosParques,
    datosReservasMarinas){

        // console.log(datosProvincias,
        //     datosDensidad,
        //     datosCarreteras,
        //     datosFerrocarriles,
        //     datosAeropuertos,
        //     datosRios,
        //     datosParques,
        //     datosReservasMarinas)

        const map = L.map('map').setView([-16.489689, -68.119293], 6)

        // Añadimos capas base
        const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });


        function getColorDensidad(d){
            return d > 100 ? '#800026' :
               d > 50  ? '#BD0026' :
               d > 20  ? '#E31A1C' :
               d > 10  ? '#FC4E2A' :
               d > 5   ? '#FD8D3C' :
               d > 2   ? '#FEB24C' :
               d > 1   ? '#FED976' :
                         '#FFEDA0';
        }
        function estiloDensidad(feature){
            return {
                fillColor:getColorDensidad(feature.properties.densidad),
                weight: 1,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            }
        }

        function getColorPoblacion(d){
            return d > 2000000 ? '#800026' :
               d > 1500000 ? '#BD0026' :
               d > 1000000 ? '#E31A1C' :
               d > 500000  ? '#FC4E2A' :
               d > 200000  ? '#FD8D3C' :
               d > 100000  ? '#FEB24C' :
               d > 50000   ? '#FED976' :
                             '#FFEDA0';
        }

        function estiloPoblacion(feature){
            return {
                fillColor: getColorPoblacion(feature.properties.poblacion),
                weight: 1,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

        function estiloCarreteras(feature) {
            return {
                color: feature.properties.tipo === 'principal' ? '#FF0000' : '#FFA500',
                weight: feature.properties.tipo === 'principal' ? 3 : 2,
                opacity: 0.8
            };
        }

        function estiloFerrocarriles(feature) {
            return {
                color: '#000000',
                weight: 2,
                opacity: 0.8,
                dashArray: '5, 5'
            };
        }
    
        function estiloAeropuertos(feature) {
            return {
                radius: 5,
                fillColor: '#3388ff',
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
        }
    
        function estiloRios(feature) {
            return {
                color: '#0000FF',
                weight: 1.5,
                opacity: 0.7
            };
        }
    
        function estiloParques(feature) {
            return {
                fillColor: '#00FF00',
                weight: 1,
                opacity: 1,
                color: '#006400',
                fillOpacity: 0.5
            };
        }
    
        function estiloReservas(feature) {
            return {
                fillColor: '#00FFFF',
                weight: 1,
                opacity: 1,
                color: '#008080',
                fillOpacity: 0.5
            };
        }

        const provinciasLayer = L.geoJSON(datosProvincias,{
            style: estiloPoblacion,
            onEachFeature: function(feature, layer){
                layer.bindPopup(`<b>${feature.properties.nombre}</b><br>Población: ${feature.properties.poblacion.toLocaleString()} habitantes<br>Área: ${feature.properties.area_km2.toLocaleString()} km²`)
            }
        })
        const densidadLayer = L.geoJSON(datosDensidad, {
            style: estiloDensidad,
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<b>${feature.properties.nombre}</b><br>Densidad: ${feature.properties.densidad} hab/km²`);
            }
        });
    
        const carreterasLayer = L.geoJSON(datosCarreteras, {
            style: estiloCarreteras,
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<b>${feature.properties.nombre}</b><br>Tipo: ${feature.properties.tipo}`);
            }
        });
    
        const ferrocarrilesLayer = L.geoJSON(datosFerrocarriles, {
            style: estiloFerrocarriles,
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<b>${feature.properties.nombre}</b>`);
            }
        });
    
        // Para los aeropuertos, usamos pointToLayer para crear marcadores
        const aeropuertosLayer = L.geoJSON(datosAeropuertos, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, estiloAeropuertos(feature));
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<b>${feature.properties.nombre}</b>`);
            }
        });
    
        const riosLayer = L.geoJSON(datosRios, {
            style: estiloRios,
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<b>${feature.properties.nombre}</b>`);
            }
        });
    
        const parquesLayer = L.geoJSON(datosParques, {
            style: estiloParques,
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<b>${feature.properties.nombre}</b><br>Área: ${feature.properties.area_km2.toLocaleString()} km²`);
            }
        });
    
        const reservasMariasLayer = L.geoJSON(datosReservasMarinas, {
            style: estiloReservas,
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<b>${feature.properties.nombre}</b><br>Área: ${feature.properties.area_km2.toLocaleString()} km²`);
            }
        });

    // Organización jerárquica de capas
    // Capas base (solo se puede seleccionar una a la vez)

    const baseMap = {
        "Open Street Map": osm,
        "Satelite": satellite
    }
    // Capas temáticas principales (grupos)
    const overlayMap = {
        "Demografía":{
            "Población": provinciasLayer,
            "Densidad": densidadLayer
        },
        "Infraestructuras":{
            "Carreteras": carreterasLayer,
            "Ferrocarriles": ferrocarrilesLayer,
            "Aeropuertos": aeropuertosLayer

        },
        "Medio Natural":{
            "Ríos": riosLayer,
            "Parques": parquesLayer,
            "Reservas": reservasMariasLayer
        }
    }

    const options = {
        //collapsed: false,
        exclusiveGroups:["Demografía"],
        groupCheckboxes:true
        
    }
    L.control.groupedLayers(baseMap, overlayMap, options).addTo(map)

    }