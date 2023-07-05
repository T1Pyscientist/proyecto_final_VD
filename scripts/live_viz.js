let songPlaying = function(sketch) {
  
  let numFeatures = 5;
  let seg_indx = 0;
  let offset = 110;
  let mins = [];
  let maxs = [];
  let features = [
    'Loudness', 
    'Brightness', 
    'Flatness', 
    'Attack', 
    'Decay',
  ]

  sketch.preload = function() {
    sketch.song = sketch.loadSound('resources/songsAnalisys/0.mp3')
    sketch.data1 = sketch.loadJSON('resources/songsAnalisys/0.json')
  }
  
  sketch.setup = function() {
    let canvas2 = sketch.createCanvas(500, 500);
    sketch.frameRate(30);
    canvas2.parent('song-display');
    
    sketch.angleMode(sketch.DEGREES);
    
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
    playResume();
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
    sketch.background(255);
    
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
    sketch.stroke(80);
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
      let angle = sketch.map(i, 0, numFeatures, 0, 360); 
      sketch.push();
      sketch.rotate(angle);
      rotateText2(0, 0, 190, features[i], sketch)
      sketch.pop();
    }
      
    sketch.push()
    sketch.noFill();
    sketch.stroke(255, 200, 100, 255);
    sketch.strokeWeight(5);
    sketch.beginShape();
    sketch.rotate(-90)


      // First control point (same as first vertex)
    let angle = sketch.map(numFeatures-1, 0, numFeatures, 0, 360);
    let featureValue = sketch.map(spectrum[numFeatures-1], mins[numFeatures-1], maxs[numFeatures-1], 0, 100);
    let x2 = sketch.cos(angle) * (50 + featureValue);
    let y2 = sketch.sin(angle) * (50 + featureValue);
    sketch.curveVertex(x2, y2);
    
    for (let i = 0; i < numFeatures; i++) {
      let angle = sketch.map(i, 0, numFeatures, 0, 360);
      let featureValue = sketch.map(spectrum[i], mins[i], maxs[i], 0, 100);
      
      let x = sketch.cos(angle) * (50 + featureValue);
      let y = sketch.sin(angle) * (50 + featureValue);
      
      sketch.curveVertex(x, y);
    }

    angle = 0;
    featureValue = sketch.map(spectrum[0], mins[0], maxs[0], 0, 100);
    x2 = sketch.cos(angle) * (50 + featureValue);
    y2 = sketch.sin(angle) * (50 + featureValue);
    sketch.curveVertex(x2, y2);

    angle = sketch.map(1, 0, numFeatures, 0, 360);
    featureValue = sketch.map(spectrum[1], mins[1], maxs[1], 0, 100);
    x2 = sketch.cos(angle) * (50 + featureValue);
    y2 = sketch.sin(angle) * (50 + featureValue);
    sketch.curveVertex(x2, y2);

    sketch.endShape();

    sketch.pop()
    
  }
}

let songPlaying2 = function(sketch) {
  
  let numFeatures = 5;
  let seg_indx = 0;
  let offset = 110;
  let mins = [];
  let maxs = [];
  let features = [
    'Loudness', 
    'Brightness', 
    'Flatness', 
    'Attack', 
    'Decay',
  ]

  sketch.preload = function() {
    sketch.song = sketch.loadSound('resources/songsAnalisys/1.mp3')
    sketch.data1 = sketch.loadJSON('resources/songsAnalisys/1.json')
  }
  
  sketch.setup = function() {
    let canvas2 = sketch.createCanvas(500, 500);
    sketch.frameRate(30);
    canvas2.parent('song-display');
    
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
    playResume();
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
    sketch.background(255);
    
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
    sketch.stroke(80);
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
      let angle = sketch.map(i, 0, numFeatures, 0, 360); 
      sketch.push();
      sketch.rotate(angle);
      rotateText2(0, 0, 190, features[i], sketch)
      sketch.pop();
    }
      
    sketch.push()
    sketch.noFill();
    sketch.stroke(255, 200, 100, 255);
    sketch.strokeWeight(5);
    sketch.beginShape();
    sketch.rotate(-90)


      // First control point (same as first vertex)
    let angle = sketch.map(numFeatures-1, 0, numFeatures, 0, 360);
    let featureValue = sketch.map(spectrum[numFeatures-1], mins[numFeatures-1], maxs[numFeatures-1], 0, 100);
    let x2 = sketch.cos(angle) * (50 + featureValue);
    let y2 = sketch.sin(angle) * (50 + featureValue);
    sketch.curveVertex(x2, y2);
    
    for (let i = 0; i < numFeatures; i++) {
      let angle = sketch.map(i, 0, numFeatures, 0, 360);
      let featureValue = sketch.map(spectrum[i], mins[i], maxs[i], 0, 100);
      
      let x = sketch.cos(angle) * (50 + featureValue);
      let y = sketch.sin(angle) * (50 + featureValue);
      
      sketch.curveVertex(x, y);
    }

    angle = 0;
    featureValue = sketch.map(spectrum[0], mins[0], maxs[0], 0, 100);
    x2 = sketch.cos(angle) * (50 + featureValue);
    y2 = sketch.sin(angle) * (50 + featureValue);
    sketch.curveVertex(x2, y2);

    angle = sketch.map(1, 0, numFeatures, 0, 360);
    featureValue = sketch.map(spectrum[1], mins[1], maxs[1], 0, 100);
    x2 = sketch.cos(angle) * (50 + featureValue);
    y2 = sketch.sin(angle) * (50 + featureValue);
    sketch.curveVertex(x2, y2);

    sketch.endShape();

    sketch.pop()
    
  }
}

let songPlaying3 = function(sketch) {
  
  let numFeatures = 5;
  let seg_indx = 0;
  let offset = 110;
  let mins = [];
  let maxs = [];
  let features = [
    'Loudness', 
    'Brightness', 
    'Flatness', 
    'Attack', 
    'Decay',
  ]

  sketch.preload = function() {
    sketch.song = sketch.loadSound('resources/songsAnalisys/2.mp3')
    sketch.data1 = sketch.loadJSON('resources/songsAnalisys/2.json')
  }
  
  sketch.setup = function() {
    let canvas2 = sketch.createCanvas(500, 500);
    sketch.frameRate(30);
    canvas2.parent('song-display');
    
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
    playResume();
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
    sketch.background(255);
    
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
    sketch.stroke(80);
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
      let angle = sketch.map(i, 0, numFeatures, 0, 360); 
      sketch.push();
      sketch.rotate(angle);
      rotateText2(0, 0, 190, features[i], sketch)
      sketch.pop();
    }
      
    sketch.push()
    sketch.noFill();
    sketch.stroke(255, 200, 100, 255);
    sketch.strokeWeight(5);
    sketch.beginShape();
    sketch.rotate(-90)


      // First control point (same as first vertex)
    let angle = sketch.map(numFeatures-1, 0, numFeatures, 0, 360);
    let featureValue = sketch.map(spectrum[numFeatures-1], mins[numFeatures-1], maxs[numFeatures-1], 0, 100);
    let x2 = sketch.cos(angle) * (50 + featureValue);
    let y2 = sketch.sin(angle) * (50 + featureValue);
    sketch.curveVertex(x2, y2);
    
    for (let i = 0; i < numFeatures; i++) {
      let angle = sketch.map(i, 0, numFeatures, 0, 360);
      let featureValue = sketch.map(spectrum[i], mins[i], maxs[i], 0, 100);
      
      let x = sketch.cos(angle) * (50 + featureValue);
      let y = sketch.sin(angle) * (50 + featureValue);
      
      sketch.curveVertex(x, y);
    }

    angle = 0;
    featureValue = sketch.map(spectrum[0], mins[0], maxs[0], 0, 100);
    x2 = sketch.cos(angle) * (50 + featureValue);
    y2 = sketch.sin(angle) * (50 + featureValue);
    sketch.curveVertex(x2, y2);

    angle = sketch.map(1, 0, numFeatures, 0, 360);
    featureValue = sketch.map(spectrum[1], mins[1], maxs[1], 0, 100);
    x2 = sketch.cos(angle) * (50 + featureValue);
    y2 = sketch.sin(angle) * (50 + featureValue);
    sketch.curveVertex(x2, y2);

    sketch.endShape();

    sketch.pop()
    
  }
}

let songPlaying4 = function(sketch) {
  
  let numFeatures = 5;
  let seg_indx = 0;
  let offset = 110;
  let mins = [];
  let maxs = [];
  let features = [
    'Loudness', 
    'Brightness', 
    'Flatness', 
    'Attack', 
    'Decay',
  ]

  sketch.preload = function() {
    sketch.song = sketch.loadSound('resources/songsAnalisys/3.mp3')
    sketch.data1 = sketch.loadJSON('resources/songsAnalisys/3.json')
  }
  
  sketch.setup = function() {
    let canvas2 = sketch.createCanvas(500, 500);
    sketch.frameRate(30);
    canvas2.parent('song-display');
    
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
    playResume();
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
    sketch.background(255);
    
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
    sketch.stroke(80);
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
      let angle = sketch.map(i, 0, numFeatures, 0, 360); 
      sketch.push();
      sketch.rotate(angle);
      rotateText2(0, 0, 190, features[i], sketch)
      sketch.pop();
    }
      
    sketch.push()
    sketch.noFill();
    sketch.stroke(255, 200, 100, 255);
    sketch.strokeWeight(5);
    sketch.beginShape();
    sketch.rotate(-90)


      // First control point (same as first vertex)
    let angle = sketch.map(numFeatures-1, 0, numFeatures, 0, 360);
    let featureValue = sketch.map(spectrum[numFeatures-1], mins[numFeatures-1], maxs[numFeatures-1], 0, 100);
    let x2 = sketch.cos(angle) * (50 + featureValue);
    let y2 = sketch.sin(angle) * (50 + featureValue);
    sketch.curveVertex(x2, y2);
    
    for (let i = 0; i < numFeatures; i++) {
      let angle = sketch.map(i, 0, numFeatures, 0, 360);
      let featureValue = sketch.map(spectrum[i], mins[i], maxs[i], 0, 100);
      
      let x = sketch.cos(angle) * (50 + featureValue);
      let y = sketch.sin(angle) * (50 + featureValue);
      
      sketch.curveVertex(x, y);
    }

    angle = 0;
    featureValue = sketch.map(spectrum[0], mins[0], maxs[0], 0, 100);
    x2 = sketch.cos(angle) * (50 + featureValue);
    y2 = sketch.sin(angle) * (50 + featureValue);
    sketch.curveVertex(x2, y2);

    angle = sketch.map(1, 0, numFeatures, 0, 360);
    featureValue = sketch.map(spectrum[1], mins[1], maxs[1], 0, 100);
    x2 = sketch.cos(angle) * (50 + featureValue);
    y2 = sketch.sin(angle) * (50 + featureValue);
    sketch.curveVertex(x2, y2);

    sketch.endShape();

    sketch.pop()
    
  }
}

let songPlaying5 = function(sketch) {
  
  let numFeatures = 5;
  let seg_indx = 0;
  let offset = 110;
  let mins = [];
  let maxs = [];
  let features = [
    'Loudness', 
    'Brightness', 
    'Flatness', 
    'Attack', 
    'Decay',
  ]

  sketch.preload = function() {
    sketch.song = sketch.loadSound('resources/songsAnalisys/4.mp3')
    sketch.data1 = sketch.loadJSON('resources/songsAnalisys/4.json')
  }
  
  sketch.setup = function() {
    let canvas2 = sketch.createCanvas(500, 500);
    sketch.frameRate(30);
    canvas2.parent('song-display');
    
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
    playResume();
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
    sketch.background(255);
    
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
    sketch.stroke(80);
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
      let angle = sketch.map(i, 0, numFeatures, 0, 360); 
      sketch.push();
      sketch.rotate(angle);
      rotateText2(0, 0, 190, features[i], sketch)
      sketch.pop();
    }
      
    sketch.push()
    sketch.noFill();
    sketch.stroke(255, 200, 100, 255);
    sketch.strokeWeight(5);
    sketch.beginShape();
    sketch.rotate(-90)


      // First control point (same as first vertex)
    let angle = sketch.map(numFeatures-1, 0, numFeatures, 0, 360);
    let featureValue = sketch.map(spectrum[numFeatures-1], mins[numFeatures-1], maxs[numFeatures-1], 0, 100);
    let x2 = sketch.cos(angle) * (50 + featureValue);
    let y2 = sketch.sin(angle) * (50 + featureValue);
    sketch.curveVertex(x2, y2);
    
    for (let i = 0; i < numFeatures; i++) {
      let angle = sketch.map(i, 0, numFeatures, 0, 360);
      let featureValue = sketch.map(spectrum[i], mins[i], maxs[i], 0, 100);
      
      let x = sketch.cos(angle) * (50 + featureValue);
      let y = sketch.sin(angle) * (50 + featureValue);
      
      sketch.curveVertex(x, y);
    }

    angle = 0;
    featureValue = sketch.map(spectrum[0], mins[0], maxs[0], 0, 100);
    x2 = sketch.cos(angle) * (50 + featureValue);
    y2 = sketch.sin(angle) * (50 + featureValue);
    sketch.curveVertex(x2, y2);

    angle = sketch.map(1, 0, numFeatures, 0, 360);
    featureValue = sketch.map(spectrum[1], mins[1], maxs[1], 0, 100);
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
  sketch.fill(35)

  // https://p5js.org/reference/#/p5/push
  // Save the current translation matrix so it can be reset
  // before the end of the function
  sketch.push()

  // Let's first move to the center of the circle
  sketch.translate(x, y)

  // First rotate half back so that middle char will come in the center
  sketch.rotate((-chars.length * charSpacingAngleDeg / 2))

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

let vizLive; // Declare vizLive globally

window.addEventListener('load', () => {
  vizLive = new p5(songPlaying);
});

function selectSong(id) {
  // Stop any sound-related components
  vizLive.noCanvas();
  vizLive.song.stop();
  // vizLive.soundOut.stopAll();
  vizLive.soundLoop && vizLive.soundLoop.dispose();
  vizLive.soundRecorder && vizLive.soundRecorder.dispose();

  // Remove the previous instance
  // vizLive.remove();

  let newSong = songPlaying2;
  if (id == 1) {
    newSong = songPlaying;
  } else if (id == 2) {
    newSong = songPlaying2;
  } else if (id == 3) {
    newSong = songPlaying3;
  } else if (id == 4) {
    newSong = songPlaying4;
  } else if (id == 5) {
    newSong = songPlaying5;
  }


  // Create the new instance
  vizLive = new p5(newSong);
}


// var p5sk2;
// window.onload = () => {
// };

// new p5(songPlaying);