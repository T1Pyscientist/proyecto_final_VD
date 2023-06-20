let offsetx;
let offsety;
let restart;
let monthsNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre','Noviembre', 'Diciembre']


function preload() {
  data = loadJSON('resources/curves_data.json');
}

function setup() {

  restart = createButton('Volver');
  restart.parent('image-container')
  restart.position(windowWidth*3.2, windowHeight/2 - 20);
  restart.addClass('restart-button')
  restart.mousePressed(function() {
    var element = document.getElementById('image-container');
    element.style.scrollBehavior = 'smooth';
    element.scrollTo(0,0);
    element.style.scrollBehavior = 'unset';
  });

  createCanvas(windowWidth*3.4 , windowHeight).parent('image-container');
  background(31);

  offsetx = windowWidth/2 + 150;
  offsety = 180

  background(31);
  strokeWeight(3);
  stroke(255);

  
  // Draw line connecting starting point
  noFill()
  drawPathLine()
  drawPathLineEnd()
  
  strokeWeight(1);
  textSize(25);
  
  push();
  fill(color(130, 134, 185))
  stroke(color(130, 134, 185));
  translate(windowWidth/2 + offsetx, height/6 - 30)
  rotate(PI/11);
  text('Energy', 0, 0)
  pop();
  
  push();
  fill(color(134, 185, 130))
  stroke(color(134, 185, 130));
  translate(windowWidth/2 + offsetx, height-height/5 - 35)
  rotate(PI/11);
  text('Valence', 0, 0)
  pop();
  
  push();
  fill(color(185, 130, 134))
  stroke(color(185, 130, 134));
  translate(windowWidth/2 + offsetx, height-height/3 - 30)
  rotate(-PI/10);
  text('Acousticness', 0, 0)
  pop();
  
  drawMonths()

  noFill()
  strokeWeight(4);
  // Draw curves 
  // Energy Curve
  drawCurve('energy', color(130, 134, 185));
  
  // Valence Curve
  drawCurve('valence', color(134, 185, 130));
  
  // Acousticness Curve
  drawCurve('acousticness', color(185, 130, 134));
  
  // Draw start point
  fill(255)
  ellipse(windowWidth*0.875, height/2, 20, 20);
  
  // Draw final point
  ellipse(windowWidth * 3.125, height/2, 20, 20);
  noFill()
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function drawPathLine() {

  let verticalStep = height/10;
  let horizontalStep = windowWidth/16;

  const points = [
    new Point(windowWidth/2, 0),
    new Point(windowWidth/2 - horizontalStep, verticalStep),
    new Point(windowWidth/2 + horizontalStep, verticalStep*2),
    new Point(windowWidth/2 - horizontalStep/2, verticalStep*3.5),
    new Point(windowWidth/2 - horizontalStep*2, verticalStep*2),
    new Point(windowWidth/2 - horizontalStep*4, verticalStep),
    new Point(horizontalStep*2, verticalStep*2),
    new Point(horizontalStep*3, verticalStep*4),
    new Point(horizontalStep*4.5, verticalStep*5),
    new Point(horizontalStep*5, verticalStep*6),
    new Point(horizontalStep*4.5, verticalStep*7),
    new Point(horizontalStep*3.5, verticalStep*8),
    new Point(horizontalStep*5, verticalStep*8.5),
    new Point(horizontalStep*8, verticalStep*7),
    new Point(horizontalStep*10, verticalStep*8),
    new Point(horizontalStep*14, verticalStep*5),
  ]

  // // Draw points
  // for (let i = 0; i < points.length; i++) {
  //   let p = points[i];
  //   ellipse(p.x, p.y, 10, 10);
  // }
  push()
  textSize(20)
  text('GRAFICO', points[6].x, points[6].y)
  
  stroke(255, 255, 255, 100);
  strokeWeight(4)
  beginShape();
  curveVertex(points[0].x, points[0].y);
  curveVertex(points[0].x, points[0].y);

  for (let i = 1; i < points.length-1; i++) {
    let p = points[i];
    curveVertex(p.x, p.y);
  }
  
  curveVertex(points[points.length-1].x, points[points.length-1].y);
  curveVertex(points[points.length-1].x, points[points.length-1].y);
  
  endShape();
  pop()
}


function drawPathLineEnd() {

  let verticalStep = height/10;
  let horizontalStep = windowWidth/16;

  const points = [
    new Point(windowWidth * 3.125, height/2),
    new Point(windowWidth * 3.125 + horizontalStep/2, verticalStep*4.5),
    new Point(windowWidth * 3.125 + horizontalStep, verticalStep*3.5),
    new Point(windowWidth * 3.125 + horizontalStep*2, verticalStep*4),
    new Point(windowWidth * 3.125 + horizontalStep*2.7, verticalStep*4.1),
    new Point(windowWidth * 3.125 + horizontalStep*3, verticalStep*5),
    new Point(windowWidth * 3.125 + horizontalStep*2.7, verticalStep*6),
    new Point(windowWidth * 3.125 + horizontalStep, verticalStep*6.5),
    new Point(windowWidth * 3.125 - horizontalStep*0.5, verticalStep*8),
    new Point(windowWidth * 3.125 - horizontalStep, verticalStep*9),
    new Point(windowWidth * 3.125 - horizontalStep, verticalStep*10),
  ]

  push()

  stroke(255, 255, 255, 100);
  strokeWeight(4)
  beginShape();
  curveVertex(points[0].x, points[0].y);
  curveVertex(points[0].x, points[0].y);

  for (let i = 1; i < points.length-1; i++) {
    let p = points[i];
    curveVertex(p.x, p.y);
  }
  
  curveVertex(points[points.length-1].x, points[points.length-1].y);
  curveVertex(points[points.length-1].x, points[points.length-1].y);
  
  endShape();
  pop()
}

function drawMonths() {
  let horizontalStep = windowWidth/6;
  let x_offset = windowWidth/16 + windowWidth;

  push()
  textAlign(CENTER, CENTER);
  fill(255)

  // Draw months
  for (let i = 0; i < 12; i++) {
    let x = horizontalStep*i + x_offset
    let y = height*0.85;
    let month = monthsNames[i];
    text(month, x, y);
  }
  pop()

}

function drawCurve(feature, c) {
  
  let horizontalStep = windowWidth/6;
  let x_offset = windowWidth/16 + windowWidth;
  let scl = 0.8;
  
  stroke(c);
  beginShape();

  // Connect to start point
  curveVertex(windowWidth*0.875, height/2)
  curveVertex(windowWidth*0.875, height/2)
  curveVertex(windowWidth, height/2)

  for (let i = 0; i < 12; i++) {
    let x1 = horizontalStep*i + x_offset
    let y1 = map(data.months[i][(i+1).toString()][feature], 0, 1, height/scl, -height/scl) + offsety;

    ellipse(x1, y1, 10, 10)
    curveVertex(x1, y1);
  } 
  
  curveVertex(windowWidth * 3.125, height/2);
  curveVertex(windowWidth * 3.125, height/2);

  endShape();

}