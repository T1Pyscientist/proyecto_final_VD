

let songPlaying = function(sketch) {

  let numFeatures = 8;
  let seg_indx = 0;
  let offset = 110;
  let mins = [];
  let maxs = [];
  let features = [
    'Loudness', 
    'Brightness', 
    'Flatness', 
    'Attack', 
    'NAN',
    'NAN',
    'NAN',
    'NAN',
    'NAN'
  ]

  sketch.preload = function() {
    sketch.song = sketch.loadSound('resources/Always in My Head.mp3')
    sketch.data1 = sketch.loadJSON('resources/song_data.json')
  }
  
  sketch.setup = function() {
    let canvas2 = sketch.createCanvas(500, 500);
    sketch.frameRate(30);
    canvas2.parent('right');
    
    sketch.angleMode(sketch.DEGREES);
    fft = new p5.FFT();
    
    sketch.song.onended(() => {
      sketch.noLoop();
    });
    
    for(let j=0; j<numFeatures; j++) {
      mins[j] = 0;
      maxs[j] = 0;
    }

    for(let i=0; i<sketch.data1.segments.length; i++) {
      for(let j=0; j<numFeatures; j++) {
        mins[j] = sketch.min(sketch.data1.segments[i].timbre[j], mins[j])
        maxs[j] = sketch.max(sketch.data1.segments[i].timbre[j], maxs[j])
      }
    }
    
    sketch.noLoop();
    canvas2.mousePressed(playResume)
  }

  function playResume() {
    if (sketch.song.isPlaying()) {
      sketch.song.pause();
      sketch.noLoop();
    } else {
      sketch.song.play();
      sketch.loop();
    }
  }


  sketch.draw = function() {
    sketch.background(40, 40);
    
    // Seleccionar el segmento actual
    let currentSegment = sketch.data1.segments[seg_indx];
    if (sketch.song.currentTime() > currentSegment.start + currentSegment.duration) {
      seg_indx += 1;
      currentSegment = sketch.data1.segments[seg_indx];
    }
    

    // Circulos estaticos
    sketch.push()
    sketch.translate(sketch.width / 2, sketch.height / 2);
    sketch.noFill();
    sketch.stroke(150);
    sketch.strokeWeight(1);
    for(let i=0; i<4; i++) {
      sketch.ellipse(0, 0, 120*i, 120*i)
    }
    sketch.pop()
    
    
    sketch.translate(sketch.width / 2, sketch.height / 2);
    // Calcular los features del segmento actual y siguiente segun el tiempo
    let spectrum = [];
    for (let i=0; i<numFeatures; i++) {
      let nextSegment = sketch.data1.segments[seg_indx+1];
      spectrum[i] = sketch.lerp(
        currentSegment.timbre[i], 
        nextSegment.timbre[i],
        (sketch.song.currentTime() - currentSegment.start) / currentSegment.duration
      )
    }
      
    // Dibujar texto de los features
    for (let i = 0; i < numFeatures; i++) {
      let angle = sketch.map(i, 0, numFeatures, 0, 360) + offset; 
      sketch.push();
      sketch.rotate(angle);
      rotateText2(0, 0, 190, features[i], sketch)
      sketch.pop();
    }
      
    sketch.push()
    sketch.noFill();
    sketch.stroke(255, 150);
    sketch.beginShape();

      // First control point (same as first vertex)
    let angle = sketch.map(0, 0, numFeatures, 0, 360) + offset;
    let featureValue = sketch.map(spectrum[0], mins[0], maxs[0], 0, 100);
    let x1 = sketch.cos(angle) * 50;
    let y1 = sketch.sin(angle) * 50;
    let x2 = sketch.cos(angle) * (50 + featureValue);
    let y2 = sketch.sin(angle) * (50 + featureValue);
    sketch.curveVertex(x2, y2);
    
    for (let i = 0; i < numFeatures; i++) {
      let angle = sketch.map(i, 0, numFeatures, 0, 360) + offset;
      let featureValue = sketch.map(spectrum[i], mins[i], maxs[i], 0, 100);
      
      let x1 = sketch.cos(angle) * 50;
      let y1 = sketch.sin(angle) * 50;
      let x2 = sketch.cos(angle) * (50 + featureValue);
      let y2 = sketch.sin(angle) * (50 + featureValue);
      
      sketch.strokeWeight(3);
      sketch.curveVertex(x2, y2);
    }
    // Last control point (same as last vertex)
    angle = sketch.map(numFeatures - 1, 0, numFeatures, 0, 360) + offset;
    featureValue = sketch.map(spectrum[numFeatures - 1], mins[numFeatures - 1], maxs[numFeatures - 1], 0, 100);
    x1 = sketch.cos(angle) * 50;
    y1 = sketch.sin(angle) * 50;
    x2 = sketch.cos(angle) * (50 + featureValue);
    y2 = sketch.sin(angle) * (50 + featureValue);
    sketch.curveVertex(x2, y2);

    sketch.endShape();

    sketch.pop()
    
  }
}

function rotateText2(x, y, radius, txt, sketch) {

  // Split the chars so they can be printed one by one
  chars = txt.split("")

  // Decide an angle
  charSpacingAngleDeg = 2.7;

  // https://p5js.org/reference/#/p5/textAlign
  sketch.textAlign(sketch.CENTER, sketch.BASELINE)
  sketch.textSize(16)
  sketch.fill(255)

  // https://p5js.org/reference/#/p5/push
  // Save the current translation matrix so it can be reset
  // before the end of the function
  sketch.push()

  // Let's first move to the center of the circle
  sketch.translate(x, y)

  // First rotate half back so that middle char will come in the center
  sketch.rotate(-chars.length * charSpacingAngleDeg / 2)

  for (let i = 0; i < chars.length; i++) {
      sketch.text(chars[i], 0, -radius)

      // Then keep rotating forward per character
      if (['i', 'l', 't', 'f', 'j'].includes(chars[i])) {
          sketch.rotate(charSpacingAngleDeg-1)
      } else {
          sketch.rotate(charSpacingAngleDeg)
      }
  }

  // Reset all translations we did since the last push() call
  // so anything we draw after this isn't affected
  sketch.pop()
}

var p5sk;
window.onload = () => {
  p5sk = new p5(songPlaying);
};

// new p5(sketch.songPlaying);