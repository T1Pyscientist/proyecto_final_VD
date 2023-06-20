let offsetx;
let offsety;
let restart;
let monthsNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre','Noviembre', 'Diciembre']


function preload() {
  data = loadJSON('resources/curves_data.json');
}

function setup() {
  restart = createButton('<-');
  restart.parent('image-container')
  restart.position(windowWidth*5-200, height-100);
  restart.mousePressed(function() {
    var element = document.getElementById('image-container');
    element.style.scrollBehavior = 'smooth';
    element.scrollTo(0,0);
    element.style.scrollBehavior = 'unset';
  });

  createCanvas(windowWidth*5 , windowHeight).parent('image-container');
  background(31);

  offsetx = windowWidth/2 + 150;
  offsety = -180

  background(31);
  strokeWeight(3);
  stroke(255);

  // Draw start point
  fill(255)
  ellipse(windowWidth/2, height/2, 20, 20);
  noFill()

  // Draw line connecting starting point
  beginShape();

  curveVertex(windowWidth/2, 0);
  curveVertex(windowWidth/2, 0);

  let offsets = []

  for(let i = 1; i < 4; i++) {
    let x_offset = map(noise(i), 0, 1, -100, 100)
    offsets.push(x_offset)
    let y = map(i, 0, 4, 0, height/2);
    
    curveVertex(windowWidth/2 + x_offset, y)
  }
  curveVertex(windowWidth/2, height/2);
  curveVertex(windowWidth/2, height/2);

  endShape();

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

  push()
  translate(width/2, height/2);
  textAlign(CENTER, CENTER);
  fill(255)
  // Draw months
  for (let i = 0; i < 12; i++) {
    let x = (-width/2) + ((i)* width/13) + offsetx;
    let y = height/2 - 50;
    let month = monthsNames[i];
    text(month, x, y);
  }
  pop()

  noFill()
  strokeWeight(4);
  // Draw curves 
  // Energy Curve
  drawCurve('energy', 0.7, color(130, 134, 185));

  // Valence Curve
  drawCurve('valence', 0.7, color(134, 185, 130));

  // Acousticness Curve
  drawCurve('acousticness', 0.7, color(185, 130, 134));
}


function drawCurve(feature, scl, c) {

  stroke(c);

  beginShape();
  // Connect to start point
  curveVertex(-width/2 + windowWidth/2, 0)
  curveVertex(-width/2 + windowWidth/2, 0)
  curveVertex(-width/2 + windowWidth/2 + 300, 0)
 
  push()
  translate(width/2, height/2);

  // let xi = (-width/2) + (width/13 - 200) + offsetx;
  // let yi = map(data.months[0][(1).toString()][feature], 0, 1, height/scl, -height/scl) + offsety;
  // curveVertex(xi, yi);

  for (let i = 1; i < 12; i++) {
    let x1 = (-width/2) + ((i)* width/13) + offsetx;
    let y1 = map(data.months[i][(i+1).toString()][feature], 0, 1, height/scl, -height/scl) + offsety;

    curveVertex(x1, y1);
  } 
  
  let xf = (-width/2) + (12 * width/13) + offsetx;
  let yf = map(data.months[11][(12).toString()][feature], 0, 1, height/scl, -height/scl) + offsety;
  curveVertex(xf, yf);
  endShape();
  pop()
}