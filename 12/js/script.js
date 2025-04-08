async function cargarGeoJSON(url) {
    try {
        const respuesta = await fetch(url)
        if (!respuesta.ok) {
            throw new Error(`Error al cargar ${url}: ${respuesta.statusText}`);
        }
        return await respuesta.json()
    }
    catch (error) {
        console.error("Error cargando GeoJSON:", error);
        return null
    }
}

function verificarLayer(layerCargar, estilo, url, propiedades){
    if(!layerCargar.load){
        mostrarCargando()
        cargarGeoJSON(url).then(datos=>{
            if(datos){
                layerCargar.addData(datos)
                layerCargar.eachLayer(function(layer){
                    var msgPopup=""
                    propiedades.forEach(function(prop){
                        if(prop.titulo == "Titulo"){
                            msgPopup = `<b>${layer.feature.properties[prop.propiedad]}</b><br>` + msgPopup
                        }
                        else{
                            msgPopup += `${prop.titulo}: ${layer.feature.properties[prop.propiedad]}<br>`
                        }
                        console.log("...",prop)
                    })
                    layer.bindPopup(msgPopup)
                    //layer.bindPopup(`<b>${layer.feature.properties.nombre}</b><br>Población: ${layer.feature.properties.poblacion.toLocaleString()} habitantes<br>Área: ${layer.feature.properties.area_km2.toLocaleString()} km²`)
                })
                layerCargar.setStyle(estilo)
                console.log('Capa de provincias cargada bajo demanda')
                layerCargar.load = true
                ocultarCargando()
            }
        })
    }
    
}

const map = L.map('map').setView([-16.489689, -68.119293], 11)

// Añadimos capas base
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});


function getColorDensidad(d) {
    return d > 100 ? '#800026' :
        d > 50 ? '#BD0026' :
            d > 20 ? '#E31A1C' :
                d > 10 ? '#FC4E2A' :
                    d > 5 ? '#FD8D3C' :
                        d > 2 ? '#FEB24C' :
                            d > 1 ? '#FED976' :
                                '#FFEDA0';
}
function estiloDensidad(feature) {
    return {
        fillColor: getColorDensidad(feature.properties.densidad),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    }
}
function getColorPoblacion(d) {
    return d > 2000000 ? '#800026' :
        d > 1500000 ? '#BD0026' :
            d > 1000000 ? '#E31A1C' :
                d > 500000 ? '#FC4E2A' :
                    d > 200000 ? '#FD8D3C' :
                        d > 100000 ? '#FEB24C' :
                            d > 50000 ? '#FED976' :
                                '#FFEDA0';
}
function estiloPoblacion(feature) {
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

// Creamos capas vacías como placeholders - CLAVE PARA LAZY LOADING
const provinciasLayer = L.geoJSON(null)
const densidadLayer = L.geoJSON(null);
const carreterasLayer = L.geoJSON(null);
const ferrocarrilesLayer = L.geoJSON(null);
const aeropuertosLayer = L.geoJSON(null);
const riosLayer = L.geoJSON(null);
const parquesLayer = L.geoJSON(null);
const reservasMariasLayer = L.geoJSON(null);

// Organizamos nuestras capas base y capas de superposición
const baseMap = {
    'OSM':osm,
    'Satelite': satellite
}

const overlayMap = {
    "Demografía":{
        "Población": provinciasLayer,
        "Densidad": densidadLayer
    },
    "Infraestructuras": {
        "Carreteras": carreterasLayer,
        "Ferrocarriles": ferrocarrilesLayer,
        "Aeropuertos": aeropuertosLayer
    },
    "Medio Natural": {
        "Ríos": riosLayer,
        "Parques": parquesLayer,
        "Reservas": reservasMariasLayer
    }
}

var controlLayer = L.control.groupedLayers(baseMap,overlayMap,{
    exclusiveGroups:["Demografía"],
    groupCheckboxes:true
}).addTo(map)


// CLAVE DEL LAZY LOADING: Añadimos un detector de eventos para cuando se activa una capa
map.on('overlayadd', function(e){
    // Detectamos qué capa se activó
    console.log(e.name)
    const nombreCapa =  e.name
    if(nombreCapa == 'Población'){
        verificarLayer(provinciasLayer, estiloPoblacion, './data/provincias.geojson', [{"titulo":"Titulo", "propiedad":"nombre"},{"titulo":"Población", "propiedad":"poblacion"},{"titulo":"Área", "propiedad":"area_km2"}])
    }else if(nombreCapa == 'Densidad'){
        verificarLayer(densidadLayer, estiloDensidad, './data/densidad.geojson', [{"titulo":"Titulo", "propiedad":"nombre"},{"titulo":"Densidad", "propiedad":"densidad"}])
    }else if (nombreCapa === 'Carreteras'){
        verificarLayer(carreterasLayer, estiloCarreteras, './data/carreteras.geojson',[{'titulo':'Titulo','propiedad':'nombre'},{'titulo':'Tipo','propiedad':'tipo'}])
    }else if (nombreCapa === 'Ferrocarriles'){
        verificarLayer(ferrocarrilesLayer, estiloFerrocarriles, './data/ferrocarriles.geojson',[{'titulo':'Titulo','propiedad':'nombre'},{'titulo':'Estado','propiedad':'estado'}])
    }else if (nombreCapa === 'Aeropuertos'){
        verificarLayer(aeropuertosLayer, estiloAeropuertos, './data/aeropuertos.geojson',[{'titulo':'Titulo','propiedad':'nombre'},{'titulo':'Tipo','propiedad':'tipo'}])
    }else if (nombreCapa === 'Ríos'){
        verificarLayer(riosLayer, estiloRios, './data/rios.geojson',[{'titulo':'Titulo','propiedad':'nombre'},{'titulo':'caudal','propiedad':'caudal'}])
    }else if (nombreCapa === 'Parques'){
        verificarLayer(parquesLayer, estiloParques, './data/parques.geojson',[{'titulo':'Titulo','propiedad':'nombre'},{'titulo':'Tipo','propiedad':'tipo'}])
    }else if (nombreCapa === 'Reservas'){
        verificarLayer(reservasMariasLayer, estiloReservas, './data/reservasMarinas.geojson',[{'titulo':'Titulo','propiedad':'nombre'},{'titulo':'Tipo','propiedad':'tipo'}])
    }
})

function mostrarCargando(){
    const loading = document.getElementById('loading-indicator')
    loading.style.display = 'block'
}
function ocultarCargando(){
    const loading = document.getElementById('loading-indicator')
    loading.style.display = 'none'
}