d3.json("resources/top_artists_month.json").then (data =>{

    const agosto = data['8/2022'];
    let artistas_agosto = [];

    for(var artista in agosto){
        artistas_agosto.push({artista: artista, streams: agosto[artista]});
    }

    artistas_agosto = artistas_agosto.sort((a, b) => b.streams - a.streams).slice(0, 5);
    
    const plot1 = Plot.plot({
        marks: [
            Plot.barY(artistas_agosto, {x: "artista", y: "streams", sort: { x: 'y', reverse: true }, fill: '#e52a29'}),
            Plot.axisX({ label: null, lineWidth: 7 }),
        ],
        y: {
            axis: "left",
            label: "Cant. de reproducciones",
            ticks: 5
        },
        style: {
            fontFamily: "Circular, sans-serif",
            fontSize: "15px",
        },

        inset: 20,
        width: 500,
        height: 300,
    });


    let dua_months = [];

    for (var month in data){

        if(month.slice(2) != '2023') {
            let streams = +data[month]['Dua Lipa'];
            if (!streams){
                streams = 0;
            }
            dua_months.push({month: +month.split("/")[0]-1, streams: streams});
        }
    }

    const plot2 = Plot.plot({
        marks: [
            Plot.line(dua_months, {x: "month", y: "streams", curve: 'natural'}),
        ],
        x: {
            axis: "bottom",
            label: "Mes",
            tickFormat: Plot.formatMonth("es-MX", "short"),
            ticks: 7,
            labelOffset: 50,
        },
        y: {
            axis: "left",
            label: "Cant. de reproducciones",
            ticks: 5
        },
        style: {
            fontFamily: "Circular, sans-serif",
            fontSize: "15px",
        },

        width: 500,
        height: 300,
        inset: 20
    });


    let coldplay_months = [];

    for (var month in data){

        if(month.slice(2) != '2023') {
            let streams = +data[month]['Coldplay'];
            if (!streams){
                streams = 0;
            }
            coldplay_months.push({month: +month.split("/")[0]-1, streams: streams});
        }
    }

    const plot3 = Plot.plot({
        marks: [
            Plot.line(coldplay_months, {x: "month", y: "streams", curve: 'natural'}),
        ],
        x: {
            axis: "bottom",
            label: "Mes",
            tickFormat: Plot.formatMonth("es-MX", "short"),
            ticks: 7,
            labelOffset: 50,
        },
        y: {
            axis: "left",
            label: "Cant. de reproducciones",
            ticks: 5
        },
        style: {
            fontFamily: "Circular, sans-serif",
            fontSize: "15px",
        },

        width: 500,
        height: 300,
        inset: 20
    });


    d3.select('#plot1').append(() => plot1)
    d3.select('#plot2').append(() => plot2)
    d3.select('#plot3').append(() => plot3)
});


d3.json("resources/diciembreData.json").then (data =>{


    let energy_dec = [];
    for (var day in data){
        energy_dec.push({day: +day, energy: +data[day]['energy']});
    }


    const plot4 = Plot.plot({
        marks: [
            Plot.line(energy_dec.slice(16, 27), {x: 'day', y: "energy", curve: 'natural'}),
        ],
        x: {
            axis: "bottom",
            label: "Dia",
            ticks: 27-16,
            labelOffset: 50,
        },
        y: {
            axis: "left",
            label: "Num. de canciones con energia alta",
            ticks: 5
        },
        style: {
            fontFamily: "Circular, sans-serif",
            fontSize: "15px",
        },

        width: 500,
        height: 300,
        inset: 20
    });


    d3.select('#plot4').append(() => plot4)
})
