// ASCII Art Effect Demo - No Camera Required
// Global variables
let matrixColumns = [];
let asciiChars = '@#S%?*+;:,. ';
let codeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>/?';
let simulatedImage;
let simulatedWidth = 640;
let simulatedHeight = 480;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create simulated image data (face-like pattern)
  simulatedImage = createImage(simulatedWidth, simulatedHeight);
  generateSimulatedFace();
  
  // Initialize Matrix background
  initMatrix();
  
  // Set initial drawing properties
  textAlign(CENTER, CENTER);
  noStroke();
  
  console.log('ASCII Effect Demo initialized!');
}

function generateSimulatedFace() {
  simulatedImage.loadPixels();
  
  // Create a gradient that simulates a face with features
  const centerX = simulatedWidth / 2;
  const centerY = simulatedHeight / 2;
  
  for (let y = 0; y < simulatedHeight; y++) {
    for (let x = 0; x < simulatedWidth; x++) {
      const index = (y * simulatedWidth + x) * 4;
      
      // Distance from center
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = sqrt(dx * dx + dy * dy);
      
      // Create face-like brightness pattern
      let brightness = 0;
      
      // Oval face shape
      const faceRadius = 150;
      if (dist < faceRadius) {
        brightness = map(dist, 0, faceRadius, 200, 100);
        
        // Add eyes (darker spots)
        const leftEyeX = centerX - 60;
        const rightEyeX = centerX + 60;
        const eyeY = centerY - 30;
        const eyeRadius = 20;
        
        const distLeftEye = sqrt((x - leftEyeX) ** 2 + (y - eyeY) ** 2);
        const distRightEye = sqrt((x - rightEyeX) ** 2 + (y - eyeY) ** 2);
        
        if (distLeftEye < eyeRadius || distRightEye < eyeRadius) {
          brightness = 50;
        }
        
        // Add nose (brighter line)
        if (abs(x - centerX) < 5 && y > eyeY + 20 && y < centerY + 40) {
          brightness = min(brightness + 50, 255);
        }
        
        // Add mouth (darker curve)
        const mouthY = centerY + 60;
        const mouthCurve = 30 * sin(map(x, centerX - 80, centerX + 80, 0, PI));
        if (abs(y - (mouthY + mouthCurve)) < 3 && abs(x - centerX) < 80) {
          brightness = 70;
        }
        
        // Add animation variation
        brightness += sin(frameCount * 0.05 + x * 0.02) * 10;
        brightness += cos(frameCount * 0.03 + y * 0.02) * 10;
      }
      
      // Add some noise for texture
      brightness += random(-10, 10);
      brightness = constrain(brightness, 0, 255);
      
      simulatedImage.pixels[index] = brightness;
      simulatedImage.pixels[index + 1] = brightness;
      simulatedImage.pixels[index + 2] = brightness;
      simulatedImage.pixels[index + 3] = 255;
    }
  }
  
  simulatedImage.updatePixels();
}

function draw() {
  // Deep black background
  background(0);
  
  // Draw Matrix-style falling code in background
  drawMatrix();
  
  // Regenerate simulated face with animation
  if (frameCount % 2 === 0) {
    generateSimulatedFace();
  }
  
  // Render ASCII art
  renderASCIIVideo();
}

function renderASCIIVideo() {
  simulatedImage.loadPixels();
  
  // Scale factors for display
  const scaleX = width / simulatedWidth;
  const scaleY = height / simulatedHeight;
  
  // ASCII character size
  const charSize = 8;
  
  // Calculate center region
  const centerX = simulatedWidth / 2;
  const centerY = simulatedHeight / 2;
  const regionWidth = simulatedWidth * 0.7;
  const regionHeight = simulatedHeight * 0.7;
  
  const startX = floor(centerX - regionWidth / 2);
  const startY = floor(centerY - regionHeight / 2);
  const endX = floor(centerX + regionWidth / 2);
  const endY = floor(centerY + regionHeight / 2);
  
  // Iterate through the region
  for (let j = startY; j < endY; j += charSize) {
    for (let i = startX; i < endX; i += charSize) {
      if (i >= 0 && i < simulatedWidth && j >= 0 && j < simulatedHeight) {
        // Get pixel brightness
        const index = (j * simulatedWidth + i) * 4;
        const brightness = simulatedImage.pixels[index];
        
        // Map brightness to ASCII character
        const charIndex = floor(map(brightness, 0, 255, asciiChars.length - 1, 0));
        const char = asciiChars[charIndex];
        
        // Calculate display position
        const displayX = i * scaleX;
        const displayY = j * scaleY;
        
        // Dynamic animation
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
          fill(255, 150, 0, 150);
          textSize(charSize * 2);
          text(char, displayX, displayY);
          
          // Random glitch effect
          if (random() < 0.02) {
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
