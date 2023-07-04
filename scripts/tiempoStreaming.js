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

window.addEventListener('DOMContentLoaded', async function () {
    toggleGraphAndText('resources/timeStreamMonth.csv', 'graph', 'Juan');
});


async function toggleGraphAndText(file, divId, name) {
    const graphDiv = document.getElementById(divId);
    const dynamicText = document.getElementById('dynamicText');
    const streamingText = document.getElementById('streamingText');
    const b1 = document.getElementsByClassName('graph-button1')[0];
    const b2 = document.getElementsByClassName('graph-button2')[0];

    // Cambiar color boton seleccionado
    if (name == 'Juan') {
        b1.style.backgroundColor = '#B9F5C1';
        b2.style.backgroundColor = '#ffffff';
    } else {
        b2.style.backgroundColor = '#f8907e91';
        b1.style.backgroundColor = '#ffffff';
    }


    // Si el gráfico ya existe, lo eliminamos y salimos de la función
    if (graphDiv.hasChildNodes()) {
        graphDiv.innerHTML = '';
        dynamicText.innerHTML = '';
        streamingText.style.display = 'none';
        // return;
    }

    // Calcular total de minutos
    const streamingData = await d3.csv(file);
    const totalmin = Math.floor(streamingData.reduce((acc, cur) => acc + (+cur.Streams), 0) / 60000);

    // Si el gráfico no existe, lo creamos
    showGraphAndText(file, divId, name, totalmin);
}

function showGraphAndText(file, divId, name, totalmin) {
    // Aquí reemplazas [insertar número de horas] y [insertar número de días] por los valores que correspondan
    const text = `Comenzando con una sorpresa reveladora, el tiempo escuchado en Spotify durante este año fue de ${totalmin} minutos. Esto es equivalente a ${(totalmin/(60*24)).toFixed(2)} días de música. Sin embargo, varía mucho de un mes a otro, como se muestra en la gráfica de ${name} a continuación.`;

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