let displayName;

class Song {
    constructor(name, artist, album, features, p, time, popularity) {
        this.name = name;
        this.artist = artist;
        this.album = album;
        this.features = features;
        this.time = time;
        this.popularity = popularity;

        this.x = 0;
        this.y = 0;

        this.acceleration = p.createVector(0, 0);
        this.velocity = p.createVector(0, 0);

    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.mult(0.98);
        this.acceleration.mult(0);
        if (this.velocity < 0.1) {
            this.velocity = 0;
        }
    }

    display(p) {
        p.push();
        let colors = ['red', 'blue', 'white']
        // Linear interpolation between colors
        let c = p.lerpColor(p.color(255, 0, 0, 150), p.color(0, 255, 0, 150), this.time);
        p.noStroke();
        p.fill(c);
        p.ellipse(this.x, this.y, this.popularity/5, this.popularity/5);
        p.pop();
    }

    hover(p) {
        let d = p.dist(p.mouseX-p.width/2, p.mouseY-p.height/2, this.x, this.y);
        p.push();
        if (d < 10) {
            p.fill(255)
            p.noStroke();
            p.ellipse(this.x, this.y, this.popularity/5, this.popularity/5);
            p.textSize(20);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(this.name, 0, -p.height*0.4);
        }
        p.pop();
    }
}

var circleSongs = function(sketch) {
    
    let data = [];
    let features_names = ["Acousticness","Danceability","Instrumentalness", 'Energy', "Valence",'Speechiness', 'Liveness']
    let featuresSong = features_names.length-2;
    let w = 600;
    let h = 600;
    let top50_short;
    let top50_medium;
    let top50_long;

    sketch.preload = function () {
        top50_short = sketch.loadJSON('./resources/top50_short.json')
        features_short = sketch.loadJSON('./resources/features_short.json')

        top50_medium = sketch.loadJSON('./resources/top50_medium.json')
        features_medium = sketch.loadJSON('./resources/features_medium.json')

        top50_long = sketch.loadJSON('./resources/top50_long.json')
        features_long = sketch.loadJSON('./resources/features_long.json')
    }
    
    let force = 3;
    
    sketch.setup = function() {
        let canvas1 = sketch.createCanvas(w, sketch.windowHeight);
        canvas1.parent('circle-viz')
        sketch.background(31);
        sketch.noLoop()

        for (let i = 0; i < 50; i++) {
            let element = top50_short.items[i];
            let songFea = features_short.audio_features[i];
            let s = new Song(
                element.name, 
                element.artists[0].name, 
                element.album.name, 
                [
                    songFea.danceability,
                    songFea.energy,
                    songFea.instrumentalness,
                    songFea.acousticness,
                    songFea.valence,
                    songFea.speechiness, 
                    songFea.liveness, 
                ], 
                sketch,
                0,
                element.popularity
            )
            data.push(s);
            for (let j = 0; j < featuresSong; j++) {
                let angle = sketch.map(j, 0, featuresSong, 0, sketch.TWO_PI);
                let x = sketch.cos(angle) * (s.features[j] * force);
                let y = sketch.sin(angle) * (s.features[j] * force);
                s.applyForce(sketch.createVector(x, y));
            }


            let element2 = top50_medium.items[i];
            let songFea2 = features_medium.audio_features[i];
            let s2 = new Song(
                element2.name, 
                element2.artists[0].name, 
                element2.album.name, 
                [
                    songFea2.danceability,
                    songFea2.energy,
                    songFea2.instrumentalness,
                    songFea2.acousticness,
                    songFea2.valence,
                    songFea2.speechiness, 
                    songFea2.liveness, 
                ], 
                sketch,
                0.5,
                element2.popularity
            )
            data.push(s2);
            for (let j = 0; j < featuresSong; j++) {
                let angle = sketch.map(j, 0, featuresSong, 0, sketch.TWO_PI);
                let x = sketch.cos(angle) * (s2.features[j] * force);
                let y = sketch.sin(angle) * (s2.features[j] * force);
                s2.applyForce(sketch.createVector(x, y));
            }


            let element3 = top50_long.items[i];
            let songFea3 = features_long.audio_features[i];
            let s3 = new Song(
                element3.name, 
                element3.artists[0].name, 
                element3.album.name, 
                [
                    songFea3.danceability,
                    songFea3.energy,
                    songFea3.instrumentalness,
                    songFea3.acousticness,
                    songFea3.valence,
                    songFea3.speechiness, 
                    songFea3.liveness, 
                ], 
                sketch,
                1,
                element3.popularity
            )
            data.push(s3);
            for (let j = 0; j < featuresSong; j++) {
                let angle = sketch.map(j, 0, featuresSong, 0, sketch.TWO_PI);
                let x = sketch.cos(angle) * (s3.features[j] * force);
                let y = sketch.sin(angle) * (s3.features[j] * force);
                s3.applyForce(sketch.createVector(x, y));
            }
        }

        const elementToAnimate = document.querySelector('#circle-viz');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    sketch.loop();
                } else {
                    sketch.noLoop();
                }
            });
        }, {threshold: 0.5});
        observer.observe(elementToAnimate);
        
    }

    sketch.draw = function() {
        sketch.background(31);
        sketch.translate(sketch.width/2, sketch.height/2)


        for (let i = 0; i < data.length; i++) {
            data[i].update();
            sketch.fill(150 + i*50)
            data[i].display(sketch);
            data[i].hover(sketch, w, h);
        }
    
        // Circulo que rodea
        for (let i = 0; i < featuresSong; i++) {
            let angle = sketch.map(i, 0, featuresSong, 0, sketch.TWO_PI);
            sketch.push();
            sketch.rotate(angle + sketch.PI/2)
            rotateText(0, 0, 250, features_names[i], sketch)
            sketch.pop();
        }

        drawGradientBox(-sketch.width*0.1, sketch.height*0.45, 150, 20, sketch.color(255, 0, 0), sketch.color(0, 255, 0),sketch)
    }
}


function rotateText(x, y, radius, txt, sketch) {

    // Split the chars so they can be printed one by one
    chars = txt.split("")

    // Decide an angle
    charSpacingAngleDeg = 2.7;

    // https://p5js.org/reference/#/p5/textAlign
    sketch.textAlign(sketch.CENTER, sketch.BASELINE)
    sketch.textSize(16)
    sketch.textStyle(sketch.BOLD)
    sketch.fill(200, 50, 50)

    // https://p5js.org/reference/#/p5/push
    // Save the current translation matrix so it can be reset
    // before the end of the function
    sketch.push()

    // Let's first move to the center of the circle
    sketch.translate(x, y)

    // First rotate half back so that middle char will come in the center
    sketch.rotate(sketch.radians(-chars.length * charSpacingAngleDeg / 2))

    for (let i = 0; i < chars.length; i++) {
        sketch.text(chars[i], 0, -radius)

        // Then keep rotating forward per character
        if (['i', 'l', 't', 'f', 'j'].includes(chars[i])) {
            sketch.rotate(sketch.radians(charSpacingAngleDeg - 1))
        } else {
            sketch.rotate(sketch.radians(charSpacingAngleDeg))
        }
    }

    // Reset all translations we did since the last push() call
    // so anything we draw after this isn't affected
    sketch.pop()
}

function drawGradientBox(x, y, w, h, color1, color2, p) {
    p.push()
    p.noStroke()
    p.text("Nueva", x-20, y-10)
    p.text("Vieja", x+w+5, y-10)

    // Calculate the total number of steps for the gradient based on the height of the box
    let steps = w;
  
    for (let i = 0; i < steps; i++) {
        // Linearly interpolate between the two colors with the current step ratio
        let currentColor = p.lerpColor(color1, color2, i / steps);
        p.fill(currentColor);
        p.rect(x+i, y, 1, h);
    }
    p.pop()
}

new p5(circleSongs);



