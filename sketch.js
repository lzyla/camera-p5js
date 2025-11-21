// ASCII Art Camera Effect with Matrix Background
// Global variables
let capture;
let matrixColumns = [];
let asciiChars = '@#S%?*+;:,. ';
let codeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>/?';
let previousFrame;
let motionThreshold = 25;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize camera capture
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
  
  // Initialize previous frame for motion detection
  previousFrame = createImage(capture.width, capture.height);
  
  // Initialize Matrix background
  initMatrix();
  
  // Set initial drawing properties
  textAlign(CENTER, CENTER);
  noStroke();
  
  console.log('ASCII Camera Effect initialized!');
}

function draw() {
  // Deep black background
  background(0);
  
  // Draw Matrix-style falling code in background
  drawMatrix();
  
  // Process camera image
  capture.loadPixels();
  
  // Render ASCII art from camera
  renderASCIIVideo();
  
  // Update previous frame for next iteration
  updatePreviousFrame();
}

function updatePreviousFrame() {
  previousFrame.loadPixels();
  for (let i = 0; i < capture.pixels.length; i++) {
    previousFrame.pixels[i] = capture.pixels[i];
  }
  previousFrame.updatePixels();
}

function renderASCIIVideo() {
  // Scale factors for display
  const scaleX = width / capture.width;
  const scaleY = height / capture.height;
  
  // ASCII character size
  const charSize = 8;
  
  // Calculate center region (focus on face area typically in center)
  const centerX = capture.width / 2;
  const centerY = capture.height / 2;
  const regionWidth = capture.width * 0.7;
  const regionHeight = capture.height * 0.7;
  
  const startX = floor(centerX - regionWidth / 2);
  const startY = floor(centerY - regionHeight / 2);
  const endX = floor(centerX + regionWidth / 2);
  const endY = floor(centerY + regionHeight / 2);
  
  // Iterate through the center region (typical face area)
  for (let j = startY; j < endY; j += charSize) {
    for (let i = startX; i < endX; i += charSize) {
      if (i >= 0 && i < capture.width && j >= 0 && j < capture.height) {
        // Get pixel brightness
        const index = (j * capture.width + i) * 4;
        const r = capture.pixels[index];
        const g = capture.pixels[index + 1];
        const b = capture.pixels[index + 2];
        
        // Calculate brightness
        const brightness = (r + g + b) / 3;
        
        // Calculate motion (difference from previous frame)
        previousFrame.loadPixels();
        const prevR = previousFrame.pixels[index];
        const prevG = previousFrame.pixels[index + 1];
        const prevB = previousFrame.pixels[index + 2];
        const motion = abs((r - prevR) + (g - prevG) + (b - prevB)) / 3;
        
        // Map brightness to ASCII character
        const charIndex = floor(map(brightness, 0, 255, asciiChars.length - 1, 0));
        const char = asciiChars[charIndex];
        
        // Calculate display position
        const displayX = i * scaleX;
        const displayY = j * scaleY;
        
        // Dynamic animation based on frame count, position, and motion
        const glowIntensity = map(sin(frameCount * 0.05 + i * 0.1 + j * 0.1), -1, 1, 0.5, 1);
        const motionBoost = motion > motionThreshold ? 1.3 : 1.0;
        
        // Cyberpunk orange/amber color with glow
        const orangeIntensity = map(brightness, 0, 255, 50, 255) * motionBoost;
        const r_display = orangeIntensity * glowIntensity;
        const g_display = (orangeIntensity * 0.5) * glowIntensity;
        const b_display = 0;
        
        // Add glow effect
        fill(r_display, g_display, b_display, 200);
        textSize(charSize * 1.5);
        text(char, displayX, displayY);
        
        // Extra glow layer for bright areas or motion
        if (brightness > 150 || motion > motionThreshold * 2) {
          fill(255, 150, 0, 150);
          textSize(charSize * 2);
          text(char, displayX, displayY);
          
          // Glitch effect on high motion
          if (motion > motionThreshold * 3) {
            push();
            translate(random(-2, 2), random(-2, 2));
            fill(255, 100, 0, 100);
            textSize(charSize * 1.8);
            text(random(codeChars.split('')), displayX, displayY);
            pop();
          }
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
