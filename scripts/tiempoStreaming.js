// d3.csv('resources/timeStreamMonth.csv').then(streamingData => {

//     const data = streamingData.map(d => {
//         d.Streams = (+d.Streams) / 60000;
//         d.Month = +d.Month - 1;
//         return d
//     })


//     const plot = Plot.plot({
//         marks: [
//             Plot.lineY(data, { x: "Month", y: "Streams", curve: 'natural' }),
//         ],
//         x: {
//             axis: "bottom",
//             label: "Mes",
//             tickFormat: Plot.formatMonth("es-MX", "short"),
//             ticks: 12,
//             labelOffset: 50,
//         },
//         y: {
//             axis: "left",
//             label: "Minutos",
//             domain: [0, 1800],
//             grid: true,
//             ticks: 3
//         },
//         style: {
//             fontFamily: "Circular, sans-serif",
//             fontSize: "1rem"
//         },


//         margin: 60,
//         insetLeft: 40,
//         width: 800,
//     });


//     d3.select('#msPlayed').append(() => plot)
// })

// d3.csv('resources/timeStreamMonth.csv').then(streamingData => {

//     const data = streamingData.map(d => {
//         d.Streams = (+d.Streams) / 60000;
//         d.Month = +d.Month - 1;
//         return d
//     })


//     const plot = Plot.plot({
//         marks: [
//             Plot.lineY(data, { x: "Month", y: "Streams", curve: 'natural' }),
//         ],
//         x: {
//             axis: "bottom",
//             label: "Mes",
//             tickFormat: Plot.formatMonth("es-MX", "short"),
//             ticks: 12,
//             labelOffset: 50,
//         },
//         y: {
//             axis: "left",
//             label: "Minutos",
//             domain: [0, 1800],
//             grid: true,
//             ticks: 3
//         },
//         style: {
//             fontFamily: "Circular, sans-serif",
//             fontSize: "1rem"
//         },


//         margin: 60,
//         insetLeft: 40,
//         width: 800,
//     });


//     d3.select('#msPlayed2').append(() => plot)
// })

// function showGraph(groupId) {
//     var selectedGroup = document.getElementById(groupId);

//     if (selectedGroup.classList.contains('hide')) {
//         // If the selected group is hidden, show it and hide all others
//         var groups = document.getElementsByClassName('graph-group');
//         for (var i = 0; i < groups.length; i++) {
//             groups[i].classList.add('hide');
//         }
//         selectedGroup.classList.remove('hide');
//     } else {
//         // If the selected group is already visible, hide it
//         selectedGroup.classList.add('hide');
//     }
// }

//-------------//

function toggleGraphAndText(file, divId, name, totalmin) {
    const graphDiv = document.getElementById(divId);
    const dynamicText = document.getElementById('dynamicText');
    const streamingText = document.getElementById('streamingText');

    // Si el gráfico ya existe, lo eliminamos y salimos de la función
    if (graphDiv.hasChildNodes()) {
        graphDiv.innerHTML = '';
        dynamicText.innerHTML = '';
        streamingText.style.display = 'none';
        return;
    }

    // Si el gráfico no existe, lo creamos
    showGraphAndText(file, divId, name, totalmin);
}

function showGraphAndText(file, divId, name, totalmin) {
    // Aquí reemplazas [insertar número de horas] y [insertar número de días] por los valores que correspondan
    const text = `Comenzando con una sorpresa reveladora, el tiempo escuchado en Spotify durante este año fue de ${totalmin}. Esto es equivalente a [insertar número de días] días de música. Sin embargo, varía mucho de un mes a otro, como se muestra en la gráfica de ${name} a continuación.`;

    document.getElementById('dynamicText').innerHTML = text;

    // Muestra el texto "Minutos de streaming por mes"
    document.getElementById('streamingText').style.display = 'block';

    // Luego, llamas a la función que dibuja el gráfico
    plotData(file, divId);
}


function plotData(csvFile, graphId) {
    d3.csv(csvFile).then(streamingData => {
        const data = streamingData.map(d => {
            d.Streams = (+d.Streams) / 60000;
            d.Month = +d.Month - 1;
            return d
        });

        const plot = Plot.plot({
            marks: [
                Plot.lineY(data, { x: "Month", y: "Streams", curve: 'natural' }),
            ],
            x: {
                axis: "bottom",
                label: "Mes",
                tickFormat: Plot.formatMonth("es-MX", "short"),
                ticks: 12,
                labelOffset: 50,
            },
            y: {
                axis: "left",
                label: "Minutos",
                domain: [0, 1800],
                grid: true,
                ticks: 3
            },
            style: {
                fontFamily: "Circular, sans-serif",
                fontSize: "1rem"
            },
            margin: 60,
            insetLeft: 40,
            width: 800,
        });


        // Clear any existing plots in the graph div before appending a new one
        d3.select('#' + graphId).html('');
        d3.select('#' + graphId).append(() => plot);
    });
}