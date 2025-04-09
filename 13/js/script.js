const map = L.map('map').setView([-16.489689, -68.119293], 11)

// Añadimos capas base
const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Nuevo control

var CenterControl = L.Control.extend({
    options:{
        position: 'topleft'
    },
    onAdd: function(map){
        var container = L.DomUtil.create('div','')
        
        container.style.backgroundColor = 'white'
        container.style.widht = '30px'
        container.style.height = '30px'
        container.innerHTML = '<span style ="font-size: 20px; line-height: 30px; text-align: center; display: block;">🏳‍🌈</span>'

        L.DomEvent.disableClickPropagation(container)

        container.onclick = function(){
            map.setView([-16.489689, -68.119293], 18)
        }

        return container
    }
})

map.addControl(new CenterControl())

var StyleToogleControl = L.Control.extend({
    options:{position:'bottomleft'},
    onAdd : function(map){
        var container = L.DomUtil.create('div','control-custom')
        container.title = 'Cambiar estilo de mapa'

        var button = L.DomUtil.create('a','style-button', container)
        button.innerHTML = '🎨'
        button.href = '#';
        button.style.fontSize = '18px';
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.lineHeight = '30px';
        button.style.textAlign = 'center';
        button.style.display = 'block';

        L.DomEvent.disableClickPropagation(container);

        var isStyleA = false;
        L.DomEvent.on(button, 'click', function(e){
            L.DomEvent.stop(e)
            if(isStyleA){
                //cambiar al estilo B
                baseLayer.setUrl('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
            }
            else{
                // Cambiar a estilo A
                baseLayer.setUrl('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png');
            }
            isStyleA = !isStyleA // Invertir el estado
        })

        return container;
    }
    
})

map.addControl(new StyleToogleControl())

var ToolBoxControl = L.Control.extend({
    options:{position:'topright'},
    onAdd:function(map){
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control')
        container.className += ' card'
        container.style.padding = '10px';
        container.style.background = 'white';
        container.style.width = '200px';

        var title = L.DomUtil.create('h6','card-title', container)
        title.innerHTML = 'Herramientas del mapa'


        var buttonGroup = L.DomUtil.create('div','btn-group w-100', container)

        // Botón de localización
        var locateBtn = this._createButton('btn-outline-primary','fa-solid fa-location-dot','Ir a mi ubicación', buttonGroup) 
        // Botón de medición
        var measureBtn = this._createButton('btn-outline-success', 'fa-solid fa-ruler', 'Medir distancia', buttonGroup);
        // Botón de captura
        var screenshotBtn = this._createButton('btn-outline-info', 'fa-solid fa-camera', 'Capturar mapa', buttonGroup);
        
        L.DomEvent.on(locateBtn,'click',function(e){
            map.locate({setView: true, maxZoom: 16})
        })
        L.DomEvent.on(measureBtn, 'click', function() {
            alert('Función de medición activada. Haz clic en el mapa para comenzar a medir.');
            // Aquí iría el código para activar la herramienta de medición
        });
        L.DomEvent.on(screenshotBtn, 'click', function() {
            alert('Captura de pantalla del mapa generada');
            // Aquí iría el código para capturar el mapa
        });

        L.DomEvent.disableClickPropagation(container);
        return container
    },

    _createButton: function(btnClass, iconClass, title, container){
        var btn = L.DomUtil.create('button', 'btn ' + btnClass, container)
        btn.type = 'button';
        btn.title = title;

        var icon = L.DomUtil.create('i', iconClass, btn)
        return btn
    }

})

map.addControl(new ToolBoxControl())