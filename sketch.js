// ASCII Face Effect - Cyberpunk Matrix Style
// Real-time video effect with face detection and ASCII transformation

let video;
let facemesh;
let faces = [];
let faceDetected = false;

// ASCII characters for different brightness levels (dense to sparse)
const ASCII_CHARS = [
  '@', '#', '$', '%', '&', '8', '0', 'B', 'M', 'W', 'X', 'Y', 'Z',
  'Q', 'O', 'C', 'U', 'P', 'D', 'K', 'H', 'N', 'A', 'G', 'V', 'S',
  'R', 'F', 'T', 'L', 'J', 'I', '?', '!', '{', '}', '[', ']', '(',
  ')', '|', '/', '\\', '<', '>', '+', '=', '*', '~', '^', '-', '_',
  ':', ';', ',', '.', '`', ' '
];

// Matrix rain configuration
let matrixRain = [];
const NUM_COLUMNS = 80;
let charSize = 12;
let videoReady = false;
let modelReady = false;

// Glitch and animation parameters
let glitchOffset = 0;
let scanlineY = 0;
let time = 0;

// Color palette - cyberpunk orange/amber
const COLORS = {
  primary: [255, 102, 0],      // Neon orange
  secondary: [255, 136, 0],    // Orange
  tertiary: [255, 68, 0],      // Deep orange
  amber: [255, 191, 0],        // Amber
  fire: [255, 140, 0],         // Fire orange
  background: [0, 0, 0],       // Pure black
  glow: [255, 69, 0]          // Orange red glow
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  // Initialize video capture
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Wait for video to load
  video.elt.addEventListener('loadeddata', () => {
    videoReady = true;
    checkReady();
  });

  // Initialize ml5 facemesh
  facemesh = ml5.facemesh(video, modelLoaded);
  facemesh.on('face', gotFaces);

  // Initialize Matrix rain
  initMatrixRain();

  textFont('Courier New');
  textAlign(CENTER, CENTER);
  frameRate(30);
}

function modelLoaded() {
  console.log('Facemesh model loaded!');
  modelReady = true;
  checkReady();
}

function checkReady() {
  if (videoReady && modelReady) {
    let loading = document.getElementById('loading');
    if (loading) {
      loading.style.display = 'none';
    }
  }
}

function gotFaces(results) {
  faces = results;
  faceDetected = faces.length > 0;
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

    // Initialize characters for each column
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
  // Deep black background
  background(0, 0, 0);

  time += 0.01;

  if (!videoReady) {
    return;
  }

  // Draw Matrix rain background
  drawMatrixRain();

  // Process and draw ASCII face if detected
  if (faceDetected && faces.length > 0) {
    drawASCIIFace();
  } else {
    // If no face detected, show full Matrix rain
    drawEnhancedMatrixRain();
  }

  // Add cyberpunk effects
  drawCyberpunkEffects();
}

function drawMatrixRain() {
  textSize(charSize);
  noStroke();

  for (let i = 0; i < matrixRain.length; i++) {
    let column = matrixRain[i];

    for (let j = 0; j < column.chars.length; j++) {
      let charObj = column.chars[j];

      // Orange/amber gradient based on position
      let colorMix = map(charObj.brightness, 0, 1, 0, 1);
      let r = lerp(COLORS.tertiary[0], COLORS.amber[0], colorMix);
      let g = lerp(COLORS.tertiary[1], COLORS.amber[1], colorMix);
      let b = lerp(COLORS.tertiary[2], COLORS.amber[2], colorMix);

      // Apply opacity
      let alpha = column.opacity * charObj.brightness * 255;
      fill(r, g, b, alpha);

      // Add glow effect
      if (j === 0) {
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = `rgba(${COLORS.primary[0]}, ${COLORS.primary[1]}, ${COLORS.primary[2]}, 0.8)`;
      } else {
        drawingContext.shadowBlur = 5;
        drawingContext.shadowColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
      }

      text(charObj.char, i * charSize + charSize/2, charObj.y);

      // Update position
      charObj.y += column.speed;

      // Reset when off screen
      if (charObj.y > height + charSize) {
        charObj.y = -charSize;
        charObj.char = getRandomChar();
        charObj.brightness = 1;
      }

      // Randomly change characters
      if (random(1) < 0.02) {
        charObj.char = getRandomChar();
      }
    }
  }

  drawingContext.shadowBlur = 0;
}

function drawEnhancedMatrixRain() {
  // Additional rain effect when no face is detected
  push();
  fill(255, 102, 0, 30);
  textSize(charSize * 1.5);
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = (time * 100 + i * 50) % height;
    text(getRandomChar(), x, y);
  }
  pop();
}

function drawASCIIFace() {
  if (!faces || faces.length === 0) return;

  let face = faces[0];

  // Get face bounding box from keypoints
  let minX = width, minY = height, maxX = 0, maxY = 0;

  for (let keypoint of face.keypoints) {
    let x = map(keypoint.x, 0, video.width, 0, width);
    let y = map(keypoint.y, 0, video.height, 0, height);
    minX = min(minX, x);
    maxX = max(maxX, x);
    minY = min(minY, y);
    maxY = max(maxY, y);
  }

  // Add padding
  let padding = 80;
  minX = max(0, minX - padding);
  maxX = min(width, maxX + padding);
  minY = max(0, minY - padding);
  maxY = min(height, maxY + padding);

  let faceWidth = maxX - minX;
  let faceHeight = maxY - minY;

  // ASCII character size for face
  let asciiSize = 8;
  let cols = floor(faceWidth / asciiSize);
  let rows = floor(faceHeight / asciiSize);

  // Load video pixels
  video.loadPixels();

  push();
  textSize(asciiSize);
  textAlign(CENTER, CENTER);
  noStroke();

  // Draw ASCII representation of face
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Map to video coordinates
      let vx = floor(map(x, 0, cols, minX, maxX) * video.width / width);
      let vy = floor(map(y, 0, rows, minY, maxY) * video.height / height);

      // Ensure coordinates are within video bounds
      vx = constrain(vx, 0, video.width - 1);
      vy = constrain(vy, 0, video.height - 1);

      // Get pixel color
      let pixelIndex = (vx + vy * video.width) * 4;
      let r = video.pixels[pixelIndex];
      let g = video.pixels[pixelIndex + 1];
      let b = video.pixels[pixelIndex + 2];

      // Calculate brightness
      let brightness = (r + g + b) / 3;

      // Map brightness to ASCII character
      let charIndex = floor(map(brightness, 0, 255, ASCII_CHARS.length - 1, 0));
      charIndex = constrain(charIndex, 0, ASCII_CHARS.length - 1);
      let char = ASCII_CHARS[charIndex];

      // Calculate position with animation
      let posX = minX + x * asciiSize + asciiSize/2;
      let posY = minY + y * asciiSize + asciiSize/2;

      // Add subtle wave animation
      let wave = sin(time * 2 + x * 0.1 + y * 0.1) * 2;
      posY += wave;

      // Add occasional glitch
      if (random(1) < 0.01) {
        posX += random(-5, 5);
      }

      // Color based on brightness - orange/amber palette
      let colorProgress = brightness / 255;
      let faceR = lerp(COLORS.tertiary[0], COLORS.amber[0], colorProgress);
      let faceG = lerp(COLORS.tertiary[1], COLORS.amber[1], colorProgress);
      let faceB = lerp(COLORS.tertiary[2], COLORS.amber[2], colorProgress);

      // Add glow to brighter areas
      if (brightness > 150) {
        drawingContext.shadowBlur = 15;
        drawingContext.shadowColor = `rgba(${COLORS.primary[0]}, ${COLORS.primary[1]}, ${COLORS.primary[2]}, 0.8)`;
      } else {
        drawingContext.shadowBlur = 5;
        drawingContext.shadowColor = `rgba(${faceR}, ${faceG}, ${faceB}, 0.3)`;
      }

      fill(faceR, faceG, faceB);
      text(char, posX, posY);

      // Randomly change characters for animation
      if (random(1) < 0.05) {
        let randomChar = ASCII_CHARS[floor(random(ASCII_CHARS.length))];
        text(randomChar, posX, posY);
      }
    }
  }

  drawingContext.shadowBlur = 0;
  pop();

  // Draw face keypoints with glowing dots for enhanced cyberpunk effect
  drawFaceKeypoints(face);
}

function drawFaceKeypoints(face) {
  // Draw subtle glowing points at key facial features
  push();
  noFill();

  // Select key points (eyes, nose, mouth outline)
  const keyFeatureIndices = [
    33, 133, 362, 263,  // Eyes
    1, 4, 5, 6,         // Nose
    61, 291, 17, 0      // Mouth
  ];

  for (let idx of keyFeatureIndices) {
    if (idx < face.keypoints.length) {
      let kp = face.keypoints[idx];
      let x = map(kp.x, 0, video.width, 0, width);
      let y = map(kp.y, 0, video.height, 0, height);

      // Animated glow
      let glowSize = 3 + sin(time * 3 + idx) * 2;

      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = `rgba(${COLORS.primary[0]}, ${COLORS.primary[1]}, ${COLORS.primary[2]}, 0.9)`;

      stroke(COLORS.amber[0], COLORS.amber[1], COLORS.amber[2], 200);
      strokeWeight(2);
      point(x, y);

      // Additional glow ring
      noFill();
      stroke(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2], 100);
      strokeWeight(1);
      circle(x, y, glowSize * 3);
    }
  }

  drawingContext.shadowBlur = 0;
  pop();
}

function drawCyberpunkEffects() {
  push();

  // Animated scanline
  scanlineY = (scanlineY + 2) % height;
  stroke(255, 102, 0, 50);
  strokeWeight(2);
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'rgba(255, 102, 0, 0.5)';
  line(0, scanlineY, width, scanlineY);

  // Random horizontal glitch lines
  if (random(1) < 0.05) {
    let glitchY = random(height);
    let glitchHeight = random(2, 10);
    noStroke();
    fill(255, 102, 0, 50);
    rect(0, glitchY, width, glitchHeight);
  }

  // Vignette effect
  drawingContext.shadowBlur = 0;
  let gradient = drawingContext.createRadialGradient(
    width/2, height/2, 0,
    width/2, height/2, width * 0.7
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
  drawingContext.fillStyle = gradient;
  drawingContext.fillRect(0, 0, width, height);

  // Border glow
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

// Helper function for debugging
function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('ascii-face-capture', 'png');
  }
}
