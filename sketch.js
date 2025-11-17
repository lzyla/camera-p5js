// ASCII Art Camera Effect with Face Detection and Matrix Background
// Global variables
let capture;
let faceDetector;
let detections = [];
let matrixColumns = [];
let asciiChars = '@#S%?*+;:,. ';
let codeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>/?';

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize camera capture
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
  
  // Initialize face detection with ml5.js
  faceDetector = ml5.faceApi(capture, modelReady);
  
  // Initialize Matrix background
  initMatrix();
  
  // Set initial drawing properties
  textAlign(CENTER, CENTER);
  noStroke();
}

function modelReady() {
  console.log('Face detection model loaded!');
  detectFaces();
}

function detectFaces() {
  faceDetector.detect(gotFaces);
}

function gotFaces(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  detections = results;
  detectFaces(); // Continue detecting
}

function draw() {
  // Deep black background
  background(0);
  
  // Draw Matrix-style falling code in background
  drawMatrix();
  
  // Process camera image
  capture.loadPixels();
  
  if (detections.length > 0) {
    // Render faces with ASCII art
    for (let detection of detections) {
      renderASCIIFace(detection);
    }
  }
}

function renderASCIIFace(detection) {
  const face = detection.alignedRect._box;
  const x = face._x;
  const y = face._y;
  const w = face._width;
  const h = face._height;
  
  // Scale factors for display
  const scaleX = width / capture.width;
  const scaleY = height / capture.height;
  
  // ASCII character size
  const charSize = 8;
  
  // Iterate through the face region
  for (let j = 0; j < h; j += charSize) {
    for (let i = 0; i < w; i += charSize) {
      const px = floor(x + i);
      const py = floor(y + j);
      
      if (px >= 0 && px < capture.width && py >= 0 && py < capture.height) {
        // Get pixel brightness
        const index = (py * capture.width + px) * 4;
        const r = capture.pixels[index];
        const g = capture.pixels[index + 1];
        const b = capture.pixels[index + 2];
        
        // Calculate brightness
        const brightness = (r + g + b) / 3;
        
        // Map brightness to ASCII character
        const charIndex = floor(map(brightness, 0, 255, asciiChars.length - 1, 0));
        const char = asciiChars[charIndex];
        
        // Calculate display position
        const displayX = (x + i) * scaleX;
        const displayY = (y + j) * scaleY;
        
        // Dynamic animation based on frame count and position
        const glowIntensity = map(sin(frameCount * 0.05 + i * 0.1 + j * 0.1), -1, 1, 0.5, 1);
        
        // Cyberpunk orange/amber color with glow
        const orangeIntensity = map(brightness, 0, 255, 50, 255);
        const r_display = orangeIntensity * glowIntensity;
        const g_display = (orangeIntensity * 0.5) * glowIntensity;
        const b_display = 0;
        
        // Add glow effect
        fill(r_display, g_display, b_display, 200);
        textSize(charSize * 1.5);
        text(char, displayX, displayY);
        
        // Extra glow layer for bright areas
        if (brightness > 150) {
          fill(255, 150, 0, 100);
          textSize(charSize * 2);
          text(char, displayX, displayY);
        }
      }
    }
  }
}

function initMatrix() {
  const columnWidth = 20;
  const numColumns = ceil(width / columnWidth);
  
  for (let i = 0; i < numColumns; i++) {
    matrixColumns.push({
      x: i * columnWidth,
      y: random(-height, 0),
      speed: random(2, 8),
      chars: []
    });
    
    // Initialize character trail
    const trailLength = floor(random(10, 30));
    for (let j = 0; j < trailLength; j++) {
      matrixColumns[i].chars.push({
        char: random(codeChars.split('')),
        alpha: map(j, 0, trailLength, 255, 0)
      });
    }
  }
}

function drawMatrix() {
  textAlign(CENTER, CENTER);
  
  for (let col of matrixColumns) {
    // Draw each character in the trail
    for (let i = 0; i < col.chars.length; i++) {
      const charData = col.chars[i];
      const yPos = col.y + i * 20;
      
      if (yPos > 0 && yPos < height) {
        // Leading character is brightest (amber/orange)
        if (i === 0) {
          fill(255, 180, 0, charData.alpha);
          textSize(18);
        } else {
          // Trailing characters fade to darker orange
          const orangeFade = map(i, 0, col.chars.length, 255, 100);
          fill(orangeFade, orangeFade * 0.4, 0, charData.alpha * 0.7);
          textSize(16);
        }
        
        text(charData.char, col.x, yPos);
      }
      
      // Randomly change characters for glitch effect
      if (random() < 0.05) {
        charData.char = random(codeChars.split(''));
      }
    }
    
    // Move column down
    col.y += col.speed;
    
    // Reset when column goes off screen
    if (col.y - col.chars.length * 20 > height) {
      col.y = random(-height, 0);
      col.speed = random(2, 8);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Reinitialize matrix columns for new size
  matrixColumns = [];
  initMatrix();
}
