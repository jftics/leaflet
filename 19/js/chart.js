// Función para inicializar todos los gráficos

function initCharts(){
    createPopulationChart()
    createElevationChart()
}

function createPopulationChart(){
    // Datos simulados de población por distrito
    const districts = ['Cotahuma', 'Max Paredes', 'Periférica', 'San Antonio', 'Sur', 'Mallasa'];
    const populations = [153655, 164566, 159123, 115328, 127228, 5082];
    
    // Obtener el contexto del canvas
    const ctx = document.getElementById('population-canvas').getContext('2d');

    // Crear el gráfico de barras
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: districts,
            datasets: [{
                label: 'Población',
                data: populations,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2, // Configura la relación ancho/alto deseada
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Habitantes'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' habitantes';
                        }
                    }
                }
            }
        }
    });
    
}

function createElevationChart(){
    // Datos simulados de elevación a lo largo de un recorrido
    const distances = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const elevations = [3640, 3680, 3720, 3750, 3790, 3820, 3800, 3770, 3730, 3690, 3650];

    // Obtener el contexto del canvas
    const ctx = document.getElementById('elevation-canvas').getContext('2d');
    
    // Crear el gráfico de línea
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: distances,
            datasets: [{
                label: 'Elevación',
                data: elevations,
                fill: {
                    target: 'origin',
                    above: 'rgba(75, 192, 192, 0.2)',
                },
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2, // Configura la relación ancho/alto deseada
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Distancia (km)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Elevación (msnm)'
                    }
                }
            }
        }
    });
    
}