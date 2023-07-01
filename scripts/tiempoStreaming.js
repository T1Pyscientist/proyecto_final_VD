d3.csv('resources/timeStreamMonth.csv').then(streamingData => {

    const data = streamingData.map(d => {
        d.Streams = (+d.Streams)/60000;
        d.Month = +d.Month - 1;
        return d
    })


    const plot = Plot.plot({
        marks: [
            Plot.lineY(data, 
                { x: "Month", y: "Streams", curve: 'natural'}
            ),
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


    d3.select('#msPlayed').append(() => plot)
})