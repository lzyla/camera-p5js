"use strict";
let capture;
let stripes = [];
let time = 0;

function setup() {
	createCanvas(1200, 800);
	capture = createCapture(VIDEO);
	capture.hide();
	capture.size(1200, 800);

	// Tworzymy wiele pasków o różnych właściwościach
	for (let i = 0; i < 15; i++) {
		stripes.push({
			x: random(width),
			y: random(height),
			w: random(50, 300),
			h: random(100, 600),
			angle: random(TWO_PI),
			speed: random(0.0005, 0.002),
			thickness: random(5, 40),
			color: color(
				random(220, 255),
				random(80, 150),
				random(30, 80),
				random(100, 180)
			),
			offsetX: random(-100, 100),
			offsetY: random(-100, 100)
		});
	}
}


function draw() {
	time += 1;
	let mainColor = '#000000';
	let bgColor = '#f95d2d';
	background(bgColor);

	// Rysujemy animowane paski w tle
	push();
	blendMode(MULTIPLY);
	drawAnimatedStripes();
	pop();

	noStroke();
	fill(mainColor);

	if (capture.width > 0) {
		let img = capture.get(0, 0, capture.width, capture.height);
		img.loadPixels();

		const step = 7;
		for (var y = step; y < img.height; y += step) {
			for (var x = step; x < img.width; x += step) {
				const darkness = getPixelDarknessAtPosition(img, x, y);
				const radius = 20 * darkness;
				let sX = x * width / img.width;
				let sY = y * height / img.height;
				circle(sX, sY, radius);
			}
		}
	}

	// Rysujemy paski na wierzchu z innym blendem
	push();
	blendMode(SCREEN);
	drawAnimatedStripes(true);
	pop();
}

function drawAnimatedStripes(topLayer = false) {
	for (let i = 0; i < stripes.length; i++) {
		let s = stripes[i];

		// Animacja rozmiaru - bardzo powolne pulsowanie
		let sizeFactor = sin(time * s.speed + i) * 0.3 + 0.7;
		let currentW = s.w * sizeFactor;
		let currentH = s.h * sizeFactor;
		let currentThickness = s.thickness * sizeFactor;

		// Pozycja z delikatnym ruchem
		let posX = s.x + sin(time * s.speed * 0.5 + i * 0.5) * s.offsetX;
		let posY = s.y + cos(time * s.speed * 0.7 + i * 0.3) * s.offsetY;

		push();
		translate(posX, posY);
		rotate(s.angle + time * s.speed * 0.1);

		// Rysujemy paski tylko na brzegach lub na górze
		if (topLayer && i % 3 === 0) {
			// Niektóre paski na wierzchu
			fill(s.color);
			rect(-currentW/2, -currentThickness/2, currentW, currentThickness);
			rect(-currentThickness/2, -currentH/2, currentThickness, currentH);
		} else if (!topLayer) {
			// Paski w tle
			fill(s.color);
			rect(-currentW/2, -currentThickness/2, currentW, currentThickness);

			// Krzyżujące się paski
			if (i % 2 === 0) {
				rect(-currentThickness/2, -currentH/2, currentThickness, currentH);
			}
		}

		pop();
	}
}

//ignore this, initially
function getPixelDarknessAtPosition(img, x, y) {
	const mirroring = true;
	var i = y * img.width + (mirroring ? (img.width - x - 1) : x);
	return (255 - img.pixels[i * 4]) / 255;
}
