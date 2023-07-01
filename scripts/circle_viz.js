let displayName;
let t;
let animating;
let final_positions;
let features_short;
let features_medium;
let features_long;
let top50_short;
let top50_medium;
let top50_long;

class Song {
    constructor(i) {
        this.x = 0;
        this.y = 0;
        this.i = i;
        this.popularity=0;
    }

    update(sketch) {
        if (t < 0.5) {
            this.x = sketch.lerp(final_positions[this.i][0].x, final_positions[this.i][1].x, t*2);
            this.y = sketch.lerp(final_positions[this.i][0].y, final_positions[this.i][1].y, t*2);
            this.popularity=sketch.lerp(top50_long.items[this.i].popularity,top50_medium.items[this.i].popularity,t*2);
        } else if (t >= 0.5) {
            this.x = sketch.lerp(final_positions[this.i][1].x, final_positions[this.i][2].x, (t-0.5)*2);
            this.y = sketch.lerp(final_positions[this.i][1].y, final_positions[this.i][2].y, (t-0.5)*2);
            this.popularity=sketch.lerp(top50_medium.items[this.i].popularity,top50_short.items[this.i].popularity,(t-0.5)*2);
        }
    }

    display(p) {
        this.update(p);
        p.push();
        let colors = ['red', 'blue', 'white']
        // Linear interpolation between colors
        let c = p.lerpColor(p.color(255, 0, 0, 150), p.color(0, 255, 0, 150), t);

        // p.noStroke();
        p.fill(c);
        p.ellipse(this.x, this.y, Math.exp(this.popularity/20), Math.exp(this.popularity/20));
        p.pop();
    }
}

var circleSongs = function(sketch) {
    
    let data = [];
    final_positions = [];

    let features_names = ["Acousticness","Danceability","Instrumentalness", 'Energy', "Valence",'Speechiness', 'Liveness']
    let featuresSong = features_names.length-2;

    let w = 750;
    let h = 750;

    sketch.preload = function () {
        top50_short = sketch.loadJSON('./resources/top50_short.json')
        features_short = sketch.loadJSON('./resources/features_short.json')

        top50_medium = sketch.loadJSON('./resources/top50_medium.json')
        features_medium = sketch.loadJSON('./resources/features_medium.json')

        top50_long = sketch.loadJSON('./resources/top50_long.json')
        features_long = sketch.loadJSON('./resources/features_long.json')
    }
    
    let force = 250;
    
    sketch.setup = function() {
        let canvas1 = sketch.createCanvas(w, sketch.windowHeight);
        canvas1.parent('circle-viz')
        sketch.background(255);
        // sketch.noLoop();

        t = 0;
        animating = false;

        for (let i = 0; i < 50; i++) {
            final_positions.push([]);

            let element = top50_short.items[i];
            let songFea = features_short.audio_features[i];

            let element2 = top50_medium.items[i];
            let songFea2 = features_medium.audio_features[i];

            let element3 = top50_long.items[i];
            let songFea3 = features_long.audio_features[i];
            
            let s = new Song(i)
            data.push(s);
                
            let fin_pos_short = sketch.createVector(0, 0);
            let fin_pos_medium = sketch.createVector(0, 0);
            let fin_pos_long = sketch.createVector(0, 0);

            for (let j = 0; j < featuresSong; j++) {
                let current_feature = songFea[features_names[j].toLocaleLowerCase()];
                let current_feature2 = songFea2[features_names[j].toLocaleLowerCase()];
                let current_feature3 = songFea3[features_names[j].toLocaleLowerCase()];

                // Short songs final positions
                let angle = sketch.map(j, 0, featuresSong, 0, sketch.TWO_PI);
                let x = sketch.cos(angle) * (current_feature * force);
                let y = sketch.sin(angle) * (current_feature * force);
                fin_pos_short.add(sketch.createVector(x, y));

                // Medium songs final positions
                let x2 = sketch.cos(angle) * (current_feature2 * force);
                let y2 = sketch.sin(angle) * (current_feature2 * force);
                fin_pos_medium.add(sketch.createVector(x2, y2));

                // Long songs final positions
                let x3 = sketch.cos(angle) * (current_feature3 * force);
                let y3 = sketch.sin(angle) * (current_feature3 * force);
                fin_pos_long.add(sketch.createVector(x3, y3));

            }

            final_positions[i].push(fin_pos_long);
            final_positions[i].push(fin_pos_medium);
            final_positions[i].push(fin_pos_short);

        }

        const elementToAnimate = document.querySelector('#circle-viz');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animating = true;
                    elementToAnimate.style.position = 'sticky';
                    elementToAnimate.style.top = '0';
                    
                } else {
                    animating = false;
                }
            });
        }, {threshold: 0.95});
        observer.observe(elementToAnimate);

    }
    
    sketch.draw = function() {
        sketch.background(255);
        sketch.translate(sketch.width/2, sketch.height/2)

        for (let i = 0; i < data.length; i++) {
            sketch.fill(150 + i*50);
            data[i].display(sketch);
        }
    
        // Circulo que rodea
        for (let i = 0; i < featuresSong; i++) {
            let angle = sketch.map(i, 0, featuresSong, 0, sketch.TWO_PI);
            sketch.push();
            sketch.rotate(angle + sketch.PI/2)
            rotateText(0, 0, 300, features_names[i], sketch)
            sketch.pop();
        }
    }
}

let previousScrollTop = window.scrollY;
let total_height = document.querySelector('#extra-space').offsetHeight;
window.addEventListener('scroll', function(e) {

    const currentScrollTop = window.scrollY;
    const deltaY = currentScrollTop - previousScrollTop;
    previousScrollTop = currentScrollTop;

    if (animating) {
        t += deltaY / total_height;
        if (t > 1) {
            t = 1;
            // animating = false;
        } else if (t < 0) {
            t = 0;
            // animating = false;
        }
    }

    console.log(t*2);

});


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

new p5(circleSongs);



