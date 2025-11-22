// ASCII FACE EFFECT - Cyberpunk Matrix
// Skopiuj cały kod do: https://editor.p5js.org
// Kliknij File -> New -> wklej ten kod

let video;
let facemesh;
let faces = [];
let faceDetected = false;

// ASCII characters for brightness mapping
const ASCII_CHARS = '@#$%&80BMWXYZQOCUPDKHNAGSVRFTLJI?!{}[]()|\/<>+=*~^-_:;,.` ';

// Matrix rain
let matrixRain = [];
const NUM_COLUMNS = 80;
let charSize = 12;
let videoReady = false;
let modelReady = false;
let time = 0;
let scanlineY = 0;

// Orange/amber color palette
const ORANGE = [255, 102, 0];
const AMBER = [255, 191, 0];
const DEEP_ORANGE = [255, 68, 0];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  // Start video capture
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  video.elt.addEventListener('loadeddata', () => {
    videoReady = true;
    console.log('Video ready!');
  });

  // Load face detection model
  facemesh = ml5.facemesh(video, () => {
    modelReady = true;
    console.log('Model loaded!');
  });

  facemesh.on('face', (results) => {
    faces = results;
    faceDetected = faces.length > 0;
  });

  // Initialize Matrix rain
  initMatrixRain();

  textFont('Courier New');
  textAlign(CENTER, CENTER);
  frameRate(30);

  // Status message
  textSize(24);
  fill(255, 102, 0);
  text('LOADING...', width/2, height/2);
}

function initMatrixRain() {
  charSize = width / NUM_COLUMNS;
  const numRows = ceil(height / charSize);

  for (let i = 0; i < NUM_COLUMNS; i++) {
    matrixRain[i] = {
      chars: [],
      speed: random(0.5, 3),
      opacity: random(0.3, 0.8)
    };

    for (let j = 0; j < numRows + 10; j++) {
      matrixRain[i].chars.push({
        char: getRandomChar(),
        y: j * charSize - random(0, height),
        brightness: 1 - (j / numRows)
      });
    }
  }
}

function getRandomChar() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*(){}[]<>?/\\|~`';
  return chars.charAt(floor(random(chars.length)));
}

function draw() {
  background(0);
  time += 0.01;

  if (!videoReady || !modelReady) {
    // Loading screen
    push();
    textSize(24);
    fill(255, 102, 0);
    textAlign(CENTER, CENTER);
    text('INITIALIZING...', width/2, height/2);
    text('Allow camera access', width/2, height/2 + 40);
    pop();
    return;
  }

  // Draw Matrix rain background
  drawMatrixRain();

  // Draw ASCII face if detected
  if (faceDetected && faces.length > 0) {
    drawASCIIFace();
  }

  // Cyberpunk effects
  drawEffects();

  // Info
  push();
  fill(255, 136, 0);
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text('CYBERPUNK ASCII v2.0 | Press S to save', 10, height - 10);
  if (faceDetected) {
    text('FACE DETECTED', 10, height - 30);
  }
  pop();
}

function drawMatrixRain() {
  textSize(charSize);
  noStroke();

  for (let i = 0; i < matrixRain.length; i++) {
    let column = matrixRain[i];

    for (let j = 0; j < column.chars.length; j++) {
      let charObj = column.chars[j];

      // Orange gradient
      let r = lerp(DEEP_ORANGE[0], AMBER[0], charObj.brightness);
      let g = lerp(DEEP_ORANGE[1], AMBER[1], charObj.brightness);
      let b = lerp(DEEP_ORANGE[2], AMBER[2], charObj.brightness);
      let alpha = column.opacity * charObj.brightness * 255;

      fill(r, g, b, alpha);

      // Glow effect
      if (j === 0) {
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = `rgba(${ORANGE[0]}, ${ORANGE[1]}, ${ORANGE[2]}, 0.8)`;
      } else {
        drawingContext.shadowBlur = 5;
      }

      text(charObj.char, i * charSize + charSize/2, charObj.y);

      // Update position
      charObj.y += column.speed;

      if (charObj.y > height + charSize) {
        charObj.y = -charSize;
        charObj.char = getRandomChar();
      }

      // Random char change
      if (random(1) < 0.02) {
        charObj.char = getRandomChar();
      }
    }
  }

  drawingContext.shadowBlur = 0;
}

function drawASCIIFace() {
  if (!faces || faces.length === 0) return;

  let face = faces[0];

  // Get face bounds
  let minX = width, minY = height, maxX = 0, maxY = 0;

  for (let kp of face.keypoints) {
    let x = map(kp.x, 0, video.width, 0, width);
    let y = map(kp.y, 0, video.height, 0, height);
    minX = min(minX, x);
    maxX = max(maxX, x);
    minY = min(minY, y);
    maxY = max(maxY, y);
  }

  // Padding
  let padding = 80;
  minX = max(0, minX - padding);
  maxX = min(width, maxX + padding);
  minY = max(0, minY - padding);
  maxY = min(height, maxY + padding);

  let faceWidth = maxX - minX;
  let faceHeight = maxY - minY;

  // ASCII resolution
  let asciiSize = 8;
  let cols = floor(faceWidth / asciiSize);
  let rows = floor(faceHeight / asciiSize);

  video.loadPixels();

  push();
  textSize(asciiSize);
  textAlign(CENTER, CENTER);
  noStroke();

  // Draw ASCII
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Map to video coords
      let vx = floor(map(x, 0, cols, minX, maxX) * video.width / width);
      let vy = floor(map(y, 0, rows, minY, maxY) * video.height / height);

      vx = constrain(vx, 0, video.width - 1);
      vy = constrain(vy, 0, video.height - 1);

      // Get pixel brightness
      let pixelIndex = (vx + vy * video.width) * 4;
      let r = video.pixels[pixelIndex];
      let g = video.pixels[pixelIndex + 1];
      let b = video.pixels[pixelIndex + 2];
      let brightness = (r + g + b) / 3;

      // Map to ASCII char
      let charIndex = floor(map(brightness, 0, 255, ASCII_CHARS.length - 1, 0));
      charIndex = constrain(charIndex, 0, ASCII_CHARS.length - 1);
      let char = ASCII_CHARS[charIndex];

      // Position with wave animation
      let posX = minX + x * asciiSize + asciiSize/2;
      let posY = minY + y * asciiSize + asciiSize/2;
      let wave = sin(time * 2 + x * 0.1 + y * 0.1) * 2;
      posY += wave;

      // Random glitch
      if (random(1) < 0.01) {
        posX += random(-5, 5);
      }

      // Orange color based on brightness
      let colorProgress = brightness / 255;
      let faceR = lerp(DEEP_ORANGE[0], AMBER[0], colorProgress);
      let faceG = lerp(DEEP_ORANGE[1], AMBER[1], colorProgress);
      let faceB = lerp(DEEP_ORANGE[2], AMBER[2], colorProgress);

      // Glow for bright areas
      if (brightness > 150) {
        drawingContext.shadowBlur = 15;
        drawingContext.shadowColor = `rgba(${ORANGE[0]}, ${ORANGE[1]}, ${ORANGE[2]}, 0.8)`;
      } else {
        drawingContext.shadowBlur = 5;
      }

      fill(faceR, faceG, faceB);
      text(char, posX, posY);

      // Random char animation
      if (random(1) < 0.05) {
        let randomChar = ASCII_CHARS[floor(random(ASCII_CHARS.length))];
        text(randomChar, posX, posY);
      }
    }
  }

  drawingContext.shadowBlur = 0;
  pop();

  // Draw glowing keypoints
  drawKeypoints(face);
}

function drawKeypoints(face) {
  push();
  noFill();

  // Key facial features
  const keyIndices = [33, 133, 362, 263, 1, 4, 5, 6, 61, 291, 17, 0];

  for (let idx of keyIndices) {
    if (idx < face.keypoints.length) {
      let kp = face.keypoints[idx];
      let x = map(kp.x, 0, video.width, 0, width);
      let y = map(kp.y, 0, video.height, 0, height);

      let glowSize = 3 + sin(time * 3 + idx) * 2;

      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = `rgba(${ORANGE[0]}, ${ORANGE[1]}, ${ORANGE[2]}, 0.9)`;

      stroke(AMBER[0], AMBER[1], AMBER[2], 200);
      strokeWeight(2);
      point(x, y);

      stroke(ORANGE[0], ORANGE[1], ORANGE[2], 100);
      strokeWeight(1);
      circle(x, y, glowSize * 3);
    }
  }

  drawingContext.shadowBlur = 0;
  pop();
}

function drawEffects() {
  push();

  // Scanline
  scanlineY = (scanlineY + 2) % height;
  stroke(255, 102, 0, 50);
  strokeWeight(2);
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'rgba(255, 102, 0, 0.5)';
  line(0, scanlineY, width, scanlineY);

  // Random glitch
  if (random(1) < 0.05) {
    let glitchY = random(height);
    noStroke();
    fill(255, 102, 0, 50);
    rect(0, glitchY, width, random(2, 10));
  }

  // Vignette
  drawingContext.shadowBlur = 0;
  let gradient = drawingContext.createRadialGradient(
    width/2, height/2, 0,
    width/2, height/2, width * 0.7
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
  drawingContext.fillStyle = gradient;
  drawingContext.fillRect(0, 0, width, height);

  // Border
  noFill();
  stroke(255, 102, 0, 30);
  strokeWeight(4);
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = 'rgba(255, 102, 0, 0.5)';
  rect(10, 10, width - 20, height - 20);

  drawingContext.shadowBlur = 0;
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initMatrixRain();
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('ascii-face', 'png');
    console.log('Screenshot saved!');
  }
}
