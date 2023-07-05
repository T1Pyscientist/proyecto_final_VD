// const width = 750;
// const height = 750;

// // Generate some random data for squares
// const squaresData = d3.range(50).map(() => ({
//   x: Math.random() * width,
//   y: Math.random() * height,
//   size: Math.random() * 50 + 30, // Random size between 10 and 40
// }));

// // Create SVG container
// const svg = d3.select("#collage-container");

// // Create a group for the squares
// const squares = svg.append("g")
//   .attr("class", "squares")
//   .selectAll("rect")
//   .data(squaresData)
//   .enter()
//   .append("rect")
//   .attr("class", "square")
//   .attr("width", d => d.size)
//   .attr("height", d => d.size)
//   .attr('borderRadius', '50%')
//   .attr('fill', 'red');

// // Create the force simulation
// const simulation = d3.forceSimulation(squaresData)
//   .force("collide", d3.forceCollide().radius(d => d.size/2 + 5))
//   .force("center", d3.forceRadial(0, width / 2, height / 2)) // Add force to center
//   .on("tick", () => {
//     squares
//       .attr("x", d => d.x - d.size / 2)
//       .attr("y", d => d.y - d.size / 2);
//   });

var carousel = document.querySelector('.carousel2');
var leftArrow = document.querySelector('.carousel2-arrow-left');
var rightArrow = document.querySelector('.carousel2-arrow-right');

carousel.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') {
        carousel2.scrollLeft += 200;
    } else if (e.key === 'ArrowLeft') {
        carousel2.scrollLeft -= 200;
    }
});

leftArrow.addEventListener('click', function() {
    carousel2.scrollLeft -= 200;
});

rightArrow.addEventListener('click', function() {
    carousel2.scrollLeft += 200;
});